import React, { useState } from 'react';
import { Channel } from '../types';
import { parseM3U } from '../utils/m3uUtils';

export default function AddPlaylist({ isOpen, onClose, onAdd, onClear }: { isOpen: boolean, onClose: () => void, onAdd: (cs: Channel[]) => void, onClear: () => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const content = await response.text();
      
      let parsedChannels: Channel[] = [];
      if (content.trim().startsWith('<')) {
        // Simple XML/EPG parsing logic
        console.log("Detected XML, attempting to parse...");
        // You would need to implement an XML parser or use a library
        // For now, let's just alert that EPG XML is not fully supported yet in this implementation,
        // or add a basic parser if possible.
        // Actually, for now, let's stick to M3U and add a placeholder for XML.
        alert("EPG XML parsing is not fully implemented yet.");
        return; 
      } else {
        parsedChannels = parseM3U(content);
      }
      
      if (parsedChannels.length === 0) {
        throw new Error("No channels found in playlist. Please ensure it's a valid M3U file.");
      }
      onAdd(parsedChannels);
      setUrl('');
      onClose();
    } catch (err) {
      console.error("Fetch failed", err);
      alert(err instanceof Error ? err.message : "Gagal memuat playlist. Pastikan URL valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsedChannels = parseM3U(content);
      onAdd(parsedChannels);
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-xl mt-4 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Add Playlist</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Playlist URL (.m3u)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-[#0f0f0f] text-white p-3 text-sm rounded border border-white/10 focus:border-blue-500 outline-none"
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded text-sm font-bold hover:bg-blue-500" disabled={loading}>
            {loading ? 'LOADING...' : 'LOAD URL'}
          </button>
          
          <label className="text-xs text-slate-400 mt-2">Or upload M3U file:</label>
          <input type="file" accept=".m3u" onChange={handleFileUpload} className="text-sm text-slate-400 w-full" />
          
          <div className="my-2 border-t border-white/10" />                

          <button type="button" onClick={onClear} className="bg-transparent text-red-400 p-2 rounded text-xs font-bold hover:bg-red-950/30">
            CLEAR ALL CHANNELS
          </button>
        </form>
      </div>
    </div>
  );
}
