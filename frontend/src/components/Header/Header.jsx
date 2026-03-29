import React from 'react'
import { Settings, BookIcon } from 'lucide-react'
import { useQuran } from '../../context/QuranContext'

const Header = ({ onOpenSettings }) => {
  const { currentSurah } = useQuran()

  return (
    <header className="fixed top-0 left-0 right-0 bg-[var(--bg-paper)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm z-50 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 text-[var(--text-main)] font-bold text-lg sm:text-xl">
        <div className="hidden sm:flex items-center gap-3">
          <BookIcon className="w-8 h-8 text-[var(--primary)]" strokeWidth={2.5} />
          <h1 className="italic tracking-tight">Açık Kuran Meali</h1>
        </div>
        <div className="flex sm:hidden">
          <BookIcon className="w-7 h-7 text-[var(--primary)]" strokeWidth={2.5} />
        </div>
      </div>

      {currentSurah && (
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <h2 className="text-[var(--primary)] font-bold text-lg sm:text-2xl tracking-wide uppercase">
            {currentSurah.name}
          </h2>
          <span className="hidden sm:block text-[var(--text-muted)] text-xs font-medium opacity-60">
            {currentSurah.name_original}
          </span>
        </div>
      )}
      
      <button 
        onClick={onOpenSettings}
        className="p-2 hover:bg-[var(--primary)] hover:text-white rounded-full transition-all text-[var(--text-main)] duration-200 border border-transparent hover:border-[var(--primary)]"
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </header>
  )
}

export default Header
