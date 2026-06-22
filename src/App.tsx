import { useState, useEffect } from 'react';
import { Channel, EPGProgram } from './types';
import ChannelList from './components/ChannelList';
import RecentlyWatched from './components/RecentlyWatched';
import Accordion from './components/Accordion';
import AddPlaylist from './components/AddPlaylist';
import VideoPlayer from './components/VideoPlayer';
import EPGViewer from './components/EPGViewer';
import SearchBar from './components/SearchBar';
import AboutDeveloper from './components/AboutDeveloper';
import AdSenseAd from './components/AdSenseAd';
import { Search, Heart, Clock, Plus, X, Volume2, VolumeX, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRecentlyWatched, addToRecentlyWatched, removeFromRecentlyWatched } from './utils/recentUtils';

const MOCK_CHANNELS: Channel[] = [
  { id: '1', name: 'Big Buck Bunny (Sample)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { id: '2', name: 'Sintel (Sample)', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' }
];

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem('iptv_channels');
    return saved ? JSON.parse(saved) : MOCK_CHANNELS;
  });
  const [recentlyWatched, setRecentlyWatched] = useState<Channel[]>(getRecentlyWatched());
  const [selectedChannel, setSelectedChannel] = useState<Channel | undefined>(() => {
    const savedChannels = localStorage.getItem('iptv_channels');
    const allChannels = savedChannels ? JSON.parse(savedChannels) : MOCK_CHANNELS;
    const savedId = localStorage.getItem('iptv_last_channel_id');
    
    if (savedId) {
       const found = allChannels.find((c: Channel) => c.id === savedId);
       if (found) return found;
    }
    const recent = getRecentlyWatched();
    return recent.length > 0 ? recent[0] : allChannels[0];
  });
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'none' | 'search' | 'favorites' | 'history' | 'about'>('none');
  
  const [epgData, setEpgData] = useState<Record<string, EPGProgram[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const categories = ['All', ...Array.from(new Set(channels.map(ch => ch.category || 'Uncategorized')))];

  const filteredChannels = channels.filter(ch => 
    (ch.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || (ch.category || 'Uncategorized') === selectedCategory)
  );
  
  useEffect(() => {
    localStorage.setItem('iptv_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    // Placeholder: Fetch EPG data here if an EPG URL is known
  }, []);
  
  const removeChannel = (id: string) => {
    const nextChannels = channels.filter(ch => ch.id !== id);
    setChannels(nextChannels);
    const updated = removeFromRecentlyWatched(id);
    setRecentlyWatched(updated);
    if (selectedChannel?.id === id) {
      setSelectedChannel(nextChannels[0]);
    }
  };

  const toggleFavoriteChannel = (id: string) => {
    setChannels(channels.map(ch => ch.id === id ? { ...ch, isFavorite: !ch.isFavorite } : ch));
  };

  const handleVideoError = () => {
    if (!selectedChannel) return;
    const currentIndex = channels.findIndex(ch => ch.id === selectedChannel.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    handleSelectChannel(channels[nextIndex]);
  };

  const clearChannels = () => {
    setChannels([]);
    localStorage.removeItem('iptv_channels');
    setSelectedChannel(undefined);
  };

  const addChannels = (newChannels: Channel[]) => {
    setChannels([...channels, ...newChannels]);
  };

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    localStorage.setItem('iptv_last_channel_id', channel.id);
    const updated = addToRecentlyWatched(channel);
    setRecentlyWatched(updated);
  };

// SearchBar removed from here. Use ./components/SearchBar instead.

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      <AddPlaylist isOpen={isAddPlaylistOpen} onClose={() => setIsAddPlaylistOpen(false)} onAdd={addChannels} onClear={clearChannels} />
      
      {/* Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0f0f0f] border-t border-white/5 grid grid-cols-5 z-50">
        <button onClick={() => { setActiveMenu('none'); setIsAddPlaylistOpen(true); }} className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-white">
          <Plus size={20} />
          <span className="text-[10px] mt-1">Playlist</span>
        </button>
        <button onClick={() => setActiveMenu('favorites')} className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-white">
          <Heart size={20} />
          <span className="text-[10px] mt-1">Favorit</span>
        </button>
        <button onClick={() => setActiveMenu('history')} className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-white">
          <Clock size={20} />
          <span className="text-[10px] mt-1">History</span>
        </button>
        <button onClick={() => setActiveMenu('search')} className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-white">
          <Search size={20} />
          <span className="text-[10px] mt-1">Search</span>
        </button>
        <button onClick={() => setActiveMenu('about')} className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-white">
          <Info size={20} />
          <span className="text-[10px] mt-1">Tentang</span>
        </button>
      </div>
      
      <AnimatePresence>
        {activeMenu === 'favorites' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 bottom-16 bg-[#0a0a0a]/90 z-[70] p-4 overflow-y-auto w-full"
          >
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-white">Favorit</h2>
               <button onClick={() => setActiveMenu('none')}><X className="text-white" /></button>
            </div>
            {categories.filter(c => c !== 'All').map((cat) => {
               const channelsInCategory = channels.filter((c) => c.isFavorite && (c.groupTitle === cat));
               if (channelsInCategory.length === 0) return null;
               return (
                 <Accordion key={cat} title={cat}>
                   <ChannelList channels={channelsInCategory} onSelect={(ch) => {handleSelectChannel(ch); setActiveMenu('none');}} onRemove={removeChannel} onToggleFavorite={toggleFavoriteChannel} activeChannelId={selectedChannel?.id} />
                 </Accordion>
               );
             })}
          </motion.div>
        )}
        
        {activeMenu === 'history' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 bottom-16 bg-[#0a0a0a]/90 z-[70] p-4 overflow-y-auto w-full"
          >
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-white">History</h2>
               <button onClick={() => setActiveMenu('none')}><X className="text-white" /></button>
            </div>
             <RecentlyWatched channels={recentlyWatched} onSelect={(ch) => {handleSelectChannel(ch); setActiveMenu('none');}} />
          </motion.div>
        )}
        
        {activeMenu === 'search' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 bottom-16 bg-[#0a0a0a]/90 z-[70] p-4 overflow-y-auto w-full"
          >
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-white">Search</h2>
               <button onClick={() => setActiveMenu('none')}><X className="text-white" /></button>
            </div>
             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 mb-2">Results:</p>
             {categories.filter(c => c !== 'All').map((cat) => {
               const channelsInCategory = filteredChannels.filter((c) => c.groupTitle === cat);
               if (channelsInCategory.length === 0) return null;
               return (
                 <Accordion key={cat} title={cat}>
                   <ChannelList channels={channelsInCategory} onSelect={(ch) => {handleSelectChannel(ch); setActiveMenu('none');}} onRemove={removeChannel} onToggleFavorite={toggleFavoriteChannel} activeChannelId={selectedChannel?.id} />
                 </Accordion>
               );
             })}
          </motion.div>
        )}
        {activeMenu === 'about' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 bottom-16 bg-[#0a0a0a]/90 z-[70] p-4 overflow-y-auto w-full"
          >
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold text-white">Tentang</h2>
               <button onClick={() => setActiveMenu('none')}><X className="text-white" /></button>
            </div>
            <AboutDeveloper />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop & Mobile Main Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-80 bg-[#0d0d0d] border-r border-white/5 overflow-y-auto no-scrollbar">
             <button 
                onClick={() => setIsAddPlaylistOpen(true)}
                className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-sm"
              >
                Add Playlist
              </button>
             <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
             <div className="p-4">
               <Accordion title="Favorite Channels">
                {channels.filter(c => c.isFavorite).length > 0 ? (
                  <ChannelList channels={channels.filter(c => c.isFavorite)} onSelect={handleSelectChannel} onRemove={removeChannel} onToggleFavorite={toggleFavoriteChannel} activeChannelId={selectedChannel?.id} />
                ) : (
                  <div className="text-xs text-slate-500 p-2">No favorites yet.</div>
                )}
               </Accordion>
               <Accordion title="Watched History">
                 <RecentlyWatched channels={recentlyWatched} onSelect={handleSelectChannel} />
               </Accordion>
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-6 mb-4">Channels</h2>
               {categories.filter(c => c !== 'All').map((cat) => {
                  const channelsInCategory = filteredChannels.filter((c) => c.groupTitle === cat);
                  if (channelsInCategory.length === 0) return null;
                  return (
                    <Accordion key={cat} title={cat}>
                      <ChannelList channels={channelsInCategory} onSelect={setSelectedChannel} onRemove={removeChannel} onToggleFavorite={toggleFavoriteChannel} activeChannelId={selectedChannel?.id} />
                    </Accordion>
                  );
                })}
                <button onClick={() => setActiveMenu('about')} className="text-slate-400 hover:text-white mt-6 flex items-center gap-2"><Info size={16}/> Tentang Pengembang</button>
             </div>
        </div>

        {/* Video Player & Context */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="sticky top-0 z-50 bg-[#0a0a0a]">
              {/* Header Moved Here */}
              <header className="h-16 flex justify-between items-center px-4 bg-[#0f0f0f] border-b border-white/5">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-white tracking-tight">Pujashanti IPTV</h1>
                </div>
                <div className="flex items-center gap-4">
                </div>
              </header>
              
              <div className="min-h-[calc(100vw*9/16)] md:min-h-[460px]">
                {selectedChannel ? (
                  <>
                    <VideoPlayer url={selectedChannel.url} onError={handleVideoError} name={selectedChannel.name} />
                    <div className="p-3 text-white flex justify-between items-center bg-[#0a0a0a]">
                      <div className="font-bold text-lg">{selectedChannel.name}</div>
                      <button 
                        onClick={() => toggleFavoriteChannel(selectedChannel.id)}
                        className={`p-2 rounded-full ${selectedChannel.isFavorite ? 'text-red-500' : 'text-slate-400'} hover:bg-white/5 transition`}
                      >
                        <Heart size={24} fill={selectedChannel.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-[#0f0f0f] border border-white/5 rounded-lg text-slate-500 h-64 m-4">No channel selected</div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {/* Ad for mobile/desktop below sticky player */}
                <div className="p-4 md:px-6 md:hidden">
                  <AdSenseAd />
                </div>
                <div className="p-4 md:px-6 pb-20">
                    {selectedChannel && <EPGViewer program={epgData[selectedChannel.id]?.[0]} />}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
