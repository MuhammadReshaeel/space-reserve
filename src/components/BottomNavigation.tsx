import React from 'react';

interface BottomNavigationProps {
  currentTab: 'home' | 'book-room' | 'calendar' | 'settings';
  onTabChange: (tab: 'home' | 'book-room' | 'calendar' | 'settings') => void;
  onSettingsClick?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentTab, 
  onTabChange, 
  onSettingsClick 
}) => {
  const handleTabClick = (tab: 'home' | 'book-room' | 'calendar' | 'settings') => {
    if (tab === 'settings' && onSettingsClick) {
      onSettingsClick();
    } else {
      onTabChange(tab);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex justify-around items-center py-2">
        <button 
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 transition-colors ${
            currentTab === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button 
          onClick={() => handleTabClick('book-room')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 transition-colors ${
            currentTab === 'book-room' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-xs font-medium">Book Room</span>
        </button>
        
        <button 
          onClick={() => handleTabClick('calendar')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 transition-colors ${
            currentTab === 'calendar' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium">Calendar</span>
        </button>
        
        <button 
          onClick={() => handleTabClick('settings')}
          className={`flex flex-col items-center space-y-1 py-2 px-3 transition-colors ${
            currentTab === 'settings' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation; 