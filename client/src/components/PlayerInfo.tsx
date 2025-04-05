import { useState, useEffect } from "react";
import { RoomData } from "../dto";

export default function PlayerBox({ players }: { players: RoomData["players"] }) {
    return (
        <div className="flex flex-col gap-4 w-1/3 bg-gray-700 p-4 rounded-lg">
            {players.map((player) => (
                <PlayerDetails key={player.name} player={player} />
            ))}
        </div>
    );
}

function PlayerDetails({ player }: { player: RoomData["players"][0] }) {
    const [prevHealth, setPrevHealth] = useState<number | null>(player.health);
    const [prevEnergy, setPrevEnergy] = useState<number | null>(player.energy);
    const [prevBlock, setPrevBlock] = useState<number | null>(player.block);
    
    const [healthChange, setHealthChange] = useState<number | null>(null);
    const [energyChange, setEnergyChange] = useState<number | null>(null);
    const [blockChange, setBlockChange] = useState<number | null>(null);

    useEffect(() => {
        if (player.health !== prevHealth) {
            setHealthChange(player.health - (prevHealth || 0));
            setPrevHealth(player.health);
            setTimeout(() => setHealthChange(null), 2000);  // Hide after 1 second
        }
        if (player.energy !== prevEnergy) {
            setEnergyChange(player.energy - (prevEnergy || 0));
            setPrevEnergy(player.energy);
            setTimeout(() => setEnergyChange(null), 2000);  // Hide after 1 second
        }
        if (player.block !== prevBlock) {
            setBlockChange(player.block - (prevBlock || 0));
            setPrevBlock(player.block);
            setTimeout(() => setBlockChange(null), 2000);  // Hide after 1 second
        }
    }, [player.health, player.energy, player.block]);

    return (
        <div>
            <h3 className="text-lg font-semibold">
                {player.name} {player.isPriority ? "🥇" : ""}
            </h3>
            <h3 className="text-lg font-semibold">
                ❤️: {player.health} {healthChange !== null && (
                    <span className={`text-${healthChange > 0 ? 'green' : 'red'}-500`}>
                        {healthChange > 0 ? `+${healthChange}` : healthChange}
                    </span>
                )}
            </h3>
            <h3 className="text-lg font-semibold">
                ⚡: {player.energy} {energyChange !== null && (
                    <span className={`text-${energyChange > 0 ? 'green' : 'red'}-500`}>
                        {energyChange > 0 ? `+${energyChange}` : energyChange}
                    </span>
                )}
            </h3>
            <h3 className="text-lg font-semibold">
                🛡️: {player.block} {blockChange !== null && (
                    <span className={`text-${blockChange > 0 ? 'green' : 'red'}-500`}>
                        {blockChange > 0 ? `+${blockChange}` : blockChange}
                    </span>
                )}
            </h3>
        </div>
    );
}
