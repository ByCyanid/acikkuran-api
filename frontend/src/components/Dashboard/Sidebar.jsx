import React from 'react';
import { BookOpen, List, Bookmark, Heart, Edit3, Sun, Moon } from 'lucide-react';
import { useQuran } from '../../context/QuranContext';

const Sidebar = () => {
  const { theme, toggleTheme } = useQuran();

  return (
    <div className="w-[260px] hidden lg:flex flex-col bg-[var(--bg-paper)] border-r border-[var(--border)] text-[var(--text-main)] h-screen fixed left-0 top-0 bottom-0 z-50 overflow-y-auto transition-colors duration-300">
      {/* Brand */}
      <div className="px-6 py-8 flex items-center justify-center gap-3 border-b border-[var(--border)]">
        <BookOpen className="w-8 h-8 text-[var(--primary)]" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight italic">Açık Kuran</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <a href="#" className="flex items-center gap-4 px-4 py-3 bg-[var(--primary)] text-white rounded-xl font-bold shadow-md shadow-[var(--shadow)] transition-all">
          <List className="w-5 h-5" />
          <span>Sure Listesi</span>
        </a>
        
        <div className="py-4">
           <div className="border-t border-[var(--border)]" />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white rounded-xl font-medium transition-colors group"
        >
          <span className="flex items-center gap-4">
            {theme === 'dark' ? <Moon className="w-5 h-5 opacity-80" /> : <Sun className="w-5 h-5 opacity-80" />}
            {theme === 'dark' ? 'Gece Modu' : 'Gündüz Modu'}
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
