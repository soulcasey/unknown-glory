import { useState, useEffect } from "react";
import io from "socket.io-client";
import { CharacterType, JoinRoomData } from "./dto";
import CardSelection from "./components/CardSelection";
import { Vector2, PlayersData } from "./dto";
import Character from "./components/Character";

const socket = io("http://localhost:3000");

export default function Game() {
    const [roomId, setRoomId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [characterType, setCharacterType] = useState<CharacterType>(CharacterType.Knight);
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");
    const [showCardSelection, setShowCardSelection] = useState(false); // CardSelection visibility state
    const [cards, setCards] = useState<string[]>([]);
    const [players, setPlayers] = useState<PlayersData>({ players: [] });
    const [reroll, setReroll] = useState<number>(0); // Initialize reroll state

    useEffect(() => {
        // Listen for server responses
        socket.on("roomFull", () => {
            setError("Room is full. Please try another room.");
        });

        socket.on("nameTaken", () => {
            setError("Name already taken. Choose a different name");
        });

        socket.on("joinedRoom", () => {
            setError("");
            setJoined(true);
        });

        socket.on("cards", ({ cards, reroll }: { cards: string[]; reroll: number }) => {
            setCards(cards);
            setReroll(reroll);
            setShowCardSelection(true);
        });

        socket.on("updatePlayers", (playersData: PlayersData) => {
            setPlayers(playersData);
        });

        // Cleanup event listeners on unmount
        return () => {
            socket.off("roomFull");
            socket.off("nameTaken");
            socket.off("joinedRoom");
            socket.off("cards");
            socket.off("updatePlayers");
        };
    }, []);

    const handleJoinRoom = () => {
        if (roomId.trim() && playerName.trim()) {
            setError(""); // Clear error message when attempting to join

            const joinRoomData: JoinRoomData = {
                roomId,
                name: playerName,
                characterType,
            };

            socket.emit("joinRoom", joinRoomData);
        } else {
            setError("Please enter Room ID, Name, and select a Character Class.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gray-800 min-h-screen w-full text-white">
            {/* Button to open the CardSelection */}
            <button
                onClick={() => setShowCardSelection(true)}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Open CardSelection
            </button>

            {/* CardSelection content */}
            {showCardSelection && (
                <CardSelection
                    socket={socket}
                    cards={cards}
                    onClose={() => setShowCardSelection(false)}
                    reroll={reroll}
                />
            )}

            {!joined ? (
                <div className="flex flex-col items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="p-2 text-white bg-gray-700 rounded-md border border-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Enter Your Name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="p-2 text-white bg-gray-700 rounded-md border border-gray-400"
                    />

                    <select
                        value={characterType}
                        onChange={(e) => setCharacterType(e.target.value as CharacterType)}
                        className="p-2 text-white rounded-md border bg-gray-700 border-gray-400"
                    >
                        {Object.values(CharacterType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleJoinRoom}
                        className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Join Room
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            ) : (
                <>
                    <h2 className="text-xl">Room: {roomId}</h2>
                    <h3 className="text-lg">Player: {playerName} ({characterType})</h3>

                    {/* Grid Container */}
                    <div
                        className="relative"
                        style={{
                            width: "min(95vw, 1500px)",
                            aspectRatio: "7 / 3",
                        }}
                    >
                        <div className="relative" style={{ width: "min(95vw, 1500px)", aspectRatio: "7 / 3" }}>
                            <div className="absolute inset-0 grid grid-cols-7 grid-rows-3 gap-2">
                                {[...Array(21)].map((_, index) => {
                                    const col = index % 7;
                                    const row = 2 - Math.floor(index / 7); // invert Y-axis (bottom row = 0)

                                    return (
                                        <div
                                            key={`${col}-${row}`}
                                            className="flex items-start justify-center pt-1 text-white bg-gray-600 text-sm"
                                            style={{
                                                width: "100%",
                                                aspectRatio: "1 / 1",
                                            }}
                                        >
                                            {col} , {row}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 🧍 Animated Character */}
                            {players.players.map((player) => (
                                <Character
                                    key={player.name}
                                    type={player.characterType}
                                    position={player.position}
                                    name={player.name}
                                    health={player.health}
                                    energy={player.energy}
                                    block={player.block}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
