import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { getRecommendations } from '../services/supabaseData';
import { useAuth } from '../contexts/AuthContext';

export function RecommendationsView() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!user) return;
      try {
        setIsLoading(true);
        const data = await getRecommendations(user.id);
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [user]);

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
          Add more items to your shelves and diary to get personalized recommendations.
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
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 rounded-xl bg-[var(--secondary-system-background)]">
            {/* Placeholder for recommendation item */}
            <p className="text-[var(--label)]">{rec.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
