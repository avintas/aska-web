import type { GameSession } from "@/shared/types/shootout-game";

interface DebugPanelProps {
  session: GameSession;
  totalQuestions: number;
}

export function DebugPanel({
  session,
  totalQuestions,
}: DebugPanelProps): JSX.Element {
  return (
    <div className="fixed bottom-4 left-4 p-4 bg-gray-900/90 text-green-400 text-xs font-mono rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 z-50 max-w-xs opacity-70 hover:opacity-100 transition-opacity">
      <h3 className="font-bold text-white mb-2 border-b border-gray-700 pb-1">
        DEBUG INFO
      </h3>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">State:</span>
          <span>{session.state}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Progress:</span>
          <span>
            {session.keeper.currentIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Keeper ID:</span>
          <span className="truncate max-w-[100px]" title={session.keeper.id}>
            {session.keeper.id}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Session Date:</span>
          <span>{session.keeper.date}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Skipped:</span>
          <span>{session.stats.skipped}</span>
        </div>
      </div>
    </div>
  );
}
