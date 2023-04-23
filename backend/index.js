const express = require('express')
const app = express()
const port = 3000

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: '*',
      }
});

io.on("connection", (socket) => {
    socket.on('send_message', ({ sender, message }) => {
        io.emit("receive_message", { sender, message });
    });
});

server.listen(port);