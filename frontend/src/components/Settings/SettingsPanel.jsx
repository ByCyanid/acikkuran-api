import React from 'react'
import { X, Check } from 'lucide-react'
import { useQuran } from '../../context/QuranContext'
import { motion, AnimatePresence } from 'framer-motion'

const SettingsPanel = ({ isOpen, onClose }) => {
  const { 
    authorId, setAuthorId, 
    displayMode, setDisplayMode, 
    authors, 
    theme, toggleTheme,
    isRevelationOrder, setIsRevelationOrder,
    isMushafLayout, setIsMushafLayout,
    textScale, setTextScale
  } = useQuran()

  const modes = [
    { id: 'arabic', label: 'Sadece Arapça' },
    { id: 'turkish', label: 'Sadece Türkçe (Meal)' },
    { id: 'both', label: 'Arapça ve Türkçe' }
  ]

  const ToggleItem = ({ label, active, onClick, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all ${
        active 
        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100' 
        : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <span className="font-bold flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5" />}
        {label}
      </span>
      <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </button>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Gelişmiş Ayarlar</h2>
              <button onClick={onClose} className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors text-emerald-900 dark:text-emerald-100 group">
                <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Core Preference */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-[0.2em]">Tema ve Görünüm</h3>
                <div className="space-y-3">
                  <ToggleItem 
                    label={theme === 'light' ? 'Gündüz Modu' : 'Gece Modu'} 
                    active={theme === 'dark'} 
                    onClick={toggleTheme} 
                  />
                  <ToggleItem 
                    label="Mushaf Düzeni (Blok)" 
                    active={isMushafLayout} 
                    onClick={() => setIsMushafLayout(!isMushafLayout)} 
                  />
                  <ToggleItem 
                    label="Nüzul (İniş) Sırası" 
                    active={isRevelationOrder} 
                    onClick={() => setIsRevelationOrder(!isRevelationOrder)} 
                  />
                </div>
              </section>

              {/* Typography / Font Size */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-[0.2em]">Yazı Boyutu</h3>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-2.5 py-1 rounded-lg">
                    {Math.round(textScale * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setTextScale(prev => Math.max(0.7, prev - 0.1))}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all active:scale-95 shrink-0"
                  >
                    <span className="font-bold text-xl leading-none">-</span>
                  </button>
                  
                  <input 
                    type="range"
                    min="0.7"
                    max="2.5"
                    step="0.05"
                    value={textScale}
                    onChange={(e) => setTextScale(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  
                  <button 
                    onClick={() => setTextScale(prev => Math.min(2.5, prev + 0.1))}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all active:scale-95 shrink-0"
                  >
                    <span className="font-bold text-xl leading-none">+</span>
                  </button>
                </div>
              </section>

              {/* Display Mode */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-[0.2em]">Dil Seçenekleri</h3>
                <div className="grid grid-cols-1 gap-2">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setDisplayMode(mode.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        displayMode === mode.id 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20' 
                        : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="font-medium">{mode.label}</span>
                      {displayMode === mode.id && <Check className="w-5 h-5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Author Selection */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest">Meal Sahibi / Yazar</h3>
                <div className="space-y-2">
                   <select 
                     value={authorId}
                     onChange={(e) => setAuthorId(parseInt(e.target.value))}
                     className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all font-medium text-emerald-900 dark:text-emerald-100 appearance-none bg-emerald-50/20 dark:bg-gray-800 cursor-pointer"
                   >
                     {authors?.map(author => (
                       <option key={author.id} value={author.id} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                         {author.name} ({author.language.toUpperCase()})
                       </option>
                     ))}
                   </select>
                   <p className="text-xs text-emerald-600 dark:text-emerald-400 px-2">Uygulama genelinde seçilen meali gösterir.</p>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
               <button 
                 onClick={onClose}
                 className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
               >
                 Değişiklikleri Uygula
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SettingsPanel
