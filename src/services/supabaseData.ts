import { supabase } from './supabase';
import { UniversalMediaData } from '../types/universal';

export async function getUserProfile(userId: string) {
  try {
    const [userResponse, socialsResponse] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('user_socials').select('*').eq('user_id', userId)
    ]);

    if (userResponse.error) throw userResponse.error;
    if (socialsResponse.error) throw socialsResponse.error;

    return {
      ...userResponse.data,
      socials: socialsResponse.data || []
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function getUserShelves(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profile_sections')
      .select(`
        *,
        section_items (
          *,
          media_items (*)
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data.map((section: any) => {
      const items: UniversalMediaData[] = (section.section_items || [])
        .filter((si: any) => si.media_items)
        .map((si: any) => {
          const media = si.media_items;
          
          // Handle potential JSON fields if they are stored as strings or objects
          const header = media.header || { title: media.title || '', subtitle: media.subtitle || '' };
          const images = media.images || {
            backdropUrl: media.backdrop_url || media.backdropUrl || null,
            posterUrl: media.poster_url || media.posterUrl || '',
            backdropFallback: media.backdrop_fallback || media.backdropFallback || false,
          };
          
          return {
            id: media.id || String(si.id),
            mediaType: media.media_type || media.mediaType || 'unknown',
            images,
            header,
            tagline: media.tagline || undefined,
            stats: media.stats || [],
            metadata: media.metadata || [],
            description: media.description || '',
            userStats: {
              rating: si.rating || media.rating,
              dateAdded: si.created_at || si.createdAt || media.created_at || media.createdAt,
            },
            scrollableSections: media.scrollable_sections || media.scrollableSections || {},
            actionButton: media.action_button || media.actionButton || undefined,
            secondaryActionButton: media.secondary_action_button || media.secondaryActionButton || undefined,
            relatedLists: media.related_lists || media.relatedLists || undefined,
            streamingLinks: media.streaming_links || media.streamingLinks || undefined,
          } as UniversalMediaData;
        });

      return {
        ...section,
        items
      };
    });
  } catch (error) {
    console.error('Error fetching user shelves:', error);
    throw error;
  }
}

export async function getUserDiary(userId: string) {
  try {
    const { data, error } = await supabase
      .from('diary_entries')
      .select(`
        *,
        media_items (*)
      `)
      .eq('user_id', userId)
      .order('logged_date', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching user diary:', error);
    throw error;
  }
}

export async function getRecommendations(userId: string) {
  try {
    // Scaffold for future recommendations table
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist yet, just return empty array
      if (error.code === '42P01') return [];
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return []; // Return empty array as fallback for now
  }
}
