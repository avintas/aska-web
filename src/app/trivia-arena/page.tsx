import type { Metadata } from "next";
import { ShootoutGame } from "./components/ShootoutGame";

export const metadata: Metadata = {
  title: "Trivia Arena | Shootout Game",
  description: "Play the Shootout Trivia Game - Free Preview!",
};

export default function TriviaArenaPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            The Practice.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Trivia Arena Preview
          </p>
        </div>
      </header>

      <main className="py-8">
        <ShootoutGame />
      </main>
    </div>
  );
}
