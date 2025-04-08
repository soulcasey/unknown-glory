import { useState, useEffect } from "react";
import { CharacterType, JoinRoomData } from "../dto";
import { Socket } from "socket.io-client";

interface LoginProps {
    socket: Socket;
    onSubmit: () => void;
    onError: (message: string) => void;
    isConnected: boolean;
}

export default function Login({ socket, onSubmit, onError, isConnected }: LoginProps) {
    const [roomId, setRoomId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [characterType, setCharacterType] = useState<CharacterType>(CharacterType.Knight);
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        if (!isConnected) {
            const interval = setInterval(() => {
                setDotCount((prev) => (prev + 1) % 4);
            }, 500); // every half second

            return () => clearInterval(interval);
        }
    }, [isConnected]);

    const handleJoinRoom = () => {
        if (roomId.trim() && playerName.trim()) {
            const joinRoomData: JoinRoomData = {
                roomId,
                name: playerName,
                characterType,
            };

            onSubmit?.();
            socket.emit("joinRoom", joinRoomData);
        } else {
            const errorMsg = "Please enter Room ID, Name, and select a Character Class.";
            onError?.(errorMsg);
        }
    };

    return (
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
                maxLength={10}
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
                disabled={!isConnected}
                className={`w-30 px-4 py-2 rounded-md ${
                    isConnected
                        ? "text-center bg-blue-600 hover:bg-blue-700"
                        : "text-left bg-gray-500 cursor-not-allowed"
                }`}
            >
                {isConnected ? "Enter Room" : `Connecting${".".repeat(dotCount)}`}
            </button>
        </div>
    );
}
