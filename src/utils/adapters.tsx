import React from 'react';
import { UniversalMediaData } from '../types/universal';
import { ThemeSongItem } from '../components/ThemeSongItem';
import { UniversalListItem } from '../components/UniversalListItem';
import { motion } from 'motion/react';
import { haptics } from '../utils/haptics';
import { Search } from 'lucide-react';
import { fetchWithBackoff, getHighResBookCover } from '../services/api';

function baseMalAdapter(data: any, type: 'anime' | 'manga'): UniversalMediaData {
  const isAnime = type === 'anime';
  return {
    id: data.id.toString(),
    mediaType: type,
    images: {
      backdropUrl: data.backdrop_url || data.large_image_url || data.image_url,
      posterUrl: data.image_url,
      backdropFallback: data.backdrop_fallback
    },
    header: {
      title: data.title_english || data.title,
      subtitle: isAnime 
        ? (data.studios?.map((s: any) => s.name).join(', ') || 'Unknown Studio')
        : (data.authors?.map((a: any) => a.name).join(', ') || 'Unknown Author')
    },
    stats: [
      { label: 'MAL Score', value: data.score },
      { label: 'Rank', value: data.rank ? `#${data.rank}` : null },
      { label: 'Popularity', value: data.popularity ? `#${data.popularity}` : null }
    ].filter(s => s.value !== null),
    metadata: [
      isAnime ? { label: 'Year', value: data.season ? `${data.season.charAt(0).toUpperCase() + data.season.slice(1)} ${data.year || ''}` : data.year } : { label: 'Published', value: data.published?.string },
      isAnime ? { label: 'Episodes', value: data.episodes ? `${data.episodes} Episodes` : 'Ongoing' } : { label: 'Chapters', value: data.chapters ? `${data.chapters} Chapters` : (data.volumes ? `${data.volumes} Volumes` : 'Ongoing') },
      { label: 'Status', value: data.status }
    ].filter(m => m.value != null),
    description: data.synopsis,
    actionButton: isAnime && data.trailer_url ? {
      type: 'trailer',
      payload: data.trailer_url
    } : undefined,
    scrollableSections: {
      genres: [...(data.genres || []), ...(data.themes || [])].map((g: any) => g.name || g),
      cast: data.characters?.map((c: any) => ({
        name: c.name,
        role: c.role,
        imageUrl: c.image_url
      })) || [],
      extras: isAnime ? [
        ...(data.theme_openings && data.theme_openings.length > 0 ? [{
          type: 'theme_songs',
          title: 'Openings',
          data: data.theme_openings.map((op: string, i: number) => <ThemeSongItem key={`op-${i}`} themeString={op} />)
        }] : []),
        ...(data.theme_endings && data.theme_endings.length > 0 ? [{
          type: 'theme_songs',
          title: 'Endings',
          data: data.theme_endings.map((ed: string, i: number) => <ThemeSongItem key={`ed-${i}`} themeString={ed} />)
        }] : []),
        ...(data.source ? [{
          type: 'source',
          title: 'Source Material',
          data: <p className="font-sans text-sm text-[var(--secondary-label)]">Adapted from {data.source}</p>
        }] : [])
      ] : []
    }
  };
}

export function malAnimeAdapter(data: any): UniversalMediaData {
  const baseData = baseMalAdapter(data, 'anime');
  
  const relatedLists: Array<{ listTitle: string; items: UniversalMediaData[] }> = [];

  if (data.related_anime && data.related_anime.length > 0) {
    relatedLists.push({
      listTitle: 'Related Anime',
      items: data.related_anime.map((item: any) => ({
        id: item.node.id.toString(),
        mediaType: 'anime',
        images: {
          backdropUrl: item.node.main_picture?.large || item.node.main_picture?.medium || null,
          posterUrl: item.node.main_picture?.large || item.node.main_picture?.medium || '',
          backdropFallback: true
        },
        header: {
          title: item.node.title,
          subtitle: item.relation_type_formatted || 'Related'
        },
        stats: [],
        metadata: [],
        description: '',
        scrollableSections: { genres: [], cast: [], extras: [] }
      }))
    });
  }

  if (data.recommendations && data.recommendations.length > 0) {
    relatedLists.push({
      listTitle: 'Recommendations',
      items: data.recommendations.map((item: any) => ({
        id: item.node.id.toString(),
        mediaType: 'anime',
        images: {
          backdropUrl: item.node.main_picture?.large || item.node.main_picture?.medium || null,
          posterUrl: item.node.main_picture?.large || item.node.main_picture?.medium || '',
          backdropFallback: true
        },
        header: {
          title: item.node.title,
          subtitle: item.num_recommendations ? `${item.num_recommendations} Recommendations` : 'Recommended'
        },
        stats: [],
        metadata: [],
        description: '',
        scrollableSections: { genres: [], cast: [], extras: [] }
      }))
    });
  }

  if (relatedLists.length > 0) {
    baseData.relatedLists = relatedLists;
  }

  return baseData;
}

export function malMangaAdapter(data: any): UniversalMediaData {
  return baseMalAdapter(data, 'manga');
}

function baseTmdbAdapter(data: any, item: any, type: 'movie' | 'tv'): UniversalMediaData {
  const isMovie = type === 'movie';
  const startYear = isMovie ? data.release_date?.split('-')[0] : data.first_air_date?.split('-')[0];
  
  let yearDisplay = startYear;
  if (!isMovie && startYear) {
    const endYear = data.last_air_date?.split('-')[0];
    const isEnded = data.status === 'Ended' || data.status === 'Canceled';
    if (isEnded) {
      if (endYear && startYear !== endYear) {
        yearDisplay = `${startYear}–${endYear}`;
      } else {
        yearDisplay = startYear;
      }
    } else {
      yearDisplay = `${startYear}–Present`;
    }
  }

  return {
    id: data.id.toString(),
    mediaType: type,
    images: {
      backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : item.image,
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : item.image,
      backdropFallback: !data.backdrop_path
    },
    header: {
      title: data.title || data.name,
      subtitle: isMovie ? (data.director || 'Unknown Director') : (data.director || 'Unknown Creator')
    },
    tagline: data.tagline,
    stats: [
      { label: 'TMDB', value: data.vote_average ? data.vote_average.toFixed(1) : null },
    ].filter(s => s.value !== null),
    metadata: [
      { label: 'Year', value: yearDisplay },
      isMovie 
        ? { label: 'Runtime', value: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : null }
        : { label: 'Seasons', value: data.number_of_seasons ? `${data.number_of_seasons} Season${data.number_of_seasons > 1 ? 's' : ''}` : null },
      { label: 'MPA', value: data.contentRating !== 'NR' ? data.contentRating : null },
      !isMovie ? { label: 'Status', value: (data.status === 'Ended' || data.status === 'Canceled') ? 'Finished' : 'Ongoing' } : null
    ].filter(m => m != null && m.value != null),
    description: data.overview,
    actionButton: data.trailerUrl ? {
      type: 'trailer',
      payload: data.trailerUrl
    } : undefined,
    scrollableSections: {
      genres: data.genres?.map((g: any) => g.name) || [],
      cast: data.cast?.map((c: any) => ({
        name: c.name,
        role: c.character,
        imageUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
      })) || [],
      watchProviders: data.watchProviders || [],
      extras: !isMovie && data.seasons && data.seasons.length > 0 ? [{
        type: 'seasons',
        title: 'Seasons',
        data: data.seasons.filter((s: any) => s.season_number > 0).map((season: any) => (
          <UniversalListItem 
            key={season.id}
            title={season.name}
            subtitle={`${season.air_date?.split('-')[0]} • ${season.episode_count} Episodes`}
            imageUrl={season.poster_path ? `https://image.tmdb.org/t/p/w185${season.poster_path}` : null}
            icon="tv"
            imageStyle="vertical"
            rightContent={
              <motion.button 
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 600, damping: 35 }}
                onClick={(e) => {
                  e.stopPropagation();
                  haptics.light();
                }}
                className="shrink-0 text-xs font-medium bg-[var(--system-background)] border border-[var(--separator)] px-3 py-1.5 rounded-full hover:bg-[var(--tertiary-system-background)] text-[var(--label)] transition-colors"
              >
                Rate
              </motion.button>
            }
          />
        ))
      }] : []
    }
  };
}

export function tmdbMovieAdapter(data: any, item: any): UniversalMediaData {
  return baseTmdbAdapter(data, item, 'movie');
}

export function tmdbTvAdapter(data: any, item: any): UniversalMediaData {
  return baseTmdbAdapter(data, item, 'tv');
}

export function itunesPodcastAdapter(
  episodes: any[], 
  item: any, 
  onLogEpisode: (ep: any) => void,
  searchQuery: string,
  setSearchQuery: (query: string) => void
): UniversalMediaData {
  const filteredEpisodes = episodes.filter(ep => 
    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ep.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    id: item.id.toString(),
    mediaType: 'podcast',
    images: {
      backdropUrl: item.image,
      posterUrl: item.image,
      backdropFallback: true
    },
    header: {
      title: item.title,
      subtitle: item.subtitle
    },
    stats: [],
    metadata: [
      { label: 'Format', value: 'Podcast' }
    ],
    description: item.description,
    scrollableSections: {
      extras: [
        ...(episodes && episodes.length > 0 ? [{
          type: 'episodes',
          title: 'Episodes',
          data: [
            <div key="search-bar" className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-label)]" />
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--secondary-system-background)] border border-[var(--separator)] rounded-xl py-2 pl-9 pr-3 text-sm font-sans text-[var(--label)] placeholder:text-[var(--secondary-label)] focus:outline-none focus:ring-2 focus:ring-[var(--label)]/10 transition-all"
              />
            </div>,
            ...filteredEpisodes.map((ep: any) => (
              <UniversalListItem 
                key={ep.id}
                title={ep.title}
                subtitle={new Date(ep.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                imageUrl={item.image}
                icon="music"
                imageStyle="square"
                onClick={() => onLogEpisode(ep)}
                rightContent={
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 600, damping: 35 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      haptics.light();
                      onLogEpisode(ep);
                    }}
                    className="shrink-0 text-xs font-medium bg-[var(--system-background)] border border-[var(--separator)] px-3 py-1.5 rounded-full hover:bg-[var(--tertiary-system-background)] text-[var(--label)] transition-colors"
                  >
                    Rate
                  </motion.button>
                }
              />
            ))
          ]
        }] : [])
      ]
    }
  };
}

export function googleBooksAdapter(data: any, type: string = 'book'): UniversalMediaData {
  const info = data.volumeInfo || {};
  const access = data.accessInfo || {};
  
  // Image handling
  const imageUrl = getHighResBookCover(info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail);

  // Description handling: strip HTML tags
  const rawDescription = info.description || '';
  const cleanDescription = rawDescription.replace(/<[^>]*>?/gm, '');

  const stats = [];
  if (info.averageRating) {
    stats.push({ label: 'Rating', value: info.averageRating.toString() });
  }
  if (info.pageCount) {
    stats.push({ label: 'Pages', value: `${info.pageCount} Pages` });
  }
  if (info.publishedDate) {
    stats.push({ label: 'Published', value: info.publishedDate.substring(0, 4) });
  }

  const limitedCategories = info.categories ? info.categories.slice(0, 3) : [];
  const limitedAuthors = info.authors ? info.authors.slice(0, 2) : [];

  const metadata = [];
  if (info.publisher) {
    metadata.push({ label: 'Publisher', value: info.publisher });
  }
  if (limitedCategories.length > 0) {
    metadata.push({ label: 'Categories', value: limitedCategories.join(', ') });
  }
  metadata.push({ label: 'Format', value: type === 'webnovel' ? 'Webnovel' : 'Book' });

  const extras = [];
  if (info.industryIdentifiers) {
    info.industryIdentifiers.forEach((id: any) => {
      extras.push({ label: id.type.replace('_', ' '), value: id.identifier });
    });
  }
  if (info.language) {
    extras.push({ label: 'Language', value: info.language.toUpperCase() });
  }

  let actionButton;
  if (info.previewLink || access.webReaderLink) {
    actionButton = {
      type: 'read' as const,
      payload: info.previewLink || access.webReaderLink,
      label: 'Read Sample'
    };
  }

  const fetchRelatedLists = async () => {
    const relatedLists: { listTitle: string; items: UniversalMediaData[] }[] = [];
    
    try {
      if (info.authors && info.authors.length > 0) {
        const author = info.authors[0];
        let items: UniversalMediaData[] = [];
        try {
          const authorRes = await fetchWithBackoff(`/api/books/volumes?q=inauthor:"${encodeURIComponent(author)}"&printType=books&maxResults=30`, undefined, 0);
          if (!authorRes.ok) throw new Error('Google Books API failed');
          const authorData = await authorRes.json();
          if (authorData.items) {
            let authorItems = authorData.items.filter((item: any) => item.id !== data.id);
            
            // Sort to push items without covers or descriptions to the bottom
            authorItems.sort((a: any, b: any) => {
              const aHasCover = !!a.volumeInfo.imageLinks?.thumbnail;
              const bHasCover = !!b.volumeInfo.imageLinks?.thumbnail;
              if (aHasCover && !bHasCover) return -1;
              if (!aHasCover && bHasCover) return 1;
              
              const aHasDesc = !!a.volumeInfo.description;
              const bHasDesc = !!b.volumeInfo.description;
              if (aHasDesc && !bHasDesc) return -1;
              if (!aHasDesc && bHasDesc) return 1;

              return 0;
            });

            items = authorItems
              .slice(0, 10)
              .map((item: any) => {
                const mapped = googleBooksAdapter(item, 'book');
                delete mapped.fetchRelatedLists;
                return mapped;
              });
          }
        } catch (e) {
          console.warn('Falling back to OpenLibrary for related author books');
          const olRes = await fetchWithBackoff(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=10`);
          if (olRes.ok) {
            const olData = await olRes.json();
            items = (olData.docs || [])
              .filter((item: any) => item.key.replace('/works/', '') !== data.id)
              .map((item: any) => {
                const mapped = googleBooksAdapter({
                  id: item.key.replace('/works/', ''),
                  volumeInfo: {
                    title: item.title,
                    authors: item.author_name,
                    imageLinks: {
                      thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null
                    }
                  }
                }, 'book');
                delete mapped.fetchRelatedLists;
                return mapped;
              });
          }
        }
        if (items.length > 0) {
          relatedLists.push({ listTitle: `More by ${author}`, items });
        }
      }
    } catch (e) {
      console.error('Failed to fetch related author books', e);
    }

    try {
      if (info.categories && info.categories.length > 0) {
        const category = info.categories[0];
        let items: UniversalMediaData[] = [];
        try {
          const categoryRes = await fetchWithBackoff(`/api/books/volumes?q=subject:"${encodeURIComponent(category)}"&printType=books&maxResults=30`, undefined, 0);
          if (!categoryRes.ok) throw new Error('Google Books API failed');
          const categoryData = await categoryRes.json();
          if (categoryData.items) {
            let categoryItems = categoryData.items.filter((item: any) => item.id !== data.id);
            
            // Sort to push items without covers or descriptions to the bottom
            categoryItems.sort((a: any, b: any) => {
              const aHasCover = !!a.volumeInfo.imageLinks?.thumbnail;
              const bHasCover = !!b.volumeInfo.imageLinks?.thumbnail;
              if (aHasCover && !bHasCover) return -1;
              if (!aHasCover && bHasCover) return 1;
              
              const aHasDesc = !!a.volumeInfo.description;
              const bHasDesc = !!b.volumeInfo.description;
              if (aHasDesc && !bHasDesc) return -1;
              if (!aHasDesc && bHasDesc) return 1;

              return 0;
            });

            items = categoryItems
              .slice(0, 10)
              .map((item: any) => {
                const mapped = googleBooksAdapter(item, 'book');
                delete mapped.fetchRelatedLists;
                return mapped;
              });
          }
        } catch (e) {
          console.warn('Falling back to OpenLibrary for similar books');
          const olRes = await fetchWithBackoff(`https://openlibrary.org/search.json?subject=${encodeURIComponent(category)}&limit=10`);
          if (olRes.ok) {
            const olData = await olRes.json();
            items = (olData.docs || [])
              .filter((item: any) => item.key.replace('/works/', '') !== data.id)
              .map((item: any) => {
                const mapped = googleBooksAdapter({
                  id: item.key.replace('/works/', ''),
                  volumeInfo: {
                    title: item.title,
                    authors: item.author_name,
                    imageLinks: {
                      thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null
                    }
                  }
                }, 'book');
                delete mapped.fetchRelatedLists;
                return mapped;
              });
          }
        }
        if (items.length > 0) {
          relatedLists.push({ listTitle: 'Similar Books', items });
        }
      }
    } catch (e) {
      console.error('Failed to fetch similar books', e);
    }

    return relatedLists;
  };

  return {
    id: data.id.toString(),
    mediaType: type as any,
    images: {
      backdropUrl: imageUrl,
      posterUrl: imageUrl,
      backdropFallback: true
    },
    header: {
      title: info.title || 'Unknown Title',
      subtitle: limitedAuthors.length > 0 ? limitedAuthors.join(', ') : 'Unknown Author'
    },
    stats,
    metadata,
    description: cleanDescription,
    actionButton,
    scrollableSections: {
      genres: limitedCategories,
      extras
    },
    fetchRelatedLists
  };
}

function mapItunesTrack(trackDetails: any, item: any, backdropUrl: string | null, backdropFallback: boolean, actionButton: any): UniversalMediaData {
  const duration = trackDetails?.trackTimeMillis 
    ? `${Math.floor(trackDetails.trackTimeMillis / 60000)}:${Math.floor((trackDetails.trackTimeMillis % 60000) / 1000).toString().padStart(2, '0')}` 
    : null;

  const releaseDate = trackDetails?.releaseDate 
    ? new Date(trackDetails.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const price = trackDetails?.trackPrice && trackDetails.trackPrice > 0
    ? `${trackDetails.currency === 'USD' ? '$' : trackDetails.currency + ' '}${trackDetails.trackPrice}`
    : null;

  return {
    id: trackDetails?.trackId?.toString() || item.id?.toString() || '',
    mediaType: item.type || 'song',
    images: {
      backdropUrl,
      posterUrl: trackDetails?.artworkUrl100?.replace('100x100bb', '600x600bb') || item.image || '',
      backdropFallback
    },
    header: {
      title: trackDetails?.trackName || item.title || '',
      subtitle: [trackDetails?.artistName || item.subtitle, trackDetails?.collectionName].filter(Boolean).join(' • ') || ''
    },
    stats: [
      trackDetails?.trackNumber && trackDetails?.trackCount ? { label: 'Track Placement', value: `Track ${trackDetails.trackNumber} of ${trackDetails.trackCount}` } : null,
      trackDetails?.trackExplicitness === 'explicit' ? { label: 'Explicitness', value: 'Explicit' } : null,
      price ? { label: 'Price', value: price } : null
    ].filter((s): s is {label: string; value: string} => s !== null),
    metadata: [
      releaseDate ? { label: 'Released', value: releaseDate } : (trackDetails?.releaseDate ? { label: 'Release Year', value: new Date(trackDetails.releaseDate).getFullYear().toString() } : null),
      trackDetails?.primaryGenreName ? { label: 'Genre', value: trackDetails.primaryGenreName } : null,
      duration ? { label: 'Duration', value: duration } : null
    ].filter((m): m is {label: string; value: string} => m != null),
    description: '',
    actionButton: actionButton,
    secondaryActionButton: (trackDetails?.previewUrl || item.previewUrl) ? {
      type: 'audio',
      payload: trackDetails?.previewUrl || item.previewUrl
    } : undefined,
    scrollableSections: {
      extras: [
        ...(trackDetails?.country || trackDetails?.copyright ? [{
          type: 'copyright',
          title: '',
          data: (
            <div className="text-xs text-[var(--tertiary-label)] text-center mt-4 space-y-1">
              {trackDetails?.country && <p>Country of Origin: {trackDetails.country}</p>}
              {trackDetails?.copyright && <p>{trackDetails.copyright}</p>}
            </div>
          )
        }] : [])
      ]
    }
  };
}

export async function itunesAudioAdapter(item: any): Promise<UniversalMediaData> {
  let backdropUrl: string | null = null;
  let backdropFallback = false;
  let actionButton: any = undefined;
  let streamingLinks: any = null;

  const artistName = item.subtitle || item.header?.subtitle || '';

  const isSpotify = item.url?.includes('spotify.com');
  const platform = isSpotify ? 'spotify' : 'itunes';

  // Step 1: Fetch Odesli Links
  let videoId: string | null = null;
  try {
    const odesliType = item.type === 'album' ? 'album' : 'song';
    const odesliUrl = isSpotify && item.url
      ? `/api/odesli?url=${encodeURIComponent(item.url)}`
      : `/api/odesli?platform=${platform}&type=${odesliType}&id=${item.id}`;
    console.log('Fetching Odesli:', odesliUrl);
    const res = await fetchWithBackoff(odesliUrl);
    if (res.ok) {
      const data = await res.json();
      console.log('Odesli data:', data);
      if (data && data.linksByPlatform) {
        streamingLinks = data.linksByPlatform;
        console.log('Streaming links set:', streamingLinks);
        
        // Extract YouTube video ID from Odesli links
        const ytEntity = streamingLinks.youtube || streamingLinks.youtubeMusic;
        if (ytEntity && ytEntity.entityUniqueId) {
          const entityData = data.entitiesByUniqueId?.[ytEntity.entityUniqueId];
          if (entityData && entityData.thumbnailUrl) {
            backdropUrl = entityData.thumbnailUrl;
          }
          
          const parts = ytEntity.entityUniqueId.split('::');
          if (parts.length > 1 && parts[1].length === 11) {
            videoId = parts[1];
          }
        }
        
        // Fallback to URL regex if entityUniqueId is missing or didn't work
        if (!videoId) {
          const ytLink = streamingLinks.youtube?.url || streamingLinks.youtubeMusic?.url;
          if (ytLink) {
            const match = ytLink.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
            if (match && match[1]) {
              videoId = match[1];
            }
          }
        }
      }
    } else {
      console.error('Odesli fetch failed with status:', res.status);
    }
  } catch (e) {
    console.debug('Odesli API failed in adapter', e);
  }

  if (videoId) {
    if (!backdropUrl) {
      backdropUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    actionButton = {
      type: 'trailer',
      payload: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  // Step 2: TheAudioDB (Fallback 1)
  if (!backdropUrl) {
    try {
      const adbRes = await fetchWithBackoff(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`);
      if (adbRes.ok) {
        const adbData = await adbRes.json();
        if (adbData.artists && adbData.artists.length > 0 && adbData.artists[0].strArtistFanart) {
          backdropUrl = adbData.artists[0].strArtistFanart;
        }
      }
    } catch (e) {
      console.warn('TheAudioDB API failed', e);
    }
  }

  // Step 3: iTunes square album art (Fallback 2)
  if (!backdropUrl) {
    const imageUrl = item.image || item.images?.posterUrl;
    backdropUrl = imageUrl?.replace('100x100bb', '600x600bb') || imageUrl;
    backdropFallback = true;
  }

  let trackDetails: any = null;
  try {
    const itunesRes = await fetchWithBackoff(`https://itunes.apple.com/lookup?id=${item.id}`);
    if (itunesRes.ok) {
      const itunesData = await itunesRes.json();
      if (itunesData.results && itunesData.results.length > 0) {
        trackDetails = itunesData.results[0];
      }
    }
  } catch (e) {
    console.error('iTunes lookup failed', e);
  }

  const mappedData = mapItunesTrack(trackDetails, item, backdropUrl, backdropFallback, actionButton);
  mappedData.streamingLinks = streamingLinks;

  mappedData.fetchRelatedLists = async () => {
    const relatedLists: { listTitle: string; items: UniversalMediaData[] }[] = [];
    
    if (trackDetails?.collectionId) {
      try {
        const albumRes = await fetchWithBackoff(`https://itunes.apple.com/lookup?id=${trackDetails.collectionId}&entity=song`);
        if (albumRes.ok) {
          const albumData = await albumRes.json();
          const albumTracks = albumData.results.filter((res: any) => res.wrapperType === 'track' && res.trackId !== trackDetails.trackId);
          
          if (albumTracks.length > 0) {
            relatedLists.push({
              listTitle: "More from this Album",
              items: albumTracks.map((track: any) => mapItunesTrack(track, { type: 'song' }, null, true, undefined))
            });
          }
        }
      } catch (e) {
        console.error('iTunes album lookup failed', e);
      }
    }

    if (trackDetails?.artistId) {
      try {
        const artistRes = await fetchWithBackoff(`https://itunes.apple.com/lookup?id=${trackDetails.artistId}&entity=song&limit=11`);
        if (artistRes.ok) {
          const artistData = await artistRes.json();
          const artistTracks = artistData.results.filter((res: any) => res.wrapperType === 'track' && res.trackId !== trackDetails.trackId).slice(0, 10);
          
          if (artistTracks.length > 0) {
            relatedLists.push({
              listTitle: "More from this Artist",
              items: artistTracks.map((track: any) => mapItunesTrack(track, { type: 'song' }, null, true, undefined))
            });
          }
        }
      } catch (e) {
        console.error('iTunes artist lookup failed', e);
      }
    }

    return relatedLists;
  };

  return mappedData;
}

export function genericAdapter(item: any): UniversalMediaData {
  return {
    id: item.id.toString(),
    mediaType: item.type,
    images: {
      backdropUrl: item.image,
      posterUrl: item.image,
      backdropFallback: true
    },
    header: {
      title: item.title,
      subtitle: item.subtitle
    },
    stats: [],
    metadata: [
      { label: 'Format', value: item.type.charAt(0).toUpperCase() + item.type.slice(1) }
    ],
    description: item.description,
    actionButton: item.url ? {
      type: 'link',
      payload: item.url
    } : undefined,
    scrollableSections: {
      extras: []
    }
  };
}
