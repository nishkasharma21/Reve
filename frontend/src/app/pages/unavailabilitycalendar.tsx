import { useState, useEffect, useRef } from "react";
import { CalendarOff, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

export interface Block {
  id: number;
  start_date: string; // "YYYY-MM-DD"
  end_date: string;   // "YYYY-MM-DD"
}

export const toDate = (s: string) => new Date(s + "T00:00:00");
export const toISO  = (d: Date)   => d.toISOString().split("T")[0];
export const fmt    = (d: Date)   => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function isItemAvailableFromBlocks(blocks: Block[]): boolean {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return !blocks.some(b => toDate(b.start_date) <= today && toDate(b.end_date) >= today);
}

export function UnavailabilityCalendar({
  itemId,
  blocks,
  onBlocksChanged,
  onClose,
}: {
  itemId: number;
  blocks: Block[];
  onBlocksChanged: (blocks: Block[]) => void;
  onClose: () => void;
}) {
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate]     = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selecting, setSelecting]   = useState<{ start: Date; end: Date | null }>({ start: new Date(0), end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Reset selection state when calendar opens
  useEffect(() => {
    setSelecting({ start: new Date(0), end: null });
    setIsSelecting(false);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const year      = viewDate.getFullYear();
  const month     = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selStart = selecting.start.getTime() === new Date(0).getTime() ? null : selecting.start;
  const selEnd   = selecting.end;
  const lo = selStart && selEnd ? (selStart <= selEnd ? selStart : selEnd) : selStart;
  const hi = selStart && selEnd ? (selStart <= selEnd ? selEnd : selStart) : selStart;

  const isInExistingBlock = (d: Date) =>
    blocks.some(b => toDate(b.start_date) <= d && toDate(b.end_date) >= d);

  const isSelStart  = (d: Date) => lo?.toDateString() === d.toDateString();
  const isSelEnd    = (d: Date) => !!hi && hi.toDateString() === d.toDateString() && lo?.toDateString() !== hi.toDateString();
  const isInSelRange = (d: Date) => !!(lo && hi && d > lo && d < hi);
  const isPast      = (d: Date) => d < today;

  const handleDayClick = (date: Date) => {
    if (isPast(date)) return;
    if (!isSelecting || !selStart) {
      setSelecting({ start: date, end: null });
      setIsSelecting(true);
    } else {
      setSelecting(prev => ({ ...prev, end: date }));
      setIsSelecting(false);
    }
    setError(null);
  };

  const handleMouseEnter = (date: Date) => {
    if (!isSelecting || !selStart || isPast(date)) return;
    setSelecting(prev => ({ ...prev, end: date }));
  };

  const handleSave = async () => {
    if (!lo || !hi) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/items/${itemId}/block`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_date: toISO(lo), end_date: toISO(hi) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      const refreshRes = await fetch(`${API_URL}/api/items/${itemId}`, { credentials: "include" });
      const refreshData = await refreshRes.json();
      onBlocksChanged(refreshData.unavailability_blocks || []);
      setSelecting({ start: new Date(0), end: null });
      setIsSelecting(false);
    } catch (e) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blockId: number) => {
    try {
      await fetch(`${API_URL}/api/items/block/${blockId}`, {
        method: "DELETE",
        credentials: "include",
      });
      onBlocksChanged(blocks.filter(b => b.id !== blockId));
    } catch (e) {
      console.error(e);
    }
  };

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-80 select-none"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.13)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <CalendarOff size={15} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Block Dates</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Existing blocks */}
      {blocks.length > 0 && (
        <div className="mb-3 space-y-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Blocked ranges</p>
          {blocks.map(b => {
            const start = toDate(b.start_date);
            const end   = toDate(b.end_date);
            const now   = new Date(); now.setHours(0, 0, 0, 0);
            const active = start <= now && end >= now;
            return (
              <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-2">
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />}
                  <span className="text-xs text-gray-700">
                    {fmt(start)} → {fmt(end)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Month nav */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold">{monthName} {year}</span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const past      = isPast(date);
          const blocked   = isInExistingBlock(date);
          const selStart_ = isSelStart(date);
          const selEnd_   = isSelEnd(date);
          const inSel     = isInSelRange(date);
          const isToday   = date.toDateString() === today.toDateString();

          return (
            <button
              key={date.toDateString()}
              disabled={past}
              onClick={() => handleDayClick(date)}
              onMouseEnter={() => handleMouseEnter(date)}
              className={[
                "relative h-8 w-full text-xs font-medium transition-colors rounded-full",
                past    ? "text-gray-300 cursor-not-allowed" : "cursor-pointer",
                (selStart_ || selEnd_)
                  ? "bg-black text-white"
                  : inSel
                  ? "bg-gray-200 text-gray-800"
                  : blocked
                  ? "bg-red-100 text-red-500"
                  : isToday
                  ? "text-black font-bold underline underline-offset-2"
                  : "hover:bg-gray-100 text-gray-700",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selection summary + save */}
      <div className="mt-3 space-y-2">
        <div className="min-h-[20px]">
          {lo && hi ? (
            <p className="text-xs text-gray-600 text-center">
              {lo.toDateString() === hi.toDateString()
                ? fmt(lo)
                : `${fmt(lo)} → ${fmt(hi)}`}
              {isSelecting && <span className="text-gray-400 ml-1">(pick end date)</span>}
            </p>
          ) : (
            <p className="text-xs text-gray-400 text-center italic">Click a start date</p>
          )}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <div className="flex gap-2">
          <Button
            size="sm" variant="outline" className="flex-1 text-xs"
            onClick={() => { setSelecting({ start: new Date(0), end: null }); setIsSelecting(false); setError(null); }}
            disabled={!lo}
          >
            Clear
          </Button>
          <Button
            size="sm" className="flex-1 text-xs"
            disabled={!lo || !hi || isSelecting || saving}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Add Block"}
          </Button>
        </div>
      </div>
    </div>
  );
}