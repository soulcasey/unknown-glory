import { Server, Socket } from "socket.io";
import Player from "./player";
import { Knight, Archer, Rogue, Character } from "./character";
import { Card, CardType } from "./card";
import { Vector2, MoveData, AttackData, BlockData, PlayersData, CharacterType } from "./dto";
import { blob } from "stream/consumers";

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

    private readonly maxEnergy = 4;
    private readonly maxReroll = 2;


    private priorityIndex: number;

    constructor(roomId: string) {
        this.roomId = roomId;
    }

    getRoomId(): string {
        return this.roomId;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    handleDisconnect(socket: Socket) {
        this.players = this.players.filter(player => player.id !== socket.id);
        this.players.forEach((player, index) => {
            
            player.resetStats()
            player.position = index === 0 ? this.position1 : this.position2;
        });

        this.step = GameStep.Init;
    }

    handleJoinRoom(io: Server, socket: Socket, name: string, type: CharacterType) {
        if (this.step !== GameStep.Init) return;
        const newPlayer = new Player(socket.id, name, type);
        newPlayer.position = this.players.length === 0 ? this.position1 : this.position2
        this.players.push(newPlayer);
        socket.join(this.roomId);

        io.in(this.roomId).emit("joinedRoom", { player: newPlayer.name });
        this.updatePlayers(io)

        if (this.players.length === this.maxPlayerCount) {
            io.in(this.roomId).emit("unwait");
            
            this.step = GameStep.Select;
            // io.in(this.roomId).emit("gameStep", { step: this.step });

            this.setPriority(io);
            
            io.in(this.roomId).emit("announcement",
                "Game Start!\n" +
                this.players[0].name + " vs " + this.players[1].name + "\n" +
                "Priority player: " + this.players[this.priorityIndex].name
            );

            this.players.forEach(player => this.sendRandomCards(io, player));
        }
        else {
            io.to(newPlayer.id).emit("wait");
        }
    }

    handleSelectCards(io: Server, socket: Socket, cards: string[]) {
        if (this.step !== GameStep.Select) return;
        if (cards.length !== this.selectCardCount) return;

        const player = this.getPlayer(socket);

        if (player.chosenCards.length === this.selectCardCount) return; // If cards are already chosen

        const currentCards = [...player.currentCards];

        for (let i = 0; i < cards.length; i ++) {
            const cardKey = cards[i];
            const index = currentCards.indexOf(cardKey);
            if (index === -1) return;
            currentCards.splice(index, 1);
        }

        player.chosenCards = cards;

        if (this.players.every(p => p.chosenCards.length === this.selectCardCount)) {
            io.in(this.roomId).emit("unwait");
            this.step = GameStep.Execute;
            this.executeCards(io);
        }
        else {
            io.to(player.id).emit("wait");
        }
    }

    handleRerollCards(io: Server, socket: Socket) {
        if (this.step !== GameStep.Select) return;

        const player = this.getPlayer(socket);
        if (player.reroll < 1) {
            return;
        }

        player.reroll--;
        
        this.sendRandomCards(io, this.getPlayer(socket));
    }

    private updatePlayers(io: Server) {
        const playersData: PlayersData = {
            players: this.players.map(player => ({
                name: player.name,
                characterType: player.character.type,
                position: player.position,
                health: player.health,
                reroll: player.reroll,
                energy: player.energy,
                block: player.block,
            }))
        };

        io.in(this.roomId).emit("updatePlayers", playersData);
    }

    private setPriority(io: Server) {
        this.priorityIndex = Math.floor(Math.random() * this.players.length);
        const priorityPlayer = this.players[this.priorityIndex].name;
        io.in(this.roomId).emit("setPriority", { priorityPlayer });
    }

    private sendRandomCards(io: Server, player: Player) {
        player.currentCards = [];
        const availableIndices = [...Array(player.character.cards.length).keys()];

        while (player.currentCards.length < this.randomCardCount) {
            const randomIndex = Math.floor(Math.random() * availableIndices.length);
            const card = player.character.cards[availableIndices[randomIndex]]
            player.currentCards.push(card.key);
            availableIndices.splice(randomIndex, 1); // Remove chosen index to avoid duplicates
        }

        io.to(player.id).emit("cards", {
            cards: player.currentCards,
            reroll: player.reroll
        });
    }

    // If multiple opponent feature gets implemented, directional casting needs to be considered
    private executeCards(io: Server) {
        let playerIndex = this.priorityIndex;
        let opponentIndex = playerIndex === 1 ? 0 : 1;

        while (true) {
            const player = this.players[playerIndex];
            const cardKey = player.chosenCards.shift()
            if (cardKey === undefined) break;

            const opponent = this.players[opponentIndex];

            const card = player.character.cards.find(card => card.key === cardKey);
            const hasEnergy = player.energy >= card.cost;

            if (hasEnergy === true) {
                player.energy -= card.cost;
            }


            switch (card.type) {
                case CardType.Move:
                    if (hasEnergy === true) {
                        card.zones.forEach(zone => {
                            player.position.x = Math.max(0, Math.min(this.xSize - 1, player.position.x + zone.x * card.value));
                            player.position.y = Math.max(0, Math.min(this.ySize - 1, player.position.y + zone.y * card.value));
                        });
                    }

                    const moveData: MoveData = {
                        cardKey: cardKey,
                        cardName: card.name,
                        player: player.name,
                        newPosition: player.position,
                        hasEnergy: hasEnergy,
                        currentEnergy: player.energy
                    }

                    io.in(this.roomId).emit("moveData", { moveData });

                    break;

                case CardType.Block:
                    if (hasEnergy === true) {
                        player.block = card.value;
                    }

                    const blockData: BlockData = {
                        cardKey: cardKey,
                        cardName: card.name,
                        player: player.name,
                        block: player.block,
                        hasEnergy: hasEnergy,
                        currentEnergy: player.energy
                    }

                    io.in(this.roomId).emit("blockData", { blockData });

                    break;

                case CardType.Attack:
                    const hitZones: Vector2[] = [];
                
                    if (hasEnergy === true) {

                        const direction = opponent.position.x >= player.position.x ? 1 : -1;

                        card.zones.forEach(zone => {
                            const hitZone = {
                                x: player.position.x + zone.x * direction,
                                y: player.position.y + zone.y,
                            }

                            if (hitZone.x >= 0 && hitZone.x < this.xSize && hitZone.y >= 0 && hitZone.y < this.ySize) {
                            hitZones.push(hitZone);
                            }
                        });
                    }

                    let isHit = hitZones.some(zone => zone.x === opponent.position.x && zone.y === opponent.position.y);

                    if (isHit === true) {
                        let damage = card.value;
                        if (opponent.block > 0) {
                            damage = Math.max(0, damage - opponent.block);
                            opponent.block = 0;
                        }    

                        opponent.health = Math.max(0, opponent.health - damage);
                    }
                    
                    
                    const attackData: AttackData = {
                        cardKey: cardKey,
                        cardName: card.name,
                        player: player.name,
                        hitZones: hitZones,
                        opponent: isHit ? {
                            name: opponent.name,
                            health: opponent.health,
                            block: opponent.block,
                        } : undefined,
                        hasEnergy: hasEnergy,
                        currentEnergy: player.energy
                    }

                    io.in(this.roomId).emit("attackData", { attackData });

                    break;
            }

            if (player.health <= 0 || opponent.health <= 0) {
                break;
            }

            [playerIndex, opponentIndex] = [opponentIndex, playerIndex];
        }

        this.evaluateResults(io);
    }

    private evaluateResults(io: Server) {
        const alivePlayers = this.players.filter(player => player.health > 0);
        // const deadPlayers = this.players.filter(player => player.health <= 0);

        if (alivePlayers.length <= 1) {
            this.step = GameStep.End;
            io.in(this.roomId).emit("end", { winner: alivePlayers.map(player => player.name) });
        }
        else {
            this.step = GameStep.Result;

            alivePlayers.forEach(player => {
                if (player.energy <= this.maxEnergy) {
                    player.energy++;
                }
                
                if (player.reroll <= this.maxReroll) {
                    player.reroll += 0.5;
                }
            })


            this.step = GameStep.Select;
            
            this.updatePlayers(io)
            this.setPriority(io);
            this.players.forEach(player => this.sendRandomCards(io, player));
        }
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
        
        if (player === undefined) {
            console.log("ERROR! Cannot find player: " + socket.id);
        }

        return player;
    }
}