import { Channel } from '../types';

export default function RecentlyWatched({ channels, onSelect }: { channels: Channel[], onSelect: (c: Channel) => void }) {
  if (channels.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Recently Watched</h3>
      {channels.map((ch) => (
        <div
          key={ch.id}
          onClick={() => onSelect(ch)}
          className="flex items-center gap-3 p-3 mb-2 rounded-md hover:bg-white/5 transition text-left text-slate-300 hover:text-white font-medium border border-transparent hover:border-white/10 cursor-pointer"
        >
          <span className="flex-1 truncate text-sm">{ch.name}</span>
        </div>
      ))}
    </div>
  );
}
