import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { Player } from "./src/player";
import { GameManager } from "./src/gameManager";

const app = express();
const httpServer = http.createServer(app);

const socketIO = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const gameManager = new GameManager(socketIO);
let players: { [key: string]: Player } = {};

console.log("Server Started");

socketIO.on("connection", (socket: Socket) => {
  const player = new Player(socket.id);
  players[socket.id] = player;

  console.log("Player Connected: " + socket.id);
  socket.join("lobby");

  socket.on("disconnect", () => {
    console.log("Player Disconnected: " + socket.id);
    delete players[socket.id];
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
