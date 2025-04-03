import { Server, Socket } from "socket.io";
import Player from "./player";
import { Knight, Archer, Rogue, CharacterType, Character } from "./character";
import { Card, CardType } from "./card";
import { Console } from "console";
import { Vector2 } from "./define";

enum GameStep {
    Init,
    Select,
    Execute,
    Result,
    End,
}

export default class GameRoom {
    private roomId: string;
    private players: Player[] = [];
    private step: GameStep = GameStep.Init;

    private readonly xSize = 7;
    private readonly ySize = 3;

    private readonly position1: Vector2 = { x: 1, y: 1 };
    private readonly position2: Vector2 = { x: 5, y: 1 };

    private readonly randomCardCount = 5;
    private readonly selectCardCount = 3;

    private readonly maxPlayerCount = 2;
    

    private priorityIndex: number;

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
    
        io.to(this.roomId).emit("joinedRoom", { name: name, });

        // Once max players join, randomly select priority player and cards
        if (this.players.length === this.maxPlayerCount) {
            this.step = GameStep.Select;
            io.to(this.roomId).emit("gameStep", { step: this.step });

            // Initialize position
            this.players.forEach((player, index) => {
                player.position = index === 0 ? this.position1 : this.position2;
            });

            this.updatePlayers(io)
            this.setPriority(io);
            this.players.forEach((player) => {
                this.sendRandomCards(io, player);
            });
        }
    }

    handleSelectCards(io: Server, socket: Socket, cards: number[]) {
        if (this.step != GameStep.Select) return;
        if (cards.length != this.selectCardCount) return;

        const player = this.getPlayer(socket);
        player.chosenCards = cards.map(i => player.currentCards[i]);

        if (this.players.filter(p => p.chosenCards.length == 3).length === this.players.length) {
            this.step = GameStep.Execute;
            this.executeCards();
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

    private updatePlayers(io: Server) {
        const players = this.players.map(player => ({
            name: player.name,
            characterType: player.character.type,
            position: player.position,
            health: player.health,
            isBlock: player.isBlock
        }));

        io.emit("updatePlayers", players);
    }

    private setPriority(io: Server) {
        this.priorityIndex = Math.round(Math.random());
        const priorityPlayer = this.players[Math.round(Math.random())].name;

        io.emit("setPriority", priorityPlayer);
    }

    private sendRandomCards(io: Server, player: Player) {
        player.currentCards = [];
        const availableIndices = [...Array(player.character.cards.length).keys()];

        while (player.currentCards.length < this.randomCardCount) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            player.currentCards.push(availableIndices[randomIndex]);
            availableIndices.splice(randomIndex, 1); // Remove chosen index to avoid duplicates
        }

        io.to(player.id).emit("card", {
            cards: player.currentCards,
            reroll: player.reroll
        });
    }

    // If multiple opponent feature gets implemented, directional casting needs to be considered
    private executeCards() {
        let playerIndex = this.priorityIndex
        let opponentIndex = playerIndex === 1 ? 0 : 1;

        while (true) {
            const player = this.players[playerIndex];
            const cardIndex = player.chosenCards.shift()
            if (!cardIndex) break;

            const opponent = this.players[opponentIndex];

            const card = player.character.cards[cardIndex];

            switch (card.type) {
                case CardType.Move:
                    card.zones.forEach(zone => {
                        player.position.x = Math.max(0, Math.min(this.xSize - 1, player.position.x + zone.x));
                        player.position.y = Math.max(0, Math.min(this.ySize - 1, player.position.y + zone.y));
                    });
                    break;

                case CardType.Block:
                    player.isBlock = true;
                    break;

                case CardType.Attack:
                    const hitZones = new Set<Vector2>();
                    const direction = opponent.position.x >= player.position.x ? 1 : -1;
                    
                    card.zones.forEach(zone => {
                        const hitZone = {
                            x: player.position.x + zone.x * direction,
                            y: player.position.y + zone.y,
                        }

                        if (hitZone.x >= 0 && hitZone.x < this.xSize && hitZone.y >= 0 && hitZone.y < this.ySize) {
                            hitZones.add(hitZone);
                        }
                    });

                    if (hitZones.has(opponent.position)) {
                        opponent.health = Math.max(opponent.health - card.value, 0);
                    }
                    break;
            }

            if (player.health <= 0 || opponent.health <= 0) {
                break;
            }
        }

        this.step = GameStep.Result;
        this.evaluateResults();
    }

    private evaluateResults() {
        // const alivePlayers = this.players.filter(p => p.health > 0);

        // if (alivePlayers.length < 2) {
        //     this.io.to(this.roomId).emit("gameOver", { winner: alivePlayers[0]?.name || "None" });
        //     this.resetGame();
        // } else {
        //     this.step = GameStep.End;
        //     this.io.to(this.roomId).emit("gameStep", { step: this.step });
        // }
    }

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