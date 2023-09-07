import express from "express";
import { config } from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./Actions.js";
import { join } from "path";

export const app = express();

config({
  path: "./config/config.env",
});

const server = http.createServer(app);

const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClient(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomID, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomID);

    const clients = getAllConnectedClient(roomID);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ socketId, code }) => {
    socket.in(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomID) => {
      socket.in(roomID).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.get("/", (req, res) => {
  res.send("HELL ITS WORKING");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server Running on ${process.env.PORT}`);
});
