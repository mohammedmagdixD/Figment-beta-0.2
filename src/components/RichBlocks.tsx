import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ExternalLink, AlignLeft, LayoutGrid } from 'lucide-react';
import { haptics } from '../utils/haptics';
import { useScrollLock } from '../hooks/useScrollLock';

interface RichBlocksProps {
  blocks: any[];
}

export function RichBlocks({ blocks }: RichBlocksProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useScrollLock(!!selectedImage);

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'image':
        return (
          <motion.div 
            whileHover={{ scale: window.matchMedia('(hover: hover)').matches ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            className="relative rounded-2xl overflow-hidden bg-[var(--secondary-system-background)] border border-[var(--separator)] shadow-sm group cursor-pointer transition-transform"
            onClick={() => {
              haptics.light();
              setSelectedImage(block.image);
            }}
          >
            <img 
              src={block.image} 
              alt={block.title} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] rounded-2xl pointer-events-none z-10" />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-white/30 backdrop-blur-md p-2 rounded-full text-white">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        );
      
      case 'text':
        return (
          <div className="bg-[var(--secondary-system-background)] p-5 rounded-2xl border border-[var(--separator)] shadow-sm flex flex-col justify-center min-h-[160px] group transition-colors cursor-default">
            <AlignLeft className="w-4 h-4 text-[var(--secondary-label)] mb-3 opacity-50" />
            <p className="font-serif text-base leading-relaxed text-[var(--label)] whitespace-pre-wrap">
              {block.content}
            </p>
          </div>
        );
      
      case 'link':
        return (
          <motion.a 
            href={block.url} 
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: window.matchMedia('(hover: hover)').matches ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            onClick={() => haptics.light()}
            className="block bg-[var(--system-background)] p-4 rounded-2xl border border-[var(--separator)] shadow-sm group hover:shadow-md transition-all flex flex-col h-full"
          >
            {block.thumbnail ? (
              <div className="w-full h-24 mb-3 rounded-xl overflow-hidden bg-[var(--secondary-system-background)] shrink-0 border border-[var(--separator)]">
                <img 
                  src={block.thumbnail} 
                  alt={block.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            ) : (
              <div className="w-full h-24 mb-3 rounded-xl bg-[var(--secondary-system-background)] flex items-center justify-center shrink-0 transition-colors border border-[var(--separator)]">
                <ExternalLink className="w-6 h-6 text-[var(--secondary-label)]" />
              </div>
            )}
            <h3 className="font-serif font-semibold text-base leading-snug text-[var(--label)] mb-1 line-clamp-2">
              {block.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-[var(--secondary-label)] line-clamp-2 mb-4">
              {block.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--separator)]">
              <div className="flex items-center gap-2 overflow-hidden">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${block.domain}&sz=32`} 
                  alt=""
                  className="w-4 h-4 rounded-sm shrink-0 bg-[var(--secondary-system-background)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="font-mono text-xs text-[var(--secondary-label)] truncate">{block.domain}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--secondary-label)] shrink-0 group-hover:text-[var(--label)] transition-colors" />
            </div>
          </motion.a>
        );
      
      case 'channel':
        return (
          <motion.div 
            whileHover={{ scale: window.matchMedia('(hover: hover)').matches ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 600, damping: 35 }}
            onClick={() => haptics.light()}
            className="bg-light/50 dark:bg-[#2C2C2E]/50 p-5 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/20 flex flex-col items-center justify-center text-center min-h-[160px] group hover:bg-light dark:hover:bg-[#2C2C2E] hover:border-black/20 dark:hover:border-white/30 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1C1C1E] shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-5 h-5 text-ink-black dark:text-white" />
            </div>
            <h3 className="font-serif font-semibold text-base text-ink-black dark:text-white mb-1">
              {block.title}
            </h3>
            <span className="font-mono text-xs text-gray dark:text-ios-gray-1">{block.count} blocks</span>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section className="px-4 py-2">
      <h2 className="font-serif text-xl font-semibold leading-relaxed text-ink-black dark:text-white mb-4">
        Canvas
      </h2>
      
      {/* Masonry-ish grid using CSS columns */}
      <div className="columns-2 gap-3 space-y-3">
        {blocks.map((block, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: (index % 4) * 0.1, type: "spring", stiffness: 400, damping: 30 }}
            key={block.id}
            className="break-inside-avoid"
          >
            {renderBlock(block)}
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal for Images */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => {
              haptics.light();
              setSelectedImage(null);
            }}
            onTouchMove={(e) => e.preventDefault()}
            onWheel={(e) => e.preventDefault()}
          >
            <motion.button 
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors z-50"
              onClick={(e) => {
                e.stopPropagation();
                haptics.light();
                setSelectedImage(null);
              }}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={selectedImage}
              alt="Selected gallery image"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
