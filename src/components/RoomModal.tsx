import React from 'react';
import { Room } from '../types/Room';

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ room, onClose }) => {
  if (!room) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'office':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'forecast':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hoteling':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vacant':
        return 'bg-gray-100 text-gray-800 border-green-400';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-labelledby="room-modal-title"
      aria-describedby="room-modal-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 id="room-modal-title" className="text-xl font-bold text-gray-900">
            {room.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close modal"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClose()}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div id="room-modal-description" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Room ID:</span>
            <span className="font-mono text-sm">{room.id}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(room.status)}`}
            >
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dimensions:</span>
            <span className="text-sm">{room.width} × {room.height}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Position:</span>
            <span className="text-sm">({room.x}, {room.y})</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            tabIndex={0}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal; 