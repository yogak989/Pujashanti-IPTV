import { X } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Navigate Up</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded">↑ Arrow</span>
          </div>
          <div className="flex justify-between">
            <span>Navigate Down</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded">↓ Arrow</span>
          </div>
          <div className="flex justify-between">
            <span>Select Channel</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded">Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
