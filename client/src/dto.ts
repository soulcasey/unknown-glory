export enum CharacterType {
    Knight = "Knight",
    Archer = "Archer",
    Rogue = "Rogue",
}

export interface JoinRoomData {
    roomId: string;
    name: string;
    characterType: CharacterType;
}

export interface Vector2 {
    x: number;
    y: number;
}