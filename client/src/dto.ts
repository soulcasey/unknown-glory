export enum CharacterType {
    Knight = "Knight",
    Archer = "Archer",
    Rogue = "Rogue",
}

// Enum for the type of card
export enum CardType {
    Move = "Move",
    Block = "Block",
    Attack = "Attack",
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface JoinRoomData {
    roomId: string;
    name: string;
    characterType: CharacterType;
}

export interface RoomData {
    roomId: string;
    round: number;
    players: {
        name: string;
        characterType: CharacterType;
        position: Vector2;
        health: number;
        reroll: number;
        energy: number;
        block: number;
        isPriority: boolean;
    }[]
}

export interface CardActionData {
    player: {
        name: string;
        index: Number;
        hasEnergy: boolean,
    };
    card : {
        key: string;
        name: string;
        type: CardType;
    }

    hitZones: Vector2[];
}

export interface CardSelectionData {
    player: {
        name: string;
        reroll: number;
    };

    cards: {
        key: string;
        name: string;
        type: CardType;
        value: number;
        cost: number;
        zone: Vector2[];
    }[];
}