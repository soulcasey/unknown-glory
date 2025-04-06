import { useState, useEffect } from "react";
import io from "socket.io-client";
import { RoomData, CardActionData, CardType, CardSelectionData } from "./dto";
import CardSelection from "./components/CardSelection";
import Character from "./components/Character";
import Wait from "./components/Wait";
import Announcement from "./components/Announcement";
import Login from "./components/Login";
import PlayerInfo from "./components/PlayerInfo";

const socket = io("http://localhost:3000");

export default function Game() {
    const [error, setError] = useState("");
    const [showCardSelection, setShowCardSelection] = useState(false);
    const [cards, setCards] = useState<CardSelectionData | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [announcement, setAnnouncement] = useState<string>("");
    const [cardAction, setCardAction] = useState<CardActionData | null>();

    useEffect(() => {
        socket.on("sendError", (message: string) => {
            setError(message);
        });

        socket.on("cardSelection", (cardSelectionData: CardSelectionData) => {
            setCards(cardSelectionData);
            setShowCardSelection(true);
        });
        
        socket.on("cardsReceived", () => {
            setCards(null)
            setShowCardSelection(false);
        })

        socket.on("roomData", (roomData: RoomData) => {
            setRoomData(roomData);
        });

        socket.on("wait", () => setWaiting(true));
        socket.on("unwait", () => setWaiting(false));
        socket.on("announcement", (message: string) => setAnnouncement(message));

        // New: Socket listeners for move, block, attack
        socket.on("cardAction", (cardActionData : CardActionData) => {
            setCardAction(cardActionData);
            setTimeout(() => setCardAction(null), 2000);
        });

        return () => {
            socket.off("sendError");
            socket.off("cards");
            socket.off("roomData");
            socket.off("wait");
            socket.off("unwait");
            socket.off("announcement");
            socket.off("cardsReceived");
            socket.off("cardAction");
        };
    }, []);

    const isHitZone = (col: number, row: number): boolean => {
        if (cardAction?.card.type !== CardType.Attack) return false;
        return cardAction.hitZones.some((zone) => zone.x === col && zone.y === row);
    };


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
                    cardSelectionData={cards}
                    socket={socket}
                    onClose={() => setShowCardSelection(false)}
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
                            <button
                                onClick={() => setShowCardSelection(true)}
                                disabled={cards === null}
                                className={`px-4 py-2 rounded-md mt-4 transition-all duration-300 ${
                                    cards === null
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            >
                                Open Card
                            </button>
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
                                const isHit = isHitZone(col, row);

                                return (
                                    <div
                                        key={`${col}-${row}`}
                                        className={`flex items-start justify-center pt-1 ${
                                            isHit ? "bg-red-600" : "bg-gray-600"
                                        }`}
                                        style={{
                                            width: "100%",
                                            aspectRatio: "1 / 1",
                                            transition: "background-color 0.3s ease",
                                        }}
                                    ></div>
                                );
                            })}
                        </div>

                        {roomData.players.map((player, index) => {
                            const speech =
                                cardAction?.player.index === index
                                    ? cardAction.player.hasEnergy === true ?
                                        cardAction.card.name
                                        : "Not enough energy..."
                                    : "";

                            return (
                                <Character
                                    key={player.name}
                                    player={player}
                                    speech={speech}
                                />
                            );
                        })}
                    </div>
                </>
            )}

        </div>
    );
}
