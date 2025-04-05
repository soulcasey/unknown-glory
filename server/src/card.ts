import { Vector2, CardType } from "./dto";


// Card class definition
export default class Card {
    readonly key: string;
    readonly name: string
    readonly type: CardType;
    readonly value: number;
    readonly cost: number;
    readonly zones: Vector2[];

    constructor(key: string, name: string, type: CardType, value: number, cost: number, zone: Vector2[]) {
        this.key = key;
        this.name = name
        this.type = type;
        this.value = value;
        this.zones = zone;
        this.cost = cost;
    }
}