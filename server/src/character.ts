import Card from "./card";
import { CharacterType, CardType } from "./dto";

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

    static createCharacter(type: CharacterType): Character {
        switch (type) {
            case CharacterType.Knight:
                return new Knight();
            case CharacterType.Archer:
                return new Archer();
            case CharacterType.Rogue:
                return new Rogue();
            default:
                throw new Error(`Invalid character type: ${type}`);
        }
    }
}

export class Archer extends Character {
    constructor() {
        super(
            CharacterType.Archer, 100, [
                new Card("L1", "Move Left",   CardType.Move, 1, 0, [{ x: -1, y: 0 }]),
                new Card("L1", "Move Left",   CardType.Move, 1, 0, [{ x: -1, y: 0 }]),
                new Card("R1", "Move Right",  CardType.Move, 1, 0, [{ x: 1, y: 0 }]),
                new Card("R1", "Move Right",  CardType.Move, 1, 0, [{ x: 1, y: 0 }]),
                new Card("U1", "Move Up",     CardType.Move, 1, 0, [{ x: 0, y: 1 }]),
                new Card("U1", "Move Up",     CardType.Move, 1, 0, [{ x: 0, y: 1 }]),
                new Card("D1", "Move Down",   CardType.Move, 1, 0, [{ x: 0, y: -1 }]),
                new Card("D1", "Move Down",   CardType.Move, 1, 0, [{ x: 0, y: -1 }]),
        
                new Card("B", "Block",       CardType.Block, 5, 1, [{ x: 0, y: 0 }]),
        
                new Card("A", "Attack",      CardType.Attack, 10, 0, [
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                    { x: 3, y: 0 },
                ]),
                new Card("S1", "Special 1",   CardType.Attack, 15, 1, [
                    { x: 2, y: -1 },
                    { x: 2, y: 0 },
                    { x: 2, y: 1 },
                    { x: 3, y: -1 },
                    { x: 3, y: 0 },
                    { x: 3, y: 1 },
                ]),
                new Card("S2", "Special 2",   CardType.Attack, 15, 2, [
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                    { x: 3, y: 0 },
                    { x: 4, y: 0 },
                    { x: 5, y: 0 },
                    { x: 6, y: 0 },
                ]),
                new Card("ULT", "Ultimate",    CardType.Attack, 50, 3, [
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

export class Knight extends Character {
    constructor() {
        super(
            CharacterType.Knight, 150, [
                new Card("L1", "Move Left",   CardType.Move, 1, 0, [{ x: -1, y: 0 }]),
                new Card("L1", "Move Left",   CardType.Move, 1, 0, [{ x: -1, y: 0 }]),
                new Card("R1", "Move Right",  CardType.Move, 1, 0, [{ x: 1, y: 0 }]),
                new Card("R1", "Move Right",  CardType.Move, 1, 0, [{ x: 1, y: 0 }]),
                new Card("U1", "Move Up",     CardType.Move, 1, 0, [{ x: 0, y: 1 }]),
                new Card("U1", "Move Up",     CardType.Move, 1, 0, [{ x: 0, y: 1 }]),
                new Card("D1", "Move Down",   CardType.Move, 1, 0, [{ x: 0, y: -1 }]),
                new Card("D1", "Move Down",   CardType.Move, 1, 0, [{ x: 0, y: -1 }]),
        
                new Card("B", "Block",       CardType.Block, 15, 1, [{ x: 0, y: 0 }]),
        
                new Card("A", "Attack",      CardType.Attack, 20, 0, [
                    { x: 1, y: 0 },
                ]),
                new Card("S1", "Special 1",   CardType.Attack, 30, 1, [
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                ]),
                new Card("S2", "Special 2",   CardType.Attack, 30, 2, [
                    { x: 1, y: 1 },
                    { x: 1, y: 0 },
                    { x: 1, y: -1 },
                ]),
                new Card("ULT", "Ultimate",    CardType.Attack, 90, 3, [
                    { x: 1, y: 0 },
                ]),
            ]
        );
    }
}

export class Rogue extends Character {
    constructor() {
        super(
            CharacterType.Rogue, 120, [
                new Card("L1", "Move Left",   CardType.Move, 1, 0, [{ x: -1, y: 0 }]),
                new Card("L2", "Jump Left",   CardType.Move, 2, 0, [{ x: -1, y: 0 }]),
                new Card("R1", "Move Right",  CardType.Move, 1, 0, [{ x: 1, y: 0 }]),
                new Card("R2", "Jump Right",  CardType.Move, 2, 0, [{ x: 1, y: 0 }]),
                new Card("U1", "Move Up",     CardType.Move, 1, 0, [{ x: 0, y: 1 }]),
                new Card("U2", "Jump Up",     CardType.Move, 2, 0, [{ x: 0, y: 1 }]),
                new Card("D1", "Move Down",   CardType.Move, 1, 0, [{ x: 0, y: -1 }]),
                new Card("D2", "Jump Down",   CardType.Move, 2, 0, [{ x: 0, y: -1 }]),
        
                new Card("B", "Block", CardType.Block, 10, 1, [{ x: 0, y: 0 }]),
        
                new Card("A", "Attack", CardType.Attack, 15, 0, [
                    { x: 1, y: 0 },
                    { x: 2, y: 0 },
                ]),
                new Card("S1", "Special 1", CardType.Attack, 20, 1, [
                    { x: 1, y: 0 },
                    { x: 2, y: 1 },
                    { x: 2, y: -1 },
                ]),
                new Card("S2", "Special 2", CardType.Attack, 20, 2, [
                    { x: 0, y: 1 },
                    { x: 0, y: -1 },
                    { x: 3, y: 0 },
                ]),
                new Card("ULT", "Ultimate", CardType.Attack, 40, 3, [
                    { x: 1, y: 1 },
                    { x: 1, y: -1 },
                    { x: 3, y: 1 },
                    { x: 3, y: -1 },
                    { x: 5, y: 1 },
                    { x: 5, y: -1 },
                    { x: 6, y: 0 }
                ]),
            ]
        );
    }
}