import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass =
    type === 'success'
      ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10'
      : 'bg-rose-950/90 border-rose-500/30 text-rose-300 shadow-rose-500/10';

  return (
    <div className="fixed bottom-5 right-5 z-50 transition-all transform duration-300 ease-out">
      <div
        className={`px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-3 max-w-sm ${bgClass}`}
      >
        <span className="text-lg">
          {type === 'success' ? '✓' : '⚠️'}
        </span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-200 transition-colors text-xs p-1 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
