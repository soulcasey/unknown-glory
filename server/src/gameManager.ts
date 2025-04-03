import { Server, Socket } from "socket.io";
import GameRoom from "./gameRoom";
import { CharacterType } from "./character";

export default class GameManager {
    private io: Server;
    private rooms: Map<string, GameRoom> = new Map();

    private playerRoomId: Map<string, string> = new Map(); // Player Room KeyPair for faster filtering

    constructor(io: Server) {
        this.io = io;
        this.setupSocketEvents();
    }

    private setupSocketEvents() {
        this.io.on("connection", (socket: Socket) => {

            console.log(socket.id + " connected");

            socket.on("joinRoom", ({ roomId, name, type }) => this.handleJoinRoom(socket, roomId, name, type));
            socket.on("disconnect", () => this.handleDisconnect(socket));

            socket.on("selectCards", (cards : number[]) => this.getRoom(socket)?.handleSelectCards(this.io, socket, cards));
            socket.on("rerollCards", (x: number) => this.getRoom(socket)?.handleRerollCards(this.io, socket));
        });
    }

    private handleJoinRoom(socket: Socket, roomId: string, name: string, type: CharacterType) {
        if (this.rooms.has(roomId) === false) {
            this.rooms.set(roomId, new GameRoom(roomId));
        }

        const room = this.rooms.get(roomId);

        if (room.getPlayers().length >= 2) {
            socket.emit("roomFull");
            return;
        }

        if (room.getPlayers().some(player => player.name === name)) {
            socket.emit("nameTaken");
            return;
        }

        this.playerRoomId.set(socket.id, roomId);
        room.handleJoinRoom(this.io, socket, name, type);
    }

    private handleDisconnect(socket: Socket) {

        console.log(socket.id + " disconnected");

        const room = this.getRoom(socket)

        if (!room) return;

        room.handleDisconnect(socket);
        if (room.getPlayers().length === 0) {
            this.rooms.delete(room.getRoomId());
        }
    }

    private getRoom(socket: Socket) : GameRoom {
        return this.rooms.get(this.playerRoomId.get(socket.id))
    }

    getStatus() {
        const status: Record<string, string[]> = {};
        for (const [roomId, room] of this.rooms.entries()) {
            status[roomId] = room.getPlayers().map(player => player.name);
        }
        return status;
    }
}