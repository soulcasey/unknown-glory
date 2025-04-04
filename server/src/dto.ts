export enum CharacterType {
    Knight = "Knight",
    Archer = "Archer",
    Rogue = "Rogue",
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

export interface PlayersData {
    players: {
        name: string;
        characterType: CharacterType;
        position: Vector2;
        health: number;
        reroll: number;
        energy: number;
        block: number;
    }[]
}

interface CardExecute {
    player: string;
    cardKey: string;
    cardName: string;
    hasEnergy: boolean,
    currentEnergy: number;
}

export interface MoveData extends CardExecute{
    newPosition: Vector2;
}

export interface AttackData extends CardExecute{
    hitZones: Vector2[];
    opponent: {
        name: string;
        health: number;
        block: number;
    };
}

export interface BlockData extends CardExecute{
    block: number;
}