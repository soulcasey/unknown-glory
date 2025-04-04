import { useState, useEffect } from "react";
import io from "socket.io-client";
import { CharacterType, JoinRoomData } from "./dto";
import CardSelection from "./components/CardSelection";

const socket = io("http://localhost:3000");

export default function Game() {
    const [roomId, setRoomId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [characterType, setCharacterType] = useState<CharacterType>(CharacterType.Knight);
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");
    const [showCardSelection, setShowCardSelection] = useState(false); // CardSelection visibility state
    const [cards, setCards] = useState<string[]>([]);

    const [charPos, setCharPos] = useState({ x: 0, y: 0 });

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
            setShowCardSelection(true);
        });

        // Cleanup event listeners on unmount
        return () => {
            socket.off("roomFull");
            socket.off("nameTaken");
            socket.off("joinedRoom");
            socket.off("showCards");
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                const newX = Math.floor(Math.random() * 7); // cols
                const newY = Math.floor(Math.random() * 3); // rows
                setCharPos({ x: newX, y: newY });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
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
                onClick = { () => setShowCardSelection(true) }
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Open CardSelection
            </button>

            {/* CardSelection content */}
            {showCardSelection && <CardSelection
                cards = { cards }
                onClose = { () => setShowCardSelection(false) }
            />}

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
                                {[...Array(21)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-center text-white bg-gray-600"
                                        style={{
                                            width: "100%",
                                            aspectRatio: "1 / 1",
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>

                            {/* 🧍 Animated Character */}
                            <div
                                className="absolute transition-transform duration-500 ease-in-out"
                                style={{
                                    width: "calc((100% - 6 * 0.5rem) / 7)",
                                    aspectRatio: "1 / 1",
                                    transform: `translate(
                                        calc(${charPos.x * 100}% + ${charPos.x * 0.5}rem),
                                        calc(${(2 - charPos.y) * 100}% + ${(2 - charPos.y) * 0.5}rem) 
                                    )`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 10,
                                    fontSize: 60,
                                }}
                            >
                                ⚔️
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
