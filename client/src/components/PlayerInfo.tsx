import { RoomData } from "../dto";

// Add at top of file or extract to components/PlayerBox.tsx
export default function PlayerBox({ players }: { players: RoomData["players"] }) {
    return (
        <div className="flex flex-col gap-4 w-1/3 bg-gray-700 p-4 rounded-lg">
            {players.map((player) => (
                <div key={player.name}>
                    <h3 className="text-lg font-semibold">
                        Player: {player.name} ({player.characterType}) {player.isPriority ? "🥇" : ""}
                    </h3>
                    <h3 className="text-lg font-semibold">❤️: {player.health}</h3>
                    <h3 className="text-lg font-semibold">⚡: {player.energy}</h3>
                    <h3 className="text-lg font-semibold">🛡️: {player.block}</h3>
                </div>
            ))}
        </div>
    );
}