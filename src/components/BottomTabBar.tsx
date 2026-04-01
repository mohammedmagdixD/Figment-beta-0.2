import { motion } from 'motion/react';
import { User, Book } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface BottomTabBarProps {
  activeTab: 'profile' | 'diary';
  onTabChange: (tab: 'profile' | 'diary') => void;
}

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const handleTabChange = (tab: 'profile' | 'diary') => {
    if (activeTab !== tab) {
      haptics.light();
      onTabChange(tab);
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 sm:absolute z-40 bg-[var(--system-background)]/80 backdrop-blur-[20px] border-t border-[var(--separator)] pb-safe-bottom sm:pb-5"
    >
      <div className="flex items-center justify-around h-[60px] px-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          onClick={() => handleTabChange('profile')}
          className="relative flex flex-col items-center justify-center w-16 h-full gap-1"
        >
          <User 
            className={`w-6 h-6 transition-colors duration-300 ${
              activeTab === 'profile' ? 'text-ios-blue' : 'text-[var(--secondary-label)]'
            }`} 
          />
          <span 
            className={`text-xs font-medium transition-colors duration-300 ${
              activeTab === 'profile' ? 'text-ios-blue' : 'text-[var(--secondary-label)]'
            }`}
          >
            Profile
          </span>
          {activeTab === 'profile' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute -top-[1px] left-2 right-2 h-[2px] bg-ios-blue rounded-b-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
          onClick={() => handleTabChange('diary')}
          className="relative flex flex-col items-center justify-center w-16 h-full gap-1"
        >
          <Book 
            className={`w-6 h-6 transition-colors duration-300 ${
              activeTab === 'diary' ? 'text-ios-blue' : 'text-[var(--secondary-label)]'
            }`} 
          />
          <span 
            className={`text-xs font-medium transition-colors duration-300 ${
              activeTab === 'diary' ? 'text-ios-blue' : 'text-[var(--secondary-label)]'
            }`}
          >
            Diary
          </span>
          {activeTab === 'diary' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute -top-[1px] left-2 right-2 h-[2px] bg-ios-blue rounded-b-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}
