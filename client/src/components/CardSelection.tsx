import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { CardSelectionData, CardType, Vector2 } from "../dto";

interface CardSelectionProps {
    cardSelectionData: CardSelectionData | null;
    socket: Socket;
    onClose: () => void;
}

export default function CardSelection({ cardSelectionData, socket, onClose }: CardSelectionProps) {
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [visible, setVisible] = useState(false); // for fade-in/out animation

    useEffect(() => {
        // Trigger fade-in on mount
        const timer = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const toggleCardSelection = (index: number) => {
        if (selectedIndices.includes(index)) {
            // If the card index is already selected, unselect it
            setSelectedIndices(prev => prev.filter(i => i !== index));
        } else if (selectedIndices.length < 3) {
            // If fewer than 3 cards are selected, allow selection
            setSelectedIndices(prev => [...prev, index]);
        }
    };

    const getCardOrder = (index: number) => {
        const cardOrder = selectedIndices.indexOf(index) + 1;
        return cardOrder !== 0 ? cardOrder : null;
    };

    const handleReroll = () => {
        setSelectedIndices([]); // Unselect all cards
        socket.emit("rerollCards");
    };

    const handleSubmit = () => {
        if (selectedIndices.length !== 3) return;
        
        // Convert selected indices to card names
        const selectedCards = selectedIndices.map(index => cards[index].key);
        socket.emit("selectCards", selectedCards);
    };

    const closeWithFadeOut = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    const getEmoji = (type: CardType) => {
        switch (type) {
            case CardType.Move: return "🏃";
            case CardType.Block: return "🛡️";
            case CardType.Attack: return "⚔️";
            default: return "❓";
        }
    };

    const renderAttackGrid = (zone?: Vector2[]) => {
        if (!zone || !zone.length) return null;
    
        const xs = zone.map(v => v.x).concat(0); // Include origin
        const ys = zone.map(v => v.y).concat(0); // Include origin
        const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
        const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
    
        const grid = [];
        for (let y = maxY; y >= minY; y--) {
            const row = [];
            for (let x = minX; x <= maxX; x++) {
                const isOrigin = x === 0 && y === 0;
                const isZone = zone.some(vec => vec.x === x && vec.y === y);
                row.push(
                    <div
                        key={`${x},${y}`}
                        className={`w-3 h-3 border text-xs flex items-center justify-center
                            ${isOrigin ? "bg-green-500" :
                              isZone ? "bg-red-500" : "bg-gray-500"}`}
                    />
                );
            }
            grid.push(<div key={y} className="flex">{row}</div>);
        }
    
        return (
            <div className="mt-2 inline-block">
                {grid}
            </div>
        );
    };
    

    const cards = cardSelectionData?.cards ?? [];
    const reroll = cardSelectionData?.player.reroll ?? 0;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed top-0 left-0 w-full h-full bg-black z-10 transition-opacity duration-300 ${
                    visible ? "opacity-50" : "opacity-0"
                }`}
            />

            {/* Modal */}
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/90 p-6 rounded-md w-[90vw] h-[90vh] z-20 transition-opacity duration-300 ${
                    visible ? "opacity-100" : "opacity-0"
                }`}
            >
                <h2 className="text-xl text-white text-center mb-4">Choose 3 cards</h2>

                {/* Close button */}
                <button
                    onClick={closeWithFadeOut}
                    className="absolute top-2 right-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                >
                    Close
                </button>

                {/* Reroll and Submit buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={handleReroll}
                        className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-yellow-600 disabled:bg-yellow-700"
                        disabled={reroll < 1}
                    >
                        🔄 Reroll {Math.floor(reroll)}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600 disabled:bg-green-700"
                        disabled={selectedIndices.length !== 3}
                    >
                        ✅ Submit
                    </button>
                </div>

                {/* Card Grid */}
                <div className="flex flex-wrap justify-center items-center gap-4 h-[70%] overflow-y-auto">
                    {cards.map((card, index) => {
                        const isSelected = selectedIndices.includes(index);
                        const order = getCardOrder(index);

                        return (
                            <button
                                key={index}
                                onClick={() => toggleCardSelection(index)}
                                className={`relative flex flex-col justify-center items-center text-white rounded-md p-2 transition duration-200 ${
                                    isSelected ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                                style={{
                                    aspectRatio: "3 / 4",
                                    width: "15%",
                                }}
                                type="button"
                            >
                                <div className="text-3xl mb-1">{getEmoji(card.type)}</div>
                                <div className="font-bold text-center text-sm">{card.name}</div>
                                <div className="text-xs text-gray-300 mb-1">Value: {card.value}</div>
                                <div className="text-xs text-gray-300 mb-1">Cost: {card.cost}</div>

                                {card.type === CardType.Attack && renderAttackGrid(card.zone)}

                                {order && (
                                    <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">
                                        {order}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
