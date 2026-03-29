import React from 'react'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { useQuran } from '../../context/QuranContext'
import Page from './Page'

const Book = () => {
  const { 
    page, 
    verseIndex, 
    displayMode, 
    isRevelationOrder, 
    isMushafLayout, 
    lastReadProgress,
    deleteProgress
  } = useQuran()

  const isSingleVerse = displayMode === 'turkish' && !isMushafLayout
  
  // Check if current view matches saved progress
  const isBookmarked = lastReadProgress && 
    lastReadProgress.page === page &&
    lastReadProgress.isRevelationOrder === isRevelationOrder &&
    lastReadProgress.isMushafLayout === isMushafLayout &&
    (isSingleVerse ? lastReadProgress.verseIndex === verseIndex : true)

  return (
    <div className="w-full h-full flex items-center justify-center max-w-6xl mx-auto pt-28 pb-32 px-4 transition-all duration-300">
      <div className="paper-texture w-full min-h-[85vh] relative overflow-hidden flex flex-col items-center shadow-2xl border border-[var(--border)] rounded-sm">
        {/* Subtle inner shadow for book spine feel */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent dark:from-white/5 pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/10 to-transparent dark:from-white/5 pointer-events-none z-10" />
        
        {/* Red Bookmark visual indicator */}
        {isBookmarked && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: -4, opacity: 1 }}
            whileHover={{ y: 0, scale: 1.1 }}
            onClick={deleteProgress}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="absolute top-0 right-6 sm:right-12 z-30 text-rose-600 dark:text-rose-500 drop-shadow-md cursor-pointer hover:text-rose-700 transition-colors"
            title="İşareti Kaldır"
          >
            <Bookmark className="w-10 h-14 sm:w-12 sm:h-16 fill-current" strokeWidth={1} />
          </motion.div>
        )}

        <div className="w-full flex-1 z-0 relative">
          <Page />
        </div>

        {/* Page Footer */}
        <footer className="w-full py-4 border-t border-[var(--border)] flex justify-center text-[var(--text-main)] font-bold tracking-[0.3em] text-lg bg-[var(--bg-paper)]/80 backdrop-blur-sm transition-colors z-20">
          {isRevelationOrder ? `SURE ${page + 1}` : `SAYFA ${page + 1}`}
        </footer>
      </div>
    </div>
  )
}

export default Book
