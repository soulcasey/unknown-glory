import { useEffect, useState } from "react";

interface AnnouncementProps {
  message: string;
  onComplete: () => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function Announcement({ message, onComplete }: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const animate = async () => {
      await delay(10);             // ✅ Allow initial render
      setIsVisible(true);          // Fade in
      await delay(2500);           // Show duration

      setIsVisible(false);         // Fade out
      await delay(500);            // Wait for fade-out to finish

      setShouldRender(false);      // Remove from DOM
      onComplete();
    };

    animate();
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-500 ${
        isVisible ? "opacity-70" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl font-bold text-white text-center">
        {message.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </h1>
    </div>
  );
}
