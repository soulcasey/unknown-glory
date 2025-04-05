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
      setIsVisible(true); // Fade in
      await delay(4000); // Display duration minus 0.5s in + 0.5s out

      setIsVisible(false); // Fade out
      await delay(500); // Fade-out duration

      setShouldRender(false); // Remove from DOM
      onComplete();
    };

    animate();
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-500`}
      style={{
        opacity: isVisible ? 0.7 : 0,
      }}
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
