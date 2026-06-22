import { EPGProgram } from '../types';

export default function EPGViewer({ program }: { program?: EPGProgram }) {
  if (!program) return null;

  const formatDate = (dateStr: string) => {
    // Basic XMLTV date parsing: YYYYMMDDHHMMSS
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const min = dateStr.substring(10, 12);
    return `${day}/${month}/${year} ${hour}:${min}`;
  };

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/10 mt-4 text-slate-300">
      <h3 className="text-lg font-bold text-white mb-2">{program.title}</h3>
      <p className="text-sm mb-2">{program.desc}</p>
      <div className="text-xs text-slate-400">
        {formatDate(program.start)} - {formatDate(program.stop)}
      </div>
    </div>
  );
}
