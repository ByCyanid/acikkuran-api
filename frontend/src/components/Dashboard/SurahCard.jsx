import React from 'react';
import { useQuran } from '../../context/QuranContext';

const SurahCard = ({ surah }) => {
  const { jumpToVerse, setCurrentView } = useQuran();

  const handleClick = () => {
    jumpToVerse(surah.id, 1);
    setCurrentView('reader');
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-[var(--bg-paper)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[140px] relative overflow-hidden group border border-[var(--border)] active:scale-95"
    >
      <div className="text-7xl font-bold text-[var(--border)] opacity-30 absolute -top-2 left-4 group-hover:opacity-50 transition-opacity leading-none tracking-tighter">
        {surah.id}
      </div>
      <div className="z-10 mt-auto pt-6 relative">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-1 group-hover:text-[var(--primary)] transition-colors">
          {surah.name}
        </h3>
        <p className="text-sm font-medium text-[var(--text-muted)]">
          {surah.verse_count} Ayet
        </p>
      </div>
    </div>
  );
};

export default SurahCard;
