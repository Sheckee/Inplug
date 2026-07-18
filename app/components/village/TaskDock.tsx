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
    <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2 items-center pointer-events-none">
      {isBusy && (
        <div className="pointer-events-auto max-w-xl w-full rounded-xl bg-[#3A2A18]/95 text-[#F5EFE0] px-4 py-2 text-xs shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="animate-pulse">💭</span>
          <span className="font-semibold">{activeAgentName}</span>
          <span className="opacity-70">is {status}…</span>
          <span className="truncate opacity-80 flex-1">{preview}</span>
        </div>
      )}

      <div className="pointer-events-auto w-full max-w-2xl flex gap-2 items-center rounded-2xl bg-[#F5EFE0]/95 border-2 border-[#C9BC9C] shadow-xl px-3 py-2.5">
        <span className="text-lg pl-1">📜</span>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && onRun()}
          placeholder="Write a quest for the village… e.g. 'Draft a plan for our launch'"
          className="flex-1 bg-transparent px-1 py-1.5 text-sm text-[#3A2A18] placeholder-[#8B5E3C]/60 focus:outline-none"
        />
        <button
          onClick={onRun}
          disabled={disabled}
          className="rounded-xl bg-[#5B8C5A] hover:bg-[#4F7D51] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5EFE0] text-xs font-semibold px-4 py-2.5 transition-colors"
        >
          Send to Village
        </button>
      </div>
    </div>
  );
}
