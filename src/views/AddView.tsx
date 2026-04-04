import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowLeft, Music, Headphones, Book, Film, Tv, Clock } from 'lucide-react';
import { MediaType, SearchResult } from '../services/api';
import { haptics } from '../utils/haptics';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { LogMediaModal } from '../components/LogMediaModal';

const MEDIA_TYPES: { id: MediaType; label: string; icon: React.ReactNode }[] = [
  { id: 'movie', label: 'Films', icon: <Film className="w-4 h-4" /> },
  { id: 'tv', label: 'TV Shows', icon: <Tv className="w-4 h-4" /> },
  { id: 'music', label: 'Music', icon: <Music className="w-4 h-4" /> },
  { id: 'anime', label: 'Anime', icon: <Tv className="w-4 h-4" /> },
  { id: 'manga', label: 'Manga', icon: <Book className="w-4 h-4" /> },
  { id: 'book', label: 'Books', icon: <Book className="w-4 h-4" /> },
  { id: 'podcast', label: 'Podcasts', icon: <Headphones className="w-4 h-4" /> },
  { id: 'webnovel', label: 'Webnovels', icon: <Book className="w-4 h-4" /> },
];

export function AddView({ onAddItem, initialType }: { onAddItem: (item: SearchResult, details: { rating: number, date: string, liked: boolean, rewatched: boolean }) => void, initialType?: MediaType }) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<MediaType>(initialType || 'movie');

  useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
  }, [initialType]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const { history, addToHistory, removeFromHistory } = useSearchHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (searchQuery: string, loadMore = false) => {
    if (!searchQuery.trim()) return;
    
    if (!loadMore) {
      setIsLoading(true);
      setHasSearched(true);
      setPage(1);
      setResults([]);
      addToHistory(searchQuery, activeType);
    }

    // Mock API call
    setTimeout(() => {
      const mockResults: SearchResult[] = Array.from({ length: loadMore ? 10 : 20 }).map((_, i) => ({
        id: `mock_${Date.now()}_${i}`,
        title: `${searchQuery} - ${activeType} ${loadMore ? page * 20 + i + 1 : i + 1}`,
        subtitle: `Mock ${activeType} description`,
        image: `https://picsum.photos/seed/${searchQuery}${i}/200/300`,
        type: activeType
      }));

      setResults(prev => loadMore ? [...prev, ...mockResults] : mockResults);
      setHasMore(mockResults.length > 0); // In a real app, check if returned items < limit
      setIsLoading(false);
      if (!loadMore) setPage(2);
      else setPage(p => p + 1);
    }, 800);
  }, [activeType, addToHistory, page]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      handleSearch(query);
    }
  };

  const handleClearFocus = () => {
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleHistoryClick = (historyQuery: string, historyType: MediaType) => {
    setQuery(historyQuery);
    setActiveType(historyType);
    handleSearch(historyQuery);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && hasSearched) {
          handleSearch(query, true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, hasSearched, handleSearch, query]);

  return (
    <div className="flex flex-col h-full bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)]">
      {/* Header / Search Bar Area */}
      <div className="px-4 pt-4 pb-2 z-10 bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)]">
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isFocused && (
              <motion.button
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={handleClearFocus}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--tertiary-system-background)] text-[var(--label)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div className="relative flex-1">
            <Search 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--secondary-label)] cursor-pointer" 
              onClick={() => {
                inputRef.current?.blur();
                handleSearch(query);
              }}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-[var(--tertiary-system-background)] border border-[var(--separator)] rounded-full py-3 pl-11 pr-4 text-base font-sans text-[var(--label)] placeholder:text-[var(--secondary-label)] focus:outline-none focus:ring-2 focus:ring-[var(--label)]/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Media Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-4 -mx-4 px-4 hide-scrollbar">
          {MEDIA_TYPES.map((type) => (
            <motion.button
              key={type.id}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              onClick={() => {
                haptics.light();
                setActiveType(type.id);
                setQuery('');
                setHasSearched(false);
                setResults([]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                activeType === type.id
                  ? 'bg-[var(--label)] text-[var(--system-background)] shadow-lg scale-105 ring-2 ring-[var(--label)] ring-offset-2 ring-offset-[var(--system-background)]'
                  : 'bg-[var(--tertiary-system-background)] text-[var(--secondary-label)] hover:bg-[var(--secondary-system-background)] hover:scale-105'
              }`}
            >
              {type.icon}
              <span className="text-sm font-medium">{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 hide-scrollbar"
        onClick={() => isFocused && handleClearFocus()}
      >
        <AnimatePresence mode="wait">
          {!hasSearched && !isLoading ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-4"
            >
              {history.length > 0 ? (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[var(--secondary-label)] mb-3 px-1">Recent Searches</h3>
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--tertiary-system-background)] transition-colors cursor-pointer group"
                      onClick={() => handleHistoryClick(item.query, item.mediaType)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Clock className="w-4 h-4 text-[var(--secondary-label)] shrink-0" />
                        <span className="font-sans text-[var(--label)] truncate">{item.query}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 pl-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-[var(--tertiary-system-background)] text-[var(--secondary-label)]">
                          {MEDIA_TYPES.find(t => t.id === item.mediaType)?.label || item.mediaType}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[var(--secondary-label)] hover:text-[var(--label)] transition-all"
                        >
                          <ArrowLeft className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-[var(--secondary-label)]">
                  <Search className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Search for {MEDIA_TYPES.find(t => t.id === activeType)?.label}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 space-y-3"
            >
              {results.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-3 rounded-xl bg-[var(--tertiary-system-background)] cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedItem(item)}
                >
                  <img src={item.image || undefined} alt={item.title} className="w-12 h-16 object-cover rounded-md bg-[var(--secondary-system-background)]" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-semibold text-[var(--label)] truncate">{item.title}</h4>
                    <p className="font-sans text-sm text-[var(--secondary-label)] truncate">{item.subtitle}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-[var(--secondary-label)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <div ref={observerTarget} className="h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LogMediaModal 
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onSave={(item, details) => {
          onAddItem(item, details);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
