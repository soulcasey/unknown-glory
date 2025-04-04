interface CardSelectionProps {
    cards: string[];
    onClose: () => void;
}

export default function CardSelection({ cards, onClose }: CardSelectionProps) {
    return (
        <>
            {/* Popup overlay */}
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50" />

            {/* Popup content */}
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-md w-[90vw] h-[90vh] bg-opacity-80"
                style={{
                    backgroundColor: "rgba(31, 41, 55, 0.8)", // Semi-transparent background color
                    zIndex: 10,
                }}
            >
                <h2 className="text-xl text-white text-center">Choose 3 cards</h2>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-4 py-2 bg-red-600 rounded-md text-white"
                >
                    Close
                </button>

                {/* Buttons Grid */}
                <div className="flex gap-4 justify-center items-center h-full">
                    {cards.map((card, index) => (
                        <button
                            key={index}
                            className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            style={{
                                aspectRatio: "3 / 4",
                                width: "18%",
                                height: "auto",
                            }}
                        >
                            {card}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}
