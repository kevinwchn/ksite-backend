const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const requestIp = require("request-ip");

require("dotenv").config();

const app = express();
const routes = require('./routes')

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestIp.mw());

app.use('/', routes);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
  }
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
