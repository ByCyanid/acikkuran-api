import React from 'react'
import { useQuran } from '../../context/QuranContext'
import { Loader2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FootnoteTooltip = ({ verse }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasFootnotes = verse.translation?.footnotes && verse.translation.footnotes.length > 0;

  if (!hasFootnotes) {
    return (
      <span className="inline-flex items-center justify-center font-bold text-[var(--secondary)] mx-1.5 opacity-80 text-sm">
        [{verse.verse_number}]
      </span>
    );
  }

  return (
    <span 
      className="relative inline-flex items-center justify-center font-bold text-[var(--primary)] mx-1.5 cursor-pointer text-sm underline decoration-dotted underline-offset-4"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      [{verse.verse_number}]
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 w-[280px] sm:w-[320px] p-4 bg-[var(--bg-paper)] shadow-2xl border border-[var(--border)] rounded-xl z-50 text-base text-left !text-[var(--text-translation)] font-normal leading-relaxed before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:-mt-[1px] before:border-[8px] before:border-transparent before:border-t-[var(--border)] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:-mt-[2px] after:border-[8px] after:border-transparent after:border-t-[var(--bg-paper)]"
          >
            {verse.translation.footnotes.map(fn => (
              <div key={fn.id} className="mb-3 last:mb-0">
                <span className="font-bold text-[var(--primary)] mr-1">({fn.number})</span> 
                {fn.text}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

const Page = () => {
  const { 
    pageData, loading, error, 
    displayMode, page, isMushafLayout, 
    verseIndex, nextVerse, prevVerse,
    nextPage, prevPage
  } = useQuran()

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      if (displayMode === 'turkish') prevVerse();
      else prevPage();
    } else if (info.offset.x < -threshold) {
      if (displayMode === 'turkish') nextVerse();
      else nextPage();
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
        <p className="text-[var(--text-main)] font-medium text-lg sm:text-xl">Yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[var(--text-muted)]">
        <AlertCircle className="w-12 h-12 text-red-500/80" />
        <p className="font-medium text-lg sm:text-xl text-center px-4">{error}</p>
      </div>
    )
  }

  if (!pageData || pageData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[var(--text-muted)]">
        <p className="font-medium text-lg sm:text-xl text-center px-4">Bu sayfada gösterilecek ayet bulunamadı.</p>
      </div>
    )
  }

  // Single Verse Mode (Turkish Only Focus)
  if (displayMode === 'turkish') {
    const verse = pageData[verseIndex]
    if (!verse) return null

    return (
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        className="w-full h-full flex items-center justify-center min-h-[70vh] cursor-grab active:cursor-grabbing px-4 sm:px-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${verse.id}-${verseIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl text-center space-y-8 sm:space-y-12"
          >
            {/* Show Bismillah if it's the start of a surah */}
            {verse.zero && (
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                <div className="arabic-text text-4xl sm:text-5xl font-bold !text-[var(--text-arabic)]">
                  {verse.zero.verse}
                </div>
                <div className="translation-text text-lg sm:text-xl italic !text-[var(--text-translation)] opacity-60 px-4">
                   {verse.zero.translation?.text}
                </div>
                <div className="w-20 sm:w-24 h-1 bg-[var(--secondary)] mx-auto opacity-30" />
              </div>
            )}

            <div className="space-y-6 sm:space-y-8">
              <span className="inline-block px-4 py-1 rounded-full bg-[var(--secondary)] text-[var(--bg-paper)] font-bold text-xs sm:text-sm tracking-widest uppercase mb-4">
                 Ayet {verse.verse_number}
              </span>
              
              <h2 className="translation-text text-3xl sm:text-4xl lg:text-5xl leading-tight font-medium !text-[var(--text-translation)] px-4">
                {verse.translation?.text}
              </h2>

              {verse.translation?.footnotes?.length > 0 && (
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--border)] border-dashed max-w-xl mx-auto text-left px-4">
                  {verse.translation.footnotes.map((fn) => (
                    <p key={fn.id} className="text-sm sm:text-base !text-[var(--text-muted)] italic leading-relaxed mb-4 last:mb-0">
                      <span className="font-bold text-[var(--primary)] mr-2">[{fn.number}]</span> {fn.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }

  // Mushaf Layout (Block Mode)
  if (isMushafLayout) {
    return (
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        className="w-full max-w-4xl mx-auto p-6 sm:p-12 space-y-12 cursor-grab active:cursor-grabbing"
      >
        {/* Only show bismillah if the first verse on the page has it */}
        {pageData?.[0]?.zero && (
          <div className="text-center py-6 sm:py-10">
            <div className="arabic-text text-4xl sm:text-5xl mb-4 sm:mb-6 font-bold !text-[var(--text-arabic)]">
              {pageData[0].zero.verse}
            </div>
          </div>
        )}

        {(displayMode === 'arabic' || displayMode === 'both') && (
          <div className="mushaf-layout arabic-text text-3xl sm:text-4xl leading-[2.5] sm:leading-[3.2] text-right !text-[var(--text-arabic)]">
            {pageData?.map((verse) => (
              <React.Fragment key={verse.id}>
                {verse.verse}
                <span className="mushaf-verse-mark">
                  {verse.verse_number}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {(displayMode === 'turkish' || displayMode === 'both') && (
          <div className="mushaf-layout translation-text mt-8 text-lg sm:text-xl leading-[2] sm:leading-[2] text-justify !text-[var(--text-translation)]" dir="ltr">
            {pageData?.map((verse) => (
              <React.Fragment key={`tr-${verse.id}`}>
                {verse.translation?.text}
                <FootnoteTooltip verse={verse} />
              </React.Fragment>
            ))}
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div 
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.05}
      onDragEnd={handleDragEnd}
      className="w-full max-w-4xl mx-auto p-6 sm:p-12 space-y-12 sm:space-y-16 cursor-grab active:cursor-grabbing"
    >
      {pageData?.map((verse) => (
        <div key={verse.id} className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 border-b border-[var(--border)] last:border-0">
          {/* Bismillah (Verse Zero) check */}
          {verse.zero && (
            <div className="text-center py-6 sm:py-10 border-b border-[var(--border)] mb-8 sm:mb-10 pb-8 sm:pb-10">
              <div className="arabic-text text-4xl sm:text-5xl mb-4 sm:mb-6 font-bold !text-[var(--text-arabic)]">
                {verse.zero.verse}
              </div>
              {displayMode !== 'arabic' && (
                <div className="translation-text text-lg sm:text-xl italic !text-[var(--text-translation)] opacity-80 px-4">
                   {verse.zero.translation?.text}
                </div>
              )}
            </div>
          )}

          {/* Main Verse Content */}
          <div className="flex flex-col gap-8 sm:gap-10">
            {(displayMode === 'arabic' || displayMode === 'both') && (
              <div className="arabic-text text-4xl sm:text-5xl leading-[1.8] sm:leading-[2.1] text-right font-medium !text-[var(--text-arabic)]">
                <span className="inline-block bg-[var(--primary)] text-white px-3 sm:px-4 py-1 rounded-full text-lg sm:text-xl ml-4 sm:ml-6 font-bold border border-[var(--primary)] shadow-sm">
                  {verse.verse_number}
                </span>
                {verse.verse}
              </div>
            )}

            {(displayMode === 'turkish' || displayMode === 'both') && (
              <div className="translation-text text-xl sm:text-2xl leading-relaxed !text-[var(--text-translation)] border-l-4 sm:border-l-8 border-[var(--secondary)] pl-6 sm:pl-8 py-3 sm:py-4 bg-black/5 dark:bg-white/5 rounded-r-xl">
                <span className="font-bold text-[var(--secondary)] mr-2 sm:mr-3">[{verse.verse_number}]</span>
                {verse.translation?.text}
                {verse.translation?.footnotes?.length > 0 && (
                  <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-[var(--border)] border-dashed">
                    {verse.translation.footnotes.map((fn) => (
                      <p key={fn.id} className="text-sm sm:text-base !text-[var(--text-muted)] italic">
                        <span className="font-bold text-[var(--primary)] uppercase text-xs">({fn.number})</span> {fn.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default Page
