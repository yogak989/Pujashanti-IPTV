import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function SearchBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }: SearchBarProps) {
  return (
    <div className="p-4 bg-[#0a0a0a]">
      <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded border border-white/10 mb-2">
        <Search size={16} className="text-slate-500" />
        <input 
          type="text" 
          placeholder="Search channels..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none"
        />
      </div>
      <select 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full bg-[#1a1a1a] text-white text-xs p-2 rounded border border-white/10 outline-none"
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
  );
}
