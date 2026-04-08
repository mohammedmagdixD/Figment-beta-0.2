import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Music, Headphones, Book, Film, Tv } from 'lucide-react';
import { getRecommendations } from '../services/supabaseData';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';

const getIconForType = (type: string) => {
  switch (type) {
    case 'music': return <Music className="w-4 h-4" />;
    case 'podcast': return <Headphones className="w-4 h-4" />;
    case 'book':
    case 'manga':
    case 'webnovel': return <Book className="w-4 h-4" />;
    case 'movie': return <Film className="w-4 h-4" />;
    case 'tv':
    case 'anime': return <Tv className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

export function RecommendationsView({ viewingUserId }: { viewingUserId?: string }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use viewingUserId if provided, otherwise fallback to the logged-in user
  const targetUserId = viewingUserId || user?.id;

  useEffect(() => {
    async function fetchRecommendations() {
      if (!targetUserId) return;
      try {
        setIsLoading(true);
        const data = await getRecommendations(targetUserId);
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [targetUserId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-1">
        <Loader2 className="w-8 h-8 text-[var(--secondary-label)] animate-spin" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-1 px-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-[var(--secondary-system-background)] flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[var(--secondary-label)]" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-[var(--label)] mb-2">
          No Recommendations Yet :/
        </h2>
        <p className="font-sans text-sm text-[var(--secondary-label)] max-w-[250px]">
          Share your profile to get personalized recommendations from your friends.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-12 px-4 pt-4">
      <h2 className="font-serif text-2xl font-semibold text-[var(--label)] mb-4">
        For You
      </h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const media = rec.media_items;
          const senderName = rec.is_anonymous || !rec.sender ? 'Anonymous' : (rec.sender.name || rec.sender.handle || 'Someone');
          
          return (
            <motion.div 
              key={rec.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: index * 0.1 }}
              className="p-4 rounded-2xl bg-[var(--secondary-system-background)] border border-[var(--separator)] shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--system-background)] flex items-center justify-center shrink-0 overflow-hidden">
                    {!rec.is_anonymous && rec.sender?.avatar_url ? (
                      <img src={rec.sender.avatar_url} alt={senderName} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-[var(--secondary-label)]" />
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-[var(--label)]">
                      {senderName}
                    </p>
                    <p className="font-sans text-xs text-[var(--secondary-label)]">
                      {new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--system-background)] text-[var(--secondary-label)]">
                  {getIconForType(media?.media_type)}
                  <span className="text-xs font-medium capitalize">{media?.media_type}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-[var(--system-background)] border border-[var(--separator)] shadow-sm">
                  {media?.image_url ? (
                    <img src={media.image_url} alt={media.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getIconForType(media?.media_type)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-sans font-semibold text-base text-[var(--label)] line-clamp-2">
                    {media?.title || 'Unknown Title'}
                  </h3>
                  <p className="font-sans text-sm text-[var(--secondary-label)] line-clamp-1 mt-0.5">
                    {media?.subtitle}
                  </p>
                </div>
              </div>

              {rec.message && (
                <div className="mt-2 p-3 rounded-xl bg-[var(--system-background)] border border-[var(--separator)]">
                  <p className="font-sans text-sm text-[var(--label)] italic">
                    "{rec.message}"
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
