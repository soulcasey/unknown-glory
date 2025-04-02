import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Game() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-800 min-h-screen w-full">
      {/* 7x3 Fixed Grid with Responsive Scaling */}
      <div
        className="grid grid-cols-7 grid-rows-3 gap-2"
        style={{
          width: "min(95vw, 1500px)", // Scales but stops at 700px max width
          height: "auto",            // Adjusts height automatically
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
    </div>
  );
}
