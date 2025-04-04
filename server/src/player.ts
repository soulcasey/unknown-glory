import { Character, CharacterType } from "./character"; // Import Character class
import { Vector2 } from "./dto";

export default class Player {
    readonly id: string;
    name: string;
    room: string;
    character: Character;
    health: number;
    position: Vector2;
    reroll: number;
    energy: number;
    block: number = 0;

    currentCards: string[] = [];
    chosenCards: string[] = [];

    constructor(id: string, name: string, type: CharacterType) {
        this.id = id;
        this.name = name;
        this.character = Character.createCharacter(type)
        
        this.resetStats()
    }

    resetStats() {
        this.health = this.character.maxHealth;
        this.reroll = 1;
        this.energy = 1;
        this.block = 0;

        this.currentCards = []
        this.chosenCards = []
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
}
