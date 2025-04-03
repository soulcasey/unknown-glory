import { Server, Socket } from "socket.io";
import Player from "./player";
import { Knight, Archer, Rogue, CharacterType, Character } from "./character";
import { Card } from "./card";
import { Console } from "console";

enum GameStep {
    Init,
    Select,
    Action,
    Result,
    End,
}

export default class GameRoom {
    private roomId: string;
    private players: Player[] = [];
    private step: GameStep = GameStep.Init;

    private priorityIndex: Number;

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    getRoomId() : string {
        return this.roomId;
    }

    getPlayers() : Player[] {
        return this.players;
    }
    
    handleDisconnect(socket: Socket) {

    }

    handleJoinRoom(io: Server, socket: Socket, name: string, type: CharacterType) {
        if (this.step != GameStep.Init) return;
        this.players.push(new Player(socket.id, name, type));

        socket.join(this.roomId);
        
        const syncPlayers = this.players.map(player => ({
            name: player.name,
            characterType: player.character.type,
            health: player.health
        }));

        io.to(this.roomId).emit("joinedRoom", { players: syncPlayers, });

        // Once 2 players join, randomly select priority player and cards
        if (this.players.length === 2) {
            this.step = GameStep.Select;
            io.to(this.roomId).emit("gameStep", { step: this.step });
            
            this.setPriority(io);
            this.players.forEach((player) => {
                this.sendRandomCards(io, player);
            });
        }
    }

    handleSelectCards(io: Server, socket: Socket, cards: number[]) {
        if (this.step != GameStep.Select) return;
        if (cards.length != 3) return;

        const player = this.getPlayer(socket);
        player.chosenCards = cards.map(i => player.currentCards[i]);

        if (this.players.filter(p => p.chosenCards.length == 3).length === this.players.length) {
            this.step = GameStep.Action;
            this.executeActions();
        }
        else {
            io.to(player.id).emit("wait");
        }
    }

    handleRerollCards(io: Server, socket: Socket) {
        if (this.step != GameStep.Select) return;

        const player = this.getPlayer(socket);
        if (player.reroll === 0) {
            return;
        }

        player.reroll--;
        
        this.sendRandomCards(io, this.getPlayer(socket));
    }

    private setPriority(io: Server) {
        this.priorityIndex = Math.round(Math.random());
        const priorityPlayer = this.players[Math.round(Math.random())].name;

        io.emit("setPriority", priorityPlayer);
    }

    private sendRandomCards(io: Server, player: Player) {
        player.currentCards = [];
        const availableIndices = Array.from({ length: player.character.cards.length }, (_, i) => i);

        while (player.currentCards.length < 5) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            player.currentCards.push(availableIndices[randomIndex]);
            availableIndices.splice(randomIndex, 1); // Remove chosen index to avoid duplicates
        }

        io.to(player.id).emit("card", {
            cards: player.currentCards,
            reroll: player.reroll
        });
    }

    private executeActions() {

        
        




        setTimeout(() => {
            this.io.to(this.roomId).emit("gameStep", { step: this.step });
            this.evaluateResults();
        }, 3000);
    }

    // private evaluateResults() {
    //     const alivePlayers = this.players.filter(p => p.health > 0);

    //     if (alivePlayers.length < 2) {
    //         this.io.to(this.roomId).emit("gameOver", { winner: alivePlayers[0]?.name || "None" });
    //         this.resetGame();
    //     } else {
    //         this.step = GameStep.End;
    //         this.io.to(this.roomId).emit("gameStep", { step: this.step });
    //     }
    // }

    private resetGame() {
        // setTimeout(() => {
        //     this.players.forEach(p => {
        //         p.character = undefined;
        //         p.health = 100;
        //     });
        //     this.step = GameStep.Pick;
        //     this.io.to(this.roomId).emit("gameStep", { step: this.step });
        // }, 5000);
    }

    private getPlayer(socket: Socket) : Player {
        const player = this.players.find(p => p.id === socket.id);
        
        if (!player) {
            console.log("ERROR! Cannot find player: " + socket.id);
        }

        return player;
    }
}