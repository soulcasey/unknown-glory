import React from "react";
import { CharacterType, Vector2 } from "../dto";

type CharacterProps = {
    type: CharacterType;
    position: Vector2;
    name: string;
    health: number;
    energy: number;
    block: number;
};

const characterEmojiMap: Record<CharacterType, string> = {
    [CharacterType.Knight]: "⚔️",
    [CharacterType.Archer]: "🏹",
    [CharacterType.Rogue]: "🗡️",
};

export default function Character(props: CharacterProps) {
    const emoji = characterEmojiMap[props.type] || "❓";

    return (
        <div
            className="absolute transition-transform duration-500 ease-in-out"
            style={{
                width: "calc((100% - 6 * 0.5rem) / 7)",
                aspectRatio: "1 / 1",
                transform: `translate(
                    calc(${props.position.x * 100}% + ${props.position.x * 0.5}rem),
                    calc(${(2 - props.position.y) * 100}% + ${(2 - props.position.y) * 0.5}rem - 2px)
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
                <div className="text-2xl">{props.name}</div>
                <div className="text-2xl">❤️{props.health}</div>
                <div className="text-xl">
                    ⚡ {props.energy} 🛡️ {props.block}
                </div>
            </div>
        </div>
    );
}