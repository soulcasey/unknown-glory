export default function Wait() {
    return (
        <>
            {/* Overlay */}
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10" />

            {/* Centered message */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl z-20">
                Waiting for other player...
            </div>
        </>
    );
}