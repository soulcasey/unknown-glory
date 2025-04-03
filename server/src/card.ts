import { Vector2 } from "./define";

// Enum for the type of card
export enum CardType {
    Move = "Move",
    Block = "Block",
    Attack = "Attack",
}

// Card class definition
export class Card {
    readonly index: number;
    readonly name: string
    readonly type: CardType;
    readonly value: number;
    readonly cost: number;
    readonly zone: Vector2[];

    constructor(index: number, name: string, type: CardType, value: number, cost: number, zone: Vector2[]) {
        this.index = index;
        this.name = name
        this.type = type;
        this.value = value;
        this.zone = zone;
        this.cost = cost;
    }
}