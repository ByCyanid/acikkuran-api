import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuran } from '../../context/QuranContext'
import Page from './Page'

const Book = () => {
  const { page } = useQuran()

  return (
    <div className="w-full h-full flex items-center justify-center max-w-6xl mx-auto pt-28 pb-32 px-4 transition-all duration-300">
      <div className="paper-texture w-full min-h-[85vh] relative overflow-hidden flex flex-col items-center shadow-2xl border border-[var(--border)] rounded-sm">
        {/* Subtle inner shadow for book spine feel */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent dark:from-white/5 pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/10 to-transparent dark:from-white/5 pointer-events-none z-10" />
        
        <div className="w-full flex-1 z-0">
          <Page />
        </div>

        {/* Page Footer */}
        <footer className="w-full py-4 border-t border-[var(--border)] flex justify-center text-[var(--text-main)] font-bold tracking-[0.3em] text-lg bg-[var(--bg-paper)]/80 backdrop-blur-sm transition-colors z-20">
          SAYFA {page + 1}
        </footer>
      </div>
    </div>
  )
}

export default Book
