'use client';

interface TaskDockProps {
  taskInput: string;
  setTaskInput: (v: string) => void;
  onRun: () => void;
  activeAgentName: string | null;
  status: 'idle' | 'thinking' | 'working';
  preview: string;
  disabled: boolean;
}

export default function TaskDock({
  taskInput,
  setTaskInput,
  onRun,
  activeAgentName,
  status,
  preview,
  disabled,
}: TaskDockProps) {
  const isBusy = status !== 'idle' && !!activeAgentName;

  return (
    <div className="safe-bottom safe-x absolute bottom-0 left-0 right-0 z-30 flex flex-col gap-2 items-center pointer-events-none">
      {isBusy && (
        <div className="pointer-events-auto max-w-xl w-full rounded-xl bg-[#3A2A18]/95 text-[#F5EFE0] px-3 py-2 sm:px-4 text-xs shadow-lg flex items-center gap-2">
          <span className="animate-pulse shrink-0">💭</span>
          <span className="font-semibold shrink-0">{activeAgentName}</span>
          <span className="opacity-70 shrink-0 hidden sm:inline">is {status}…</span>
          <span className="truncate opacity-80 flex-1">{preview}</span>
        </div>
      )}

      <div className="pointer-events-auto w-full max-w-2xl flex flex-col sm:flex-row gap-2 sm:items-center rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-xl p-2.5 sm:px-3 sm:py-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg pl-1 shrink-0">📜</span>
          <input
            type="text"
            inputMode="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !disabled && onRun()}
            placeholder="Write a quest for the village…"
            className="flex-1 min-w-0 bg-transparent px-1 py-1.5 text-base sm:text-sm text-[#3A2A18] placeholder-[#8B5E3C]/60 focus:outline-none"
          />
        </div>
        <button
          onClick={onRun}
          disabled={disabled}
          className="rounded-xl bg-[#5B8C5A] hover:bg-[#4F7D51] active:bg-[#4F7D51] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5EFE0] text-sm sm:text-xs font-semibold px-4 py-3 sm:py-2.5 transition-colors shrink-0"
        >
          Send to Village
        </button>
      </div>
    </div>
  );
}
