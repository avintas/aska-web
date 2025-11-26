import type { UserStats } from "@/shared/types/shootout-game";

interface ScoreBoardProps {
  stats: UserStats;
}

export function ScoreBoard({ stats }: ScoreBoardProps): JSX.Element {
  const totalEvaluated = stats.correct + stats.incorrect;
  const percentage =
    totalEvaluated > 0 ? Math.round((stats.correct / totalEvaluated) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Correct */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Correct
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.correct}
            </p>
          </div>

          {/* Percentage (Prominent) */}
          <div className="border-x border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Win %
            </p>
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {percentage}%
            </p>
          </div>

          {/* Incorrect */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              Incorrect
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.incorrect}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
