import { Card, CardType } from "./card";

// Enum for the type of card
enum CharacterType {
    Knight = "Knight",
    Archer = "Archer",
    Rogue = "Rogue",
}

// Abstract Character class
export abstract class Character {
    readonly type: CharacterType;
    readonly maxHealth: number;
    readonly cards: Card[];
  
    // Abstract constructor forces the subclass to initialize its properties
    constructor(type: CharacterType, maxHealth: number, cards: Card[]) {
        this.type = type;
        this.maxHealth = maxHealth;
        this.cards = cards;
    }
}

export class Archer extends Character {
    constructor() {
        super(
            CharacterType.Archer, 100, [
                new Card("Move Left", CardType.Move, 1, 0, [{ x: -1, y: 0 }]),
                new Card("Move Right", CardType.Move, 1, 0, [{ x: 1, y: 0 }]),
                new Card("Move Up", CardType.Move, 1, 0, [{ x: 0, y: 1 }]),
                new Card("Move Down", CardType.Move, 1, 0, [{ x: 0, y: -1 }]),
        
                new Card("Block", CardType.Block, 5, 1, [{ x: 0, y: 0 }]),
        
                new Card("Attack", CardType.Attack, 10, 0, [
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                    { x: 3, y: 0 },
                ]),
                new Card("Special 1", CardType.Attack, 15, 1, [
                    { x: 2, y: -1 },
                    { x: 2, y: 0 },
                    { x: 2, y: 1 },
                    { x: 3, y: -1 },
                    { x: 3, y: 0 },
                    { x: 3, y: 1 },
                ]),
                new Card("Special 2", CardType.Attack, 15, 2, [
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                    { x: 3, y: 0 },
                    { x: 4, y: 0 },
                    { x: 5, y: 0 },
                    { x: 6, y: 0 },
                ]),
                new Card("Ultimate", CardType.Attack, 15, 3, [
                    { x: 4, y: -1 },
                    { x: 4, y: 0 },
                    { x: 4, y: 1 },
                    { x: 5, y: -1 },
                    { x: 5, y: 0 },
                    { x: 5, y: 1 },
                    { x: 6, y: -1 },
                    { x: 6, y: 0 },
                    { x: 6, y: 1 },
                ]),
            ]
        );
    }
}