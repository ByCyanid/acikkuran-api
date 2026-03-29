import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import { useQuran } from '../../context/QuranContext'

const Controls = () => {
  const { 
    page, nextPage, prevPage, 
    surahs, currentSurah, goToPage, 
    displayMode, pageData, verseIndex, 
    nextVerse, prevVerse, setVerseIndex,
    loading, jumpToVerse, isRevelationOrder, isMushafLayout, revelationOrder
  } = useQuran()

  // Use a more robust check: if we are in turkish mode AND not in block layout, we are definitely in single-verse focus.
  const isSingleVerse = displayMode === 'turkish' && !isMushafLayout

  // Prioritize showing the actual verse number from the data if it's available and we are in focus mode
  const navValue = (isSingleVerse && pageData[verseIndex])
    ? pageData[verseIndex].verse_number 
    : (page + 1)
  
  const navMax = (isSingleVerse && currentSurah)
    ? currentSurah.verse_count 
    : (isRevelationOrder ? 114 : 605)

  const [localValue, setLocalValue] = useState(navValue)

  // Sync local value when external state changes
  useEffect(() => {
    setLocalValue(navValue)
  }, [navValue])

  const handleCommit = () => {
    const newVal = parseInt(localValue)
    if (isNaN(newVal) || newVal < 1) {
      setLocalValue(navValue)
      return
    }

    if (isSingleVerse) {
      // Find verse in current pageData first
      const vIndex = pageData.findIndex(v => v.verse_number === newVal)
      if (vIndex !== -1) {
        setVerseIndex(vIndex)
      } else if (currentSurah && newVal <= currentSurah.verse_count) {
        // Cross-page jump within current surah
        jumpToVerse(currentSurah.id, newVal)
      } else {
        setLocalValue(navValue)
      }
    } else {
      goToPage(newVal - 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommit()
      e.target.blur()
    } else if (e.key === 'Escape') {
      setLocalValue(navValue)
      e.target.blur()
    }
  }

  const handleSurahChange = (e) => {
    const surahId = parseInt(e.target.value)
    const surah = surahs.find(s => s.id === surahId)
    if (surah) {
      if (isRevelationOrder) {
        const seqIndex = revelationOrder.indexOf(surahId)
        if (seqIndex !== -1) {
          goToPage(seqIndex)
        }
      } else {
        goToPage(surah.page_number)
      }
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-paper)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg z-40 transition-colors">
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={isSingleVerse ? prevVerse : prevPage}
          disabled={loading || (page === 0 && (!isSingleVerse || verseIndex === 0))}
          className="p-2 sm:p-3 rounded-full hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 transition-colors text-[var(--text-main)] duration-200 border border-[var(--border)]"
          title={isSingleVerse ? "Önceki Ayet" : "Önceki Sayfa"}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex items-center gap-1 sm:gap-2 bg-[var(--bg-app)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[var(--border)]">
          <span className="text-sm sm:text-base font-bold text-[var(--text-main)] mr-1 md:mr-2">
            {isSingleVerse ? "Ayet" : (isRevelationOrder ? "Sure" : "Sayfa")}
          </span>
          <input 
            type="number"
            value={localValue || ''}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCommit}
            onFocus={(e) => e.target.select()}
            min="1"
            max={navMax}
            className="w-10 sm:w-12 bg-transparent text-center font-bold text-[var(--text-main)] outline-none text-sm sm:text-base transition-all"
          />
          <span className="text-[var(--text-muted)] font-medium opacity-60 text-xs sm:text-base">/ {navMax || '-'}</span>
        </div>

        <button 
          onClick={isSingleVerse ? nextVerse : nextPage}
          disabled={loading || ((isRevelationOrder ? page === navMax - 1 : page === 604) && (!isSingleVerse || verseIndex === (pageData?.length || 0) - 1))}
          className="p-2 sm:p-3 rounded-full hover:bg-[var(--primary)] hover:text-white disabled:opacity-50 transition-colors text-[var(--text-main)] duration-200 border border-[var(--border)]"
          title={isSingleVerse ? "Sonraki Ayet" : "Sonraki Sayfa"}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative group">
          <List className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] pointer-events-none" />
          <select 
            onChange={handleSurahChange}
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 bg-[var(--bg-paper)] border border-[var(--border)] rounded-lg text-[var(--text-main)] font-medium outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all appearance-none min-w-[140px] sm:min-w-[200px] text-sm sm:text-base"
            defaultValue=""
          >
            <option value="" disabled className="text-[var(--text-muted)]">Sure...</option>
            {surahs?.map(s => (
              <option key={s.id} value={s.id} className="bg-[var(--bg-paper)] text-[var(--text-main)]">
                {s.id}. {s.name}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)] rotate-90 pointer-events-none" />
        </div>
      </div>
    </nav>
  )
}

export default Controls
