import { useState } from "react";
import { CharacterType, JoinRoomData } from "../dto";
import { Socket } from "socket.io-client";

interface LoginProps {
    socket: Socket
    onSubmit: () => void;
    onError: (message: string) => void;
}

export default function Login({ socket, onSubmit, onError }: LoginProps) {
    const [roomId, setRoomId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [characterType, setCharacterType] = useState<CharacterType>(CharacterType.Knight);

    const handleJoinRoom = () => {
        if (roomId.trim() && playerName.trim()) {
            const joinRoomData: JoinRoomData = {
                roomId,
                name: playerName,
                characterType,
            };
            
            onSubmit?.();
            socket.emit("joinRoom", joinRoomData);
        }
        else {
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
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
                Join Room
            </button>
        </div>
    );
}
