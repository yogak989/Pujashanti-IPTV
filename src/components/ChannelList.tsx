import { useState } from 'react';
import { Channel } from '../types';
import { Trash2, Star } from 'lucide-react';

export default function ChannelList({ channels, onSelect, onRemove, onToggleFavorite, focusedIndex, activeChannelId }: { channels: Channel[], onSelect: (c: Channel) => void, onRemove: (id: string) => void, onToggleFavorite: (id: string) => void, focusedIndex?: number, activeChannelId?: string }) {
  const groupedChannels: Record<string, Channel[]> = channels.reduce((acc, ch) => {
    const category = ch.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(ch);
    return acc;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="flex flex-col p-4 bg-[#0d0d0d] rounded-lg h-full overflow-y-auto border border-white/5">
      {Object.entries(groupedChannels).map(([category, catChannels]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{category}</h3>
          {catChannels.map((ch) => {
            const isActive = ch.id === activeChannelId;
            return (
              <div
                key={ch.id}
                onClick={() => onSelect(ch)}
                className={`flex items-center gap-3 p-3 mb-2 rounded-md transition text-left text-slate-300 hover:text-white font-medium border ${isActive ? 'bg-white/5 border-white/20' : 'border-transparent hover:border-white/10'} cursor-pointer`}
              >
                <div className="relative">
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0d0d] animate-pulse" />
                  )}
                </div>
                <span className="flex-1 truncate">{ch.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(ch.id);
                  }}
                  className={`p-1 ${ch.isFavorite ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}
                >
                  <Star size={16} fill={ch.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(ch.id);
                  }}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
