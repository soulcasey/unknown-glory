import express from "express";
import http from "http";
import { Server } from "socket.io";
import GameManager from "./src/gameManager";

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["https://unknownglory.netlify.app,", "http://localhost:5173"],  // Allow connections from any origin
        methods: ["GET", "POST"],
    },
});

const gameManager = new GameManager(io);

app.get("/", (req, res) => {
    res.send(gameManager.getStatus());
});

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});
