import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { fetchAuthors, fetchSurahs, fetchPage, fetchSurah } from '../api/quran';
import { revelationOrder } from '../data/revelationOrder';

const QuranContext = createContext();

export const QuranProvider = ({ children }) => {
  const [page, setPage] = useState(0);
  const [verseIndex, setVerseIndex] = useState(0);
  const [authorId, setAuthorId] = useState(105); // Default Erhan Aktaş
  const [displayMode, setDisplayMode] = useState('both'); // arabic, turkish, both
  const [theme, setTheme] = useState(localStorage.getItem('quran-theme') || 'light');
  const [textScale, setTextScale] = useState(parseFloat(localStorage.getItem('quran-text-scale')) || 1);
  const [isRevelationOrder, setIsRevelationOrder] = useState(false);
  const [isMushafLayout, setIsMushafLayout] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [surahs, setSurahs] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSetIsRevelationOrder = (val) => {
    setIsRevelationOrder(val);
    if (val) {
      setIsMushafLayout(false);
      setPage(0); // Start at Surah Index 0
      setVerseIndex(0);
    }
  };

  const handleSetIsMushafLayout = (val) => {
    setIsMushafLayout(val);
    if (val) {
      setIsRevelationOrder(false);
      setPage(0); // Start at Page 0
      setVerseIndex(0);
    }
  };

  const jumpToLastVerseRef = useRef(false);
  const targetVerseNumberRef = useRef(null);

  // Memoized sorted surahs
  const sortedSurahs = useMemo(() => {
    if (!isRevelationOrder || surahs.length === 0) return surahs;
    
    return [...surahs].sort((a, b) => {
      const orderA = revelationOrder.indexOf(a.id);
      const orderB = revelationOrder.indexOf(b.id);
      return orderA - orderB;
    });
  }, [surahs, isRevelationOrder]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('quran-theme', theme);
  }, [theme]);

  // Apply text scale
  useEffect(() => {
    document.documentElement.style.setProperty('--text-scale', textScale);
    localStorage.setItem('quran-text-scale', textScale.toString());
  }, [textScale]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [authorsData, surahsData] = await Promise.all([
          fetchAuthors(),
          fetchSurahs(),
        ]);
        setAuthors(authorsData);
        setSurahs(surahsData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('API bağlantısı kurulamadı.');
      }
    };
    loadInitialData();
  }, []);

  // No longer building abstract non-overlapping sequences since the user elected to read Surahs holistically in chunks

  // Load page data when page or author changed
  useEffect(() => {
    let active = true;
    const loadPageData = async () => {
      setLoading(true);
      // Immediately clear old page data to prevent stale rendering
      setPageData([]);
      
      try {
        if (isRevelationOrder) {
          // In Revelation mode, "page" represents the index (0-113) in the chronological revelation array
          const targetSurahId = revelationOrder[page] || revelationOrder[0];
          const surahObj = await fetchSurah(targetSurahId, authorId);
          if (!active) return;
          
          if (surahObj && surahObj.verses) {
            // Map the verses into standard UI payload equivalent to what `fetchPage` would output
            const mappedVerses = surahObj.verses.map(v => ({
              ...v,
              surah: {
                id: surahObj.id,
                name: surahObj.name,
                name_en: surahObj.name_en,
                slug: surahObj.slug,
                verse_count: surahObj.verse_count,
                page_number: surahObj.page_number,
                name_original: surahObj.name_original,
                audio: surahObj.audio
              },
              zero: v.verse_number === 1 ? surahObj.zero : null
            }));
            
            setPageData(mappedVerses);
          } else {
             setPageData([]);
          }
        } else {
          // Standard page fetching based on Mushaf bounds
          const data = await fetchPage(page, authorId);
          if (!active) return;
          setPageData(data || []);
        }
        
        if (targetVerseNumberRef.current !== null) {
          const targetNum = targetVerseNumberRef.current;
          const vIndex = filteredData.findIndex(v => v.verse_number === targetNum);
          if (vIndex !== -1) {
            setVerseIndex(vIndex);
          } else {
            setVerseIndex(0);
          }
          targetVerseNumberRef.current = null;
        } else if (jumpToLastVerseRef.current) {
          setVerseIndex(Math.max(0, filteredData.length - 1));
          jumpToLastVerseRef.current = false;
        } else {
          setVerseIndex(0);
        }
        
        setError(null);
      } catch (err) {
        if (!active) return;
        console.error(`Failed to load page ${page}:`, err);
        setError(`Sayfa ${page} yüklenemedi.`);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadPageData();
    return () => { active = false; };
  }, [page, authorId, isRevelationOrder]);

  const _maxPageBoundary = isRevelationOrder ? 113 : 604;

  const nextPage = React.useCallback(() => {
    setPage((prev) => Math.min(prev + 1, _maxPageBoundary));
    setVerseIndex(0);
  }, [_maxPageBoundary]);

  const prevPage = React.useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 0));
    setVerseIndex(0);
  }, []);

  const goToPage = React.useCallback((num) => {
    setPage(Math.max(0, Math.min(num, _maxPageBoundary)));
    setVerseIndex(0);
  }, [_maxPageBoundary]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Compute current surah based on pageData
  const currentSurah = useMemo(() => {
    if (pageData.length === 0 || surahs.length === 0) return null;
    const surahId = pageData[0]?.surah?.id || pageData[0]?.surah_id;
    return surahs.find(s => s.id === surahId);
  }, [pageData, surahs]);

  const nextVerse = React.useCallback(() => {
    if (loading) return;
    if (verseIndex < pageData.length - 1) {
      setVerseIndex(prev => prev + 1);
    } else if (page < 604) {
      nextPage();
    }
  }, [loading, verseIndex, pageData.length, page, nextPage]);

  const prevVerse = React.useCallback(() => {
    if (loading) return;
    if (verseIndex > 0) {
      setVerseIndex(prev => prev - 1);
    } else if (page > 0) {
      jumpToLastVerseRef.current = true;
      prevPage();
    }
  }, [loading, verseIndex, page, prevPage]);

  // Cache for surah verse-to-page mappings
  const surahCacheRef = useRef({});

  const jumpToVerse = React.useCallback(async (surahId, verseNumber) => {
    setLoading(true);
    try {
      let surahData = surahCacheRef.current[surahId];
      if (!surahData) {
        surahData = await fetchSurah(surahId);
        surahCacheRef.current[surahId] = surahData;
      }

      const verse = (surahData.verses || []).find(v => v.verse_number === verseNumber);
      if (verse) {
        targetVerseNumberRef.current = verseNumber;
        setPage(verse.page); // verse.page is 0-indexed from API
      } else {
        console.warn(`Verse ${verseNumber} not found in Surah ${surahId}`);
      }
    } catch (err) {
      console.error('Failed to jump to verse:', err);
      setError('Ayet bulunamadı veya bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't navigate if user is typing in the page input or if loading
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || loading) return;

      if (e.key === 'ArrowRight') {
        if (displayMode === 'turkish') nextVerse();
        else nextPage();
      } else if (e.key === 'ArrowLeft') {
        if (displayMode === 'turkish') prevVerse();
        else prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayMode, loading, nextVerse, nextPage, prevVerse, prevPage]);

  const value = {
    page,
    verseIndex,
    authorId,
    setAuthorId,
    displayMode,
    setDisplayMode,
    theme,
    toggleTheme,
    textScale,
    setTextScale,
    isRevelationOrder,
    setIsRevelationOrder: handleSetIsRevelationOrder,
    revelationOrder,
    isMushafLayout,
    setIsMushafLayout: handleSetIsMushafLayout,
    authors,
    surahs: sortedSurahs,
    currentSurah,
    pageData,
    loading,
    error,
    nextPage,
    prevPage,
    nextVerse,
    prevVerse,
    jumpToVerse,
    goToPage,
    setVerseIndex,
  };

  return <QuranContext.Provider value={value}>{children}</QuranContext.Provider>;
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
