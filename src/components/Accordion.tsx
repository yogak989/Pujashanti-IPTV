import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function Accordion({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between p-3 text-sm text-white hover:bg-white/5">
        {title}
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="p-3 bg-[#111]">{children}</div>}
    </div>
  );
}
