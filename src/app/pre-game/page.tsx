"use client";

import { PageSlogan } from "@/components/PageSlogan";

interface GoodLuckMessage {
  id: number;
  text: string;
}

// Sample good luck messages - these will eventually come from an API
const goodLuckMessages: GoodLuckMessage[] = [
  {
    id: 1,
    text: "You've got this! Play your heart out and leave everything on the ice. Good luck! 🍀",
  },
  {
    id: 2,
    text: "Trust your training. You've prepared for this moment. Now go out there and shine!",
  },
  {
    id: 3,
    text: "Take a deep breath. You're ready. Play with confidence and have fun out there!",
  },
  {
    id: 4,
    text: "Remember why you love this game. Let that passion fuel every shift. Good luck!",
  },
  {
    id: 5,
    text: "You've worked too hard to let nerves get in the way. Trust yourself and play your game!",
  },
  {
    id: 6,
    text: "This is your moment. Play smart, play hard, and most importantly, play with heart. Good luck!",
  },
];

export default function PreGamePage(): JSX.Element {
  const handleShare = (message: string): void => {
    if (navigator.share) {
      navigator.share({
        title: "Good Luck Message",
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      alert("Message copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🍀</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 md:mb-6">
              Good Luck
            </h1>
          </div>
          <PageSlogan />
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-base md:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Share encouragement and support before the game. Find the perfect
              words to calm pre-game jitters and boost confidence.
            </p>
          </div>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {goodLuckMessages.map((message) => (
            <div
              key={message.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 relative"
            >
              {/* Message Text */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-lg font-medium pr-12">
                {message.text}
              </p>

              {/* Share Button */}
              <button
                onClick={() => handleShare(message.text)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center transition-colors shadow-md"
                aria-label="Share message"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="6"
                    cy="6"
                    r="2"
                    stroke="currentColor"
                    fill="none"
                  />
                  <circle
                    cx="6"
                    cy="18"
                    r="2"
                    stroke="currentColor"
                    fill="none"
                  />
                  <circle
                    cx="18"
                    cy="12"
                    r="2"
                    stroke="currentColor"
                    fill="none"
                  />
                  <line x1="8" y1="6" x2="16" y2="12" stroke="currentColor" />
                  <line x1="8" y1="18" x2="16" y2="12" stroke="currentColor" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
