/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { profileData, diaryData } from './data/mockData';
import { Header } from './components/Header';
import { MediaScroller } from './components/MediaScroller';
import { RichBlocks } from './components/RichBlocks';
import { AddMediaModal } from './components/AddMediaModal';
import { RecommendationModal } from './components/RecommendationModal';
import { AuthScreen } from './components/AuthScreen';
import { DiaryView, DiaryEntry } from './components/DiaryView';
import { Reorder, useDragControls, AnimatePresence } from 'motion/react';
import { SearchResult, MediaType, Album } from './services/api';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

import { BottomTabBar } from './components/BottomTabBar';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-light sm:bg-[#E5E5E5] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm text-center border border-black/5">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-ink-black mb-3">Something went wrong</h2>
            <p className="text-gray text-sm mb-8">
              We're sorry, but there was an error loading this content. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-ink-black text-white rounded-xl py-3.5 font-medium hover:bg-ink-black/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function DraggableSection({ section, onAddClick, onLogEpisode, albums, onAddToAlbum, onCreateAlbum }: { section: any, onAddClick: () => void, onLogEpisode?: any, albums?: Album[], onAddToAlbum?: any, onCreateAlbum?: any }) {
  const controls = useDragControls();
  return (
    <Reorder.Item 
      value={section} 
      dragListener={false} 
      dragControls={controls}
      className="relative bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)] z-0"
    >
      <MediaScroller 
        section={section} 
        dragControls={controls} 
        onAddClick={onAddClick} 
        onLogEpisode={onLogEpisode}
        albums={albums}
        onAddToAlbum={onAddToAlbum}
        onCreateAlbum={onCreateAlbum}
      />
    </Reorder.Item>
  );
}

export default function App() {
  const { user, isLoading } = useAuth();
  const [sections, setSections] = useState(profileData.sections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<{ id: string, type: MediaType, title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'diary'>('profile');
  const [diary, setDiary] = useState<DiaryEntry[]>(diaryData as DiaryEntry[]);
  const [albums, setAlbums] = useState<Album[]>([]);

  const handleCreateAlbum = (title: string, description: string, coverImage: string, firstItem: any) => {
    const newAlbum: Album = {
      id: `album_${Date.now()}`,
      title,
      description,
      coverImage,
      tracks: [firstItem]
    };
    setAlbums(prev => [newAlbum, ...prev]);
  };

  const handleAddToAlbum = (albumId: string, item: any) => {
    setAlbums(prev => prev.map(album => {
      if (album.id === albumId) {
        if (album.tracks.some(t => t.id === item.id)) return album;
        return { ...album, tracks: [...album.tracks, item] };
      }
      return album;
    }));
  };

  const handleAddClick = (section: any) => {
    setActiveSection({ id: section.id, type: section.type as MediaType, title: section.title });
    setIsModalOpen(true);
  };

  const handleAddItem = (item: SearchResult, details: { rating: number, date: string }) => {
    if (!activeSection) return;
    
    // Add to profile section
    setSections(prevSections => 
      prevSections.map(section => {
        if (section.id === activeSection.id) {
          if (section.items.some((i: any) => i.id === item.id)) return section;
          return {
            ...section,
            items: [{ ...item, rating: details.rating, dateAdded: details.date }, ...section.items]
          };
        }
        return section;
      })
    );

    // Add to diary
    const newDiaryEntry: DiaryEntry = {
      id: `d_${Date.now()}`,
      date: details.date,
      rating: details.rating,
      media: {
        ...item,
        type: activeSection.type
      }
    };
    setDiary(prev => [newDiaryEntry, ...prev]);
  };

  const handleLogEpisode = (episode: any, rating: number, date: string, podcast: any) => {
    const newDiaryEntry: DiaryEntry = {
      id: `d_${Date.now()}`,
      date: date,
      rating: rating,
      media: {
        id: episode.id,
        title: episode.title,
        subtitle: podcast.title, // Use podcast title as subtitle
        image: podcast.image, // Use podcast image
        type: 'podcast',
        description: episode.description
      }
    };
    setDiary(prev => [newDiaryEntry, ...prev]);
  };

  const handleRecommendSubmit = (recommendation: any) => {
    console.log('Recommendation submitted:', recommendation);
    // In a real app, this would send data to a backend
  };

  if (isLoading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-[100dvh] bg-light dark:bg-[var(--secondary-system-background)] sm:bg-[#E5E5E5] sm:dark:bg-[var(--secondary-system-background)] text-[var(--label)] font-sans sm:pb-12 selection:bg-quiet-sky dark:selection:bg-ios-blue/30">
        <div className="max-w-[428px] mx-auto bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)] h-[100dvh] sm:h-[850px] shadow-sm sm:rounded-[40px] sm:my-8 sm:overflow-hidden sm:border-[8px] sm:border-ink-black dark:sm:border-[#2C2C2E] relative flex flex-col">
          {/* iOS Status Bar Spacer (simulated for desktop view) */}
          <div className="hidden sm:block h-6 w-full bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)] shrink-0" />
          
          <div className="flex-1 overflow-y-auto hide-scrollbar scroll-container pb-[calc(60px+env(safe-area-inset-bottom))] sm:pb-[80px] pt-safe-top">
            <Header profile={profileData} onRecommendClick={() => setIsRecommendModalOpen(true)} onAuthClick={() => setIsAuthModalOpen(true)} />
            
            <div className="w-full h-[0.5px] bg-[var(--separator)] my-4" />
            
            {activeTab === 'profile' ? (
              <main className="pb-12 space-y-2">
                <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-2">
                  {sections.map((section) => (
                    <DraggableSection 
                      key={section.id} 
                      section={section} 
                      onAddClick={() => handleAddClick(section)}
                      onLogEpisode={handleLogEpisode}
                      albums={albums}
                      onAddToAlbum={handleAddToAlbum}
                      onCreateAlbum={handleCreateAlbum}
                    />
                  ))}
                </Reorder.Group>

                <section className="py-2 bg-[var(--system-background)] dark:bg-[var(--secondary-system-background)]">
                  <div className="flex items-center justify-between px-4 mb-3">
                    <h2 className="font-serif text-lg font-semibold leading-relaxed text-[var(--label)]">
                      Albums
                    </h2>
                  </div>
                  {albums.length > 0 ? (
                    <div className="horizontal-scroll-container hide-scrollbar snap-x snap-mandatory">
                      {albums.map((album) => (
                        <div key={album.id} className="snap-start card-container flex flex-col gap-2 cursor-pointer card-square">
                          <div className="relative overflow-hidden rounded-xl bg-[var(--secondary-system-background)] shadow-sm border border-[var(--separator)] card-image">
                            {album.coverImage ? (
                              <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5">
                                <span className="font-serif text-2xl text-[var(--secondary-label)]">{album.title.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="w-full">
                            <h3 className="font-sans text-base font-semibold leading-tight text-[var(--label)] card-text-truncate">
                              {album.title}
                            </h3>
                            <p className="font-sans text-sm font-medium leading-relaxed text-[var(--secondary-label)] card-text-truncate mt-0.5">
                              {album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-[var(--secondary-label)] text-sm font-sans">
                      No albums created yet.
                    </div>
                  )}
                </section>
                
                <div className="h-4" /> {/* Spacer */}
                
                <RichBlocks blocks={profileData.blocks} />
              </main>
            ) : (
              <main className="pb-12">
                <DiaryView entries={diary} />
              </main>
            )}
          </div>
          
          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* iOS Home Indicator (simulated for desktop view) */}
          <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-[var(--label)] rounded-full z-50" />
        </div>

        {activeSection && (
          <AddMediaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sectionType={activeSection.type}
            sectionTitle={activeSection.title}
            onAdd={handleAddItem}
          />
        )}

        <RecommendationModal
          isOpen={isRecommendModalOpen}
          onClose={() => setIsRecommendModalOpen(false)}
          onSubmit={handleRecommendSubmit}
        />

        <AnimatePresence>
          {(!user || isAuthModalOpen) && (
            <AuthScreen />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
