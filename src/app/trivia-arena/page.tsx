import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trivia Arena | OnlyHockey",
  description: "Challenge yourself with hockey trivia!",
};

export default function TriviaArenaPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Trivia Arena
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Coming Soon! Test your hockey knowledge here.
      </p>
    </div>
  );
}
