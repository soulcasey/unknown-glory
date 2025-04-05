import { useState, useEffect } from "react";
import io from "socket.io-client";
import { RoomData } from "./dto";
import CardSelection from "./components/CardSelection";
import Character from "./components/Character";
import Wait from "./components/Wait";
import Announcement from "./components/Annoucement";
import Login from "./components/Login";
import PlayerInfo from "./components/PlayerInfo";

const socket = io("http://localhost:3000");

export default function Game() {
    const [error, setError] = useState("");
    const [showCardSelection, setShowCardSelection] = useState(false);
    const [cards, setCards] = useState<string[]>([]);
    const [roomData, setRoomData] = useState<RoomData | null>();
    const [reroll, setReroll] = useState<number>(0);
    const [waiting, setWaiting] = useState(false);
    const [announcement, setAnnouncement] = useState<string>("");

    useEffect(() => {
        socket.on("sendError", (message: string) => {
            setError(message);
        });

        socket.on("cards", ({ cards, reroll }: { cards: string[]; reroll: number }) => {
            setCards(cards);
            setReroll(reroll);
            setShowCardSelection(true);
        });
        
        socket.on("cardsReceived", () => {
            setCards([])
            setShowCardSelection(false);
        })

        socket.on("roomData", (roomData: RoomData) => {
            setRoomData(roomData);
        });

        socket.on("wait", () => setWaiting(true));
        socket.on("unwait", () => setWaiting(false));
        socket.on("announcement", (message: string) => setAnnouncement(message));

        return () => {
            socket.off("sendError");
            socket.off("cards");
            socket.off("sendRoomData");
            socket.off("wait");
            socket.off("unwait");
            socket.off("announcement");
            socket.off("cardsReceived");
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gray-800 min-h-screen w-full text-white">
            {waiting && <Wait />}

            {announcement && (
                <Announcement
                    message={announcement}
                    onComplete={() => setAnnouncement("")}
                />
            )}

            {showCardSelection && (
                <CardSelection
                    socket={socket}
                    cards={cards}
                    onClose={() => setShowCardSelection(false)}
                    reroll={reroll}
                />
            )}

            {error && (
                <p
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-red-500 mb-4"
                    style={{ zIndex: 10 }}
                >
                    {error}
                </p>
            )}

            {!roomData ? (
                <Login
                    onError={setError}
                    onSubmit={() => setError("")}
                    socket={socket}
                />
            ) : (
                <>
                    <div className="flex w-full max-w-6xl justify-between items-start mt-6 gap-4">
                        {/* Left */}
                        <PlayerInfo players={roomData.players.slice(0, 1)} />

                        {/* Center Room Info */}
                        <div className="flex flex-col items-center justify-center w-1/3 gap-2">
                            <h2 className="text-xl">Room: {roomData.roomId}</h2>
                            {cards.length > 0 && (
                                <button
                                    onClick={() => setShowCardSelection(true)}
                                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Open CardSelection
                                </button>
                            )}
                        </div>

                        {/* Right */}
                        <PlayerInfo players={roomData.players.slice(1)} />
                    </div>

                    {/* Grid Layout */}
                    <div
                        className="relative mt-8"
                        style={{
                            width: "min(95vw, 1500px)",
                            aspectRatio: "7 / 3",
                        }}
                    >
                        <div className="absolute inset-0 grid grid-cols-7 grid-rows-3 gap-2">
                            {[...Array(21)].map((_, index) => {
                                const col = index % 7;
                                const row = 2 - Math.floor(index / 7);
                                return (
                                    <div
                                        key={`${col}-${row}`}
                                        className="flex items-start justify-center pt-1 text-white bg-gray-600 text-sm"
                                        style={{
                                            width: "100%",
                                            aspectRatio: "1 / 1",
                                        }}
                                    >
                                        {col}, {row}
                                    </div>
                                );
                            })}
                        </div>

                        {roomData.players.map((player) => (
                            <Character key={player.name} player={player} />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}
