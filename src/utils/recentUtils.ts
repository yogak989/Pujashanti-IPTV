import { Channel } from '../types';

export const getRecentlyWatched = (): Channel[] => {
  const saved = localStorage.getItem('recently_watched');
  return saved ? JSON.parse(saved) : [];
};

export const addToRecentlyWatched = (channel: Channel) => {
  const recent = getRecentlyWatched();
  const filtered = recent.filter(c => c.id !== channel.id);
  const updated = [channel, ...filtered].slice(0, 5);
  localStorage.setItem('recently_watched', JSON.stringify(updated));
  return updated;
};

export const removeFromRecentlyWatched = (channelId: string) => {
    const recent = getRecentlyWatched();
    const updated = recent.filter(c => c.id !== channelId);
    localStorage.setItem('recently_watched', JSON.stringify(updated));
    return updated;
}
