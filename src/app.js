const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const requestIp = require("request-ip");
const socket = require("socket.io");

require("dotenv").config();

const app = express();
const visitor = require("./routes/visitor");
const episode = require("./routes/episodes");
const chat = require("./routes/chatrooms");
const { map } = require("./episode/conan");

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestIp.mw());

app.use("/visitors", visitor);
app.use("/episodes", episode);
app.use("/chats", chat);

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
const server = app.listen(port, () => {
  console.log(`listening on ${port}`);
});

const io = socket(server);

const nicknameMap = new Map();

io.on("connection", (socket) => {
  console.log(`a user connected with socket ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`user disconnected with socket ${socket.id}`);
    nicknameMap.delete(socket.id);
  });

  socket.on("chat message", (message) => {
    console.log(`message: ${message} sent by socket ${socket.id}`);
    io.emit("chat message", {
      text: message,
      sender: nicknameMap.get(socket.id),
    });
  });

  socket.on("join chat", (nickname) => {
    console.log(`Nickname: ${nickname} set by socket ${socket.id}`);
    nicknameMap.set(socket.id, nickname);
  });
});
