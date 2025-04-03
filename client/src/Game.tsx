import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Game() {
    const [roomId, setRoomId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");

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

        // Cleanup event listeners on unmount
        return () => {
            socket.off("roomFull");
            socket.off("playerJoined");
        };
    }, []);

    const handleJoinRoom = () => {
        if (roomId.trim() && playerName.trim()) {
            setError(""); // Clear error message when attempting to join
            socket.emit("joinRoom", { roomId, playerName });
        }
        else {
            setError("Please enter both Room ID and Name.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gray-800 min-h-screen w-full text-white">
        {!joined ? (
            <div className="flex flex-col items-center gap-4">
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="p-2 text-black rounded-md border border-gray-400"
            />
            <input
                type="text"
                placeholder="Enter Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="p-2 text-black rounded-md border border-gray-400"
            />
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
            <h3 className="text-lg">Player: {playerName}</h3>

            {/* 7x3 Fixed Grid with Responsive Scaling */}
            <div
                className="grid grid-cols-7 grid-rows-3 gap-2"
                style={{
                width: "min(95vw, 1500px)", // Scales but stops at 1500px max width
                height: "auto",             // Adjusts height automatically
                }}
            >
                {[...Array(21)].map((_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-center text-white bg-gray-600"
                    style={{
                    width: "100%",         // Ensures equal distribution
                    aspectRatio: "1 / 1",  // Maintains square shape
                    }}
                >
                    {index + 1}
                </div>
                ))}
            </div>
            </>
        )}
        </div>
    );
}
