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
    speech: string | null;
};

const characterImageMap: Record<CharacterType, string> = {
    [CharacterType.Knight]: "/characters/Knight.gif",
    [CharacterType.Archer]: "/characters/Archer.gif",
    [CharacterType.Rogue]: "/characters/Rogue.gif",
};

export default function Character({ player, speech }: CharacterProps) {
    const characterImage = characterImageMap[player.characterType];

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
                fontSize: "clamp(0.2rem, 2.5vw, 2rem)",
                textAlign: "center",
            }}
        >
            <div className="flex flex-col items-center justify-center leading-tight w-full h-full relative">

                {speech && (
                    <div className="absolute -top-[1rem] w-full flex justify-center z-10 pointer-events-none">
                        <div className="bg-black text-white text-[0.9em] px-3 py-1 rounded-full shadow-md border border-black/20 whitespace-nowrap">
                            {speech}
                        </div>
                    </div>
                )}

                <img
                    src={characterImage}
                    alt={player.characterType}
                    className="w-[60%] h-[60%] object-contain"
                />
                <div className="text-[0.9em]">{player.name}</div>
            </div>
        </div>
    );
}
