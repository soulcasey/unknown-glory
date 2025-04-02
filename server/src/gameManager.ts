import { Player } from "./player";
import { Server, Socket } from "socket.io";

enum GameStep {
    Init,
    Pick,
    Select,
    Action,
    Result,
    End,
}

export class GameManager {
    currentStep: GameStep;
    players: Player[];
  
    constructor(socket: Server) {
        this.currentStep = GameStep.Init;
    }

    startGame() {
        if (this.currentStep != GameStep.Init) return;
        this.currentStep = GameStep.Pick;

        
    }
}