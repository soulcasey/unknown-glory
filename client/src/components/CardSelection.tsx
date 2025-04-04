import { useState } from "react";
import { Socket } from "socket.io-client";

interface CardSelectionProps {
    socket: Socket;
    cards: string[];
    reroll: number;
    onClose: () => void;
}

export default function CardSelection({ socket, cards, reroll, onClose }: CardSelectionProps) {
    
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

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
        socket.emit("rerollCards");
    };

    const handleSubmit = () => {
        // Convert selected indices to card names
        const selectedCards = selectedIndices.map(index => cards[index]);
        socket.emit("selectCards", selectedCards);
        onClose(); // Close the popup after submission
    };

    return (    
        <>
            {/* Overlay */}
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10" />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 p-6 rounded-md w-[90vw] h-[90vh] z-20">
                <h2 className="text-xl text-white text-center mb-4">Choose 3 cards</h2>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                >
                    Close
                </button>

                {/* Reroll and Submit buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={handleReroll}
                        className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-yellow-600 disabled:opacity-50"
                        disabled={reroll < 1}
                    >
                        🔄 Reroll {Math.floor(reroll)}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 disabled:opacity-50"
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
                                className={`relative flex justify-center items-center text-white rounded-md transition duration-200 ${
                                    isSelected ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                                style={{
                                    aspectRatio: "3 / 4",
                                    width: "18%",
                                    position: "relative",
                                }}
                            >
                                {card}
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
