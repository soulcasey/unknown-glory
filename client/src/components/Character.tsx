import { CharacterType, Vector2 } from "../dto";

type CharacterProps = {
    player: {
        name: string;
        characterType: CharacterType;
        position: Vector2;
        health: number;
        energy: number;
        block: number;
    };
};

const characterEmojiMap: Record<CharacterType, string> = {
    [CharacterType.Knight]: "⚔️",
    [CharacterType.Archer]: "🏹",
    [CharacterType.Rogue]: "🗡️",
};

export default function Character({ player }: CharacterProps) {
    const emoji = characterEmojiMap[player.characterType] || "❓";

    return (
        <div
            className="absolute transition-transform duration-500 ease-in-out"
            style={{
                width: "calc((100% - 6 * 0.5rem) / 7)",
                aspectRatio: "1 / 1",
                transform: `translate(
                    calc(${player.position.x * 100}% + ${player.position.x * 0.5}rem),
                    calc(${(2 - player.position.y) * 100}% + ${(2 - player.position.y) * 0.5}rem - 2px)
                )`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                fontSize: 60,
            }}
        >
            <div className="flex flex-col items-center justify-center text-white text-center leading-tight">
                <div className="text-5xl">{emoji}</div>
                <div className="text-2xl">{player.name}</div>
                <div className="text-2xl">❤️{player.health}</div>
                <div className="text-xl">
                    ⚡ {player.energy} 🛡️ {player.block}
                </div>
            </div>
        </div>
    );
}
