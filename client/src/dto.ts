// Enum for the type of card
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