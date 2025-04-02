import { Character } from "./character"; // Import Character class
import { Vector2 } from "./define";

export class Player {
    readonly id: string;
    character: Character;
    health: number;
    position: Vector2;

    constructor(id: string) {
        this.id = id;
    }

    chooseCharacter(character: Character) {
        this.character = character;
        this.health = character.maxHealth;
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
}
