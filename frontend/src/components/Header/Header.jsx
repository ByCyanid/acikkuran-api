import React, { useState } from 'react'
import { Settings, BookIcon, Home, BookmarkPlus, CheckCircle } from 'lucide-react'
import { useQuran } from '../../context/QuranContext'

const Header = ({ onOpenSettings }) => {
  const { currentSurah, setCurrentView, saveProgress } = useQuran()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveProgress()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-[var(--bg-paper)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm z-50 transition-colors">
      <div className="flex items-center gap-4 text-[var(--text-main)] font-bold text-lg sm:text-xl">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="p-2 -ml-2 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base border border-transparent hover:border-[var(--primary)]"
          title="Ana Sayfaya Dön"
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline">Ana Sayfa</span>
        </button>
        <div className="hidden lg:flex items-center gap-3">
          <BookIcon className="w-8 h-8 text-[var(--primary)]" strokeWidth={2.5} />
          <h1 className="italic tracking-tight">Açık Kuran</h1>
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
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={handleSave}
          className={`p-2 flex items-center gap-2 rounded-xl transition-all duration-300 font-semibold text-sm sm:text-base ${
            saved 
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105 border-transparent' 
            : 'text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white border border-[var(--primary)]'
          }`}
          title="Kaldığım Yeri İşaretle"
        >
          {saved ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <BookmarkPlus className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span className="hidden sm:inline">{saved ? 'İşaretlendi' : 'Kaldığım Yer İşaretle'}</span>
        </button>

        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-[var(--primary)] hover:text-white rounded-xl transition-all text-[var(--text-main)] duration-200 border border-transparent hover:border-[var(--primary)]"
          title="Ayarlar"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </header>
  )
}

export default Header
