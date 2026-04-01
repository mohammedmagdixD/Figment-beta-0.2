import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Loader2, Plus, ArrowLeft, Star, Play, Pause } from 'lucide-react';
import { searchMedia, SearchResult, MediaType } from '../services/api';
import { IOSDatePicker } from './IOSDatePicker';
import { haptics } from '../utils/haptics';
import { useScrollLock } from '../hooks/useScrollLock';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: MediaType;
  sectionTitle: string;
  onAdd: (item: SearchResult, details: { rating: number, date: string }) => void;
}

export function AddMediaModal({ isOpen, onClose, sectionType, sectionTitle, onAdd }: AddMediaModalProps) {
  useScrollLock(isOpen);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [logItem, setLogItem] = useState<SearchResult | null>(null);
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingUrl(url);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setLogItem(null);
      setRating(0);
      setDate(new Date().toISOString().split('T')[0]);
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingUrl(null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        const data = await searchMedia(query, sectionType);
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, sectionType]);

  const handleSave = () => {
    if (!logItem) return;
    if (rating === 0) {
      haptics.error();
      return;
    }
    haptics.success();
    onAdd(logItem, { rating, date });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
            onTouchMove={(e) => e.preventDefault()}
            onWheel={(e) => e.preventDefault()}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 120 || velocity.y > 500) {
                haptics.light();
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#1C1C1E] rounded-t-3xl shadow-2xl h-[85vh] flex flex-col sm:max-w-[428px] sm:mx-auto pb-[env(safe-area-inset-bottom)]"
          >
            <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>
            <div className="px-5 pb-5 pt-2 border-b border-black/5 dark:border-white/10 flex flex-col gap-4 shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-ink-black dark:text-white">
                  Add to {sectionTitle}
                </h2>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 600, damping: 35 }}
                  onClick={onClose}
                  className="w-11 h-11 flex items-center justify-center bg-light dark:bg-[#2C2C2E] rounded-full text-dark-gray dark:text-ios-gray-1 hover:text-ink-black dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray dark:text-ios-gray-1" />
                <input
                  type="text"
                  placeholder={sectionType === 'tv' ? 'Search for TV Shows...' : `Search for ${sectionType === 'music' || sectionType === 'anime' || sectionType === 'manga' ? sectionType : sectionType + 's'}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-light dark:bg-[#2C2C2E] border border-black/5 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-base font-sans text-ink-black dark:text-white placeholder:text-gray dark:placeholder:text-ios-gray-1 focus:outline-none focus:ring-2 focus:ring-ink-black/10 dark:focus:ring-white/10 transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 hide-scrollbar overlay-content">
              {logItem ? (
                <div className="p-3 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setLogItem(null)} className="w-11 h-11 flex items-center justify-center bg-light dark:bg-[#2C2C2E] rounded-full text-dark-gray dark:text-ios-gray-1 hover:text-ink-black dark:hover:text-white transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-serif text-xl font-semibold text-ink-black dark:text-white">Log Activity</h2>
                  </div>
                  
                  <div className="flex gap-4 mb-8 bg-light dark:bg-[#2C2C2E] p-4 rounded-2xl border border-black/5 dark:border-white/10">
                    <img src={logItem.image} alt={logItem.title} className="w-16 h-24 object-cover rounded-lg shadow-sm bg-white dark:bg-[#3A3A3C]" />
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-sans font-semibold text-base text-ink-black dark:text-white line-clamp-2 mb-1">{logItem.title}</h3>
                      <p className="font-sans text-sm text-gray dark:text-ios-gray-1 line-clamp-2">{logItem.subtitle}</p>
                    </div>
                  </div>

                  <div className="mb-8 px-1">
                    <label className="block text-sm font-medium text-ink-black dark:text-white mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-90">
                          <Star className={`w-8 h-8 ${rating >= star ? 'fill-ink-black dark:fill-white text-ink-black dark:text-white' : 'text-gray/20 dark:text-white/20 fill-transparent'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-auto px-1">
                    <label className="block text-sm font-medium text-ink-black dark:text-white mb-3">Date</label>
                    <IOSDatePicker 
                      value={date} 
                      onChange={setDate}
                    />
                  </div>

                  <button 
                    onClick={() => {
                      onAdd(logItem, { rating, date });
                      onClose();
                    }}
                    className="w-full bg-ink-black dark:bg-white text-white dark:text-ink-black rounded-xl py-4 font-medium text-base hover:bg-ink-black/90 dark:hover:bg-white/90 transition-colors mt-4"
                  >
                    Save to Diary
                  </button>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 text-gray dark:text-ios-gray-1 animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {results.map((item, index) => (
                    <div 
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-light dark:hover:bg-[#2C2C2E] transition-colors group cursor-pointer"
                      onClick={() => setLogItem(item)}
                    >
                      <div className="relative shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className={`w-12 h-12 object-cover rounded-md bg-black/5 dark:bg-white/10 ${sectionType === 'music' ? 'rounded-full' : ''}`}
                        />
                        {item.previewUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay(item.previewUrl!);
                            }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ borderRadius: sectionType === 'music' ? '9999px' : '0.375rem' }}
                          >
                            {playingUrl === item.previewUrl ? <Pause className="w-5 h-5 text-white fill-white" /> : <Play className="w-5 h-5 text-white fill-white" />}
                          </button>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans font-medium text-base text-ink-black dark:text-white truncate">
                          {item.title}
                        </h3>
                        <p className="font-sans text-sm text-gray dark:text-ios-gray-1 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <button
                        className="w-8 h-8 rounded-full bg-ink-black dark:bg-white text-white dark:text-ink-black flex items-center justify-center shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : query.trim().length > 2 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray dark:text-ios-gray-1 font-sans text-sm">
                  No results found.
                </div>
              ) : query.trim().length > 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray dark:text-ios-gray-1 font-sans text-sm opacity-60">
                  Please type more to search...
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray dark:text-ios-gray-1 font-sans text-sm opacity-60">
                  Type to start searching...
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
