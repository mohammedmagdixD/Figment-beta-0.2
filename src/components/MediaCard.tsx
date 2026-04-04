import { motion } from 'motion/react';
import { Play, Pause, ListPlus } from 'lucide-react';
import { UniversalMediaData } from '../types/universal';

interface MediaCardProps {
  item: any;
  sectionType: string;
  index: number;
  playingId: string | null;
  onItemClick: (item: any) => void;
  onPlayToggle: (url: string, id: string) => void;
  onAddToAlbum?: (item: any) => void;
}

export function MediaCard({
  item,
  sectionType,
  index,
  playingId,
  onItemClick,
  onPlayToggle,
  onAddToAlbum
}: MediaCardProps) {
  const getAspectRatioClass = (type: string) => {
    switch (type) {
      case 'movies':
      case 'tv':
        return 'aspect-[2/3] w-[140px]';
      case 'books':
        return 'aspect-[2/3] w-[140px]';
      case 'music':
      case 'song':
        return 'aspect-square w-[140px]';
      case 'podcasts':
        return 'aspect-square w-[140px]';
      case 'games':
        return 'aspect-[3/4] w-[140px]';
      default:
        return 'aspect-[2/3] w-[140px]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`snap-start card-container flex flex-col gap-2 group cursor-pointer ${getAspectRatioClass(sectionType)}`}
      onClick={() => onItemClick(item)}
    >
      <div className={`relative overflow-hidden rounded-xl bg-[var(--secondary-system-background)] shadow-sm border border-[var(--separator)] card-image ${(sectionType === 'music' || sectionType === 'song') ? 'rounded-full scale-95' : ''}`}>
        {(sectionType === 'music' || sectionType === 'song') && (
          <div className="absolute inset-0 rounded-full border-[12px] border-ink-black/90 dark:border-white/10 pointer-events-none z-10 shadow-inner" />
        )}
        <img 
          src={(item.image || item.images?.posterUrl) || undefined} 
          alt={item.title || item.header?.title}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${(sectionType === 'music' || sectionType === 'song') ? 'rounded-full' : ''}`}
          referrerPolicy="no-referrer"
        />
        {/* Subtle inner shadow for depth */}
        <div className={`absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] pointer-events-none ${(sectionType === 'music' || sectionType === 'song') ? 'rounded-full' : 'rounded-xl'}`} />
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-300 ${(sectionType === 'music' || sectionType === 'song') ? 'rounded-full' : ''}`} />
        {(item.previewUrl || (item.secondaryActionButton?.type === 'audio' && item.secondaryActionButton?.payload)) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = item.previewUrl || item.secondaryActionButton?.payload;
              if (url) onPlayToggle(url, item.id?.toString());
            }}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
          >
            {playingId === item.id?.toString() ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
        )}
        {(sectionType === 'music' || sectionType === 'song') && onAddToAlbum && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToAlbum(item);
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20 opacity-0 group-hover:opacity-100"
          >
            <ListPlus className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className={`w-full ${(sectionType === 'music' || sectionType === 'song') ? 'text-center px-1' : ''}`}>
        <h3 className="font-sans text-base font-semibold leading-tight text-[var(--label)] card-text-truncate">
          {item.title || item.header?.title}
        </h3>
        <p className="font-sans text-sm font-medium leading-relaxed text-[var(--secondary-label)] card-text-truncate mt-0.5">
          {item.subtitle || item.header?.subtitle}
        </p>
      </div>
    </motion.div>
  );
}
