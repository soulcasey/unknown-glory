import { Character, CharacterType } from "./character"; // Import Character class
import { Vector2 } from "./define";

export default class Player {
    readonly id: string;
    name: string;
    room: string;
    character: Character;
    health: number;
    position: Vector2;
    reroll: number;
    cost: number;

    currentCards: number[] = [];
    chosenCards: number[] = [];

    constructor(id: string, name: string, type: CharacterType) {
        this.id = id;
        this.name = name;
        this.character = Character.createCharacter(type)
        
        this.resetStats()
    }

    resetStats() {
        this.health = this.character.maxHealth;
        this.reroll = 1;
        this.cost = 1;
    }


    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
}
