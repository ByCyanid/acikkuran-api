import React, { useState } from 'react';
import { useQuran } from '../../context/QuranContext';
import Sidebar from './Sidebar';
import SurahCard from './SurahCard';
import { Search, UserPlus, LogIn, Play } from 'lucide-react';

const Dashboard = () => {
  const { surahs, isRevelationOrder, setIsRevelationOrder, lastReadProgress, continueReading, jumpToVerse, setCurrentView } = useQuran();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurahTarget, setSelectedSurahTarget] = useState('');

  const filteredSurahs = surahs.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toString() === searchTerm
  );

  const handleGo = () => {
    if (selectedSurahTarget) {
      jumpToVerse(parseInt(selectedSurahTarget), 1);
      setCurrentView('reader');
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-app)] text-[var(--text-main)] font-['Outfit'] overflow-hidden transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 lg:ml-[260px] h-screen overflow-y-auto">
        <div className="max-w-[1300px] mx-auto p-6 md:p-10">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 w-full">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
              <input 
                type="text" 
                placeholder="Aramak istediğiniz sureyi yazın..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-paper)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* User Progress Banner / Continue Reading */}
          {lastReadProgress && (
            <div className="mb-10 bg-[var(--bg-paper)] p-6 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
               <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2 text-[var(--primary)]">Kaldığınız Yerden Devam Edin</h2>
                  <p className="text-[var(--text-muted)] text-sm md:text-base">En son okuduğunuz sure ve ayetten okumaya anında dönebilirsiniz.</p>
               </div>
               <button 
                onClick={continueReading}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[var(--primary)] hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-md whitespace-nowrap"
               >
                 <Play className="w-5 h-5 fill-current" />
                 Devam Et
               </button>
            </div>
          )}

          {/* Surah List Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
             <div className="flex items-center gap-3">
               <h1 className="text-3xl font-bold text-[var(--text-main)]">Sure Listesi</h1>
               <div className="h-6 w-px bg-[var(--border)] hidden md:block"></div>
               <button 
                  onClick={() => setIsRevelationOrder(!isRevelationOrder)}
                  className="text-sm font-semibold text-[var(--primary)] flex items-center gap-1 hover:underline mt-1"
                >
                 {isRevelationOrder ? 'Nüzul (İniş) Sırası' : 'Mushaf Sırası'}
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/></svg>
               </button>
             </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none min-w-[140px]">
                  <select 
                    className="w-full appearance-none bg-[var(--bg-paper)] border border-[var(--border)] text-[var(--text-main)] rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                    value={selectedSurahTarget}
                    onChange={(e) => setSelectedSurahTarget(e.target.value)}
                  >
                    <option value="">Sure Seçiniz...</option>
                    {surahs.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 opacity-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
                
                <button 
                  onClick={handleGo}
                  className="bg-[var(--primary)] text-white hover:opacity-90 px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity flex items-center gap-2 shadow-sm"
                >
                  Git <span>→</span>
                </button>
             </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
            {filteredSurahs.map(surah => (
              <SurahCard key={surah.id} surah={surah} />
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="text-center py-20 text-[var(--text-muted)]">
              Arama kriterinize uygun sure bulunamadı.
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
