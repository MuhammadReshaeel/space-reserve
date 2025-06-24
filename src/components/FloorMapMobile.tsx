import React, { useState, useEffect, useRef, useCallback } from 'react';
import BottomNavigation from './BottomNavigation';

interface Room {
  id: string;
  name: string;
  status: 'available' | 'reserved' | 'vacant' | 'pending';
  capacity?: number;
  equipment?: string[];
  description?: string;
}

interface FloorMapMobileProps {
  onRoomSelect: (roomId: string, roomName: string) => void;
  onBack: () => void;
  svgFileName?: string;
  currentTab?: 'home' | 'book-room' | 'calendar' | 'settings';
  onTabChange?: (tab: 'home' | 'book-room' | 'calendar' | 'settings') => void;
  onSettingsClick?: () => void;
}

// Mobile Room Modal Component
const MobileRoomModal: React.FC<{ room: Room | null; onClose: () => void; onReserve: (roomId: string, roomName: string) => void }> = ({ 
  room, 
  onClose, 
  onReserve 
}) => {
  if (!room) return null;

  const handleReserve = () => {
    onReserve(room.id, room.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md mx-4 mb-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              room.status === 'available' ? 'bg-green-500' :
              room.status === 'reserved' ? 'bg-red-500' :
              room.status === 'vacant' ? 'bg-blue-500' :
              'bg-orange-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-700 capitalize">{room.status}</span>
          </div>

          {/* Details */}
          {room.capacity && (
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              <span className="text-sm text-gray-600">Capacity: {room.capacity} people</span>
            </div>
          )}

          {room.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
              <p className="text-sm text-gray-600">{room.description}</p>
            </div>
          )}

          {room.equipment && room.equipment.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {room.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200">
          {room.status === 'available' ? (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Reserve
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const FloorMapMobile: React.FC<FloorMapMobileProps> = ({ 
  onRoomSelect, 
  onBack, 
  svgFileName = 'OR045101S.svg',
  currentTab = 'book-room',
  onTabChange,
  onSettingsClick
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [svgError, setSvgError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const panZoomInstanceRef = useRef<any>(null);
  const isInitializingRef = useRef<boolean>(false);

  // Load svg-pan-zoom library dynamically
  useEffect(() => {
    const loadSvgPanZoom = async () => {
      if (!(window as any).svgPanZoom) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js';
        script.async = true;
        document.head.appendChild(script);

        return new Promise<void>((resolve) => {
          script.onload = () => resolve();
        });
      }
    };

    loadSvgPanZoom();
  }, []);

  // Enhanced room data with different statuses
  const roomsData: Room[] = [
    { id: 'room-101', name: 'Conference Room A', status: 'available', capacity: 8, equipment: ['Projector', 'Whiteboard'], description: 'Large conference room with modern amenities' },
    { id: 'room-102', name: 'Conference Room B', status: 'reserved', capacity: 6, equipment: ['TV Screen', 'Conference Phone'], description: 'Medium-sized room perfect for team meetings' },
    { id: 'room-103', name: 'Meeting Room 1', status: 'available', capacity: 4, equipment: ['Whiteboard'], description: 'Small meeting room for focused discussions' },
    { id: 'room-104', name: 'Meeting Room 2', status: 'vacant', capacity: 4, equipment: ['TV Screen'], description: 'Compact room for small team meetings' },
    { id: 'room-105', name: 'Executive Room', status: 'available', capacity: 12, equipment: ['Projector', 'Sound System', 'Video Conference'], description: 'Premium executive boardroom' },
    { id: 'room-106', name: 'Training Room', status: 'pending', capacity: 20, equipment: ['Projector', 'Sound System', 'Microphone'], description: 'Large training room for workshops and presentations' },
  ];

  // Load and process SVG
  useEffect(() => {
    const loadSVG = async () => {
      try {
        setSvgError(null);
        setSvgLoaded(false);

        // Use local path for development, production URL for production
        const isLocalDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
        const svgUrl = isLocalDevelopment 
          ? `/${svgFileName}` 
          : `https://app.devttest.com/space-reserve-mtworks/${svgFileName}`;
        
        console.log('Loading SVG from:', svgUrl);
        const response = await fetch(svgUrl);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }

        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = svgDoc.querySelector('svg');

        if (!svgEl) {
          throw new Error('SVG not found in file');
        }

        // Configure SVG element for mobile
        svgEl.setAttribute('id', 'mobile-svgplan');
        svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%');
        svgEl.removeAttribute('xmlns');
        svgEl.setAttribute('class', 'floor-plan-svg mobile-floor-plan');

        // Store the processed SVG content
        setSvgContent(svgEl.outerHTML);
        setSvgLoaded(true);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading SVG';
        setSvgError(errorMessage);
        console.error('Failed to load SVG:', err);
      }
    };

    if (svgFileName) {
      loadSVG();
    }
  }, [svgFileName]);

  const handleRoomClick = useCallback((elementId: string) => {
    console.log(`Clicked on shape: ${elementId}`);
    // Try to find matching room data
    let room = roomsData.find(r => r.id === elementId || r.name.toLowerCase().replace(/\s+/g, '-') === elementId.toLowerCase());
    
    if (!room) {
      // Create a basic room object for shapes without data
      room = {
        id: elementId,
        name: elementId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        status: 'available',
        capacity: 1,
        equipment: [],
        description: `Room ${elementId}`
      };
    }
    
    setSelectedRoom(room);
  }, [roomsData]);

  const handleShapeHover = useCallback((elementId: string, isHovering: boolean) => {
    const element = document.getElementById(elementId);
    if (element) {
      if (isHovering) {
        element.classList.add('room-hover');
      } else {
        element.classList.remove('room-hover');
      }
    }
  }, []);

  // Initialize SVG interactivity and apply room status colors (updated from FloorMapSVG)
  const initializeSVGInteractivity = useCallback(() => {
    if (isInitializingRef.current || !svgContainerRef.current) {
      return;
    }

    isInitializingRef.current = true;

    try {
      const container = svgContainerRef.current;
      const svgElement = container.querySelector('#mobile-svgplan') as SVGSVGElement;

      if (!svgElement) {
        isInitializingRef.current = false;
        return;
      }

      // Remove existing event listeners by cloning and replacing elements
      const elementsWithListeners = svgElement.querySelectorAll('.room, .room-label');
      elementsWithListeners.forEach((el) => {
        const newEl = el.cloneNode(true);
        el.parentNode?.replaceChild(newEl, el);
      });

      // Add interactivity to all shapes with IDs
      svgElement.querySelectorAll('[id]').forEach((el: Element) => {
        const element = el as SVGElement;
        if (element.tagName === 'path' || element.tagName === 'polygon' ||
          element.tagName === 'rect' || element.tagName === 'circle' ||
          element.tagName === 'ellipse') {
          element.classList.add('room');

          // Apply status-based styling
          const room = roomsData.find(r => r.id === element.id || r.name.toLowerCase().replace(/\s+/g, '-') === element.id.toLowerCase());
          if (room) {
            switch (room.status) {
              case 'available':
                element.style.fill = '#C8E6C9';
                element.style.stroke = '#4CAF50';
                break;
              case 'reserved':
                element.style.fill = '#FFCDD2';
                element.style.stroke = '#F44336';
                break;
              case 'vacant':
                element.style.fill = '#FFFFFF';
                element.style.stroke = '#4CAF50';
                element.style.strokeWidth = '2';
                break;
              case 'pending':
                element.style.fill = '#FFFFFF';
                element.style.stroke = '#FF9800';
                element.style.strokeWidth = '2';
                break;
            }
          }

          const clickHandler = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            handleRoomClick(element.id);
          };
          const mouseEnterHandler = () => handleShapeHover(element.id, true);
          const mouseLeaveHandler = () => handleShapeHover(element.id, false);

          element.addEventListener('click', clickHandler, { passive: false });
          element.addEventListener('mouseenter', mouseEnterHandler);
          element.addEventListener('mouseleave', mouseLeaveHandler);
        }
      });

      // Add interactivity to text labels with IDs
      svgElement.querySelectorAll('text[id]').forEach((el: Element) => {
        const element = el as SVGTextElement;
        element.classList.add('room-label');

        const clickHandler = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          handleRoomClick(element.id);
        };

        element.addEventListener('click', clickHandler, { passive: false });
      });

      // Initialize pan-zoom after setting up interactivity
      if (panZoomInstanceRef.current) {
        try {
          panZoomInstanceRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying existing pan-zoom instance:', error);
        }
        panZoomInstanceRef.current = null;
      }

      if ((window as any).svgPanZoom && svgElement) {
        try {
          panZoomInstanceRef.current = (window as any).svgPanZoom(svgElement, {
            zoomEnabled: true,
            controlIconsEnabled: false,
            fit: true,
            center: true,
            minZoom: 0.3,
            maxZoom: 10,
            panEnabled: true,
            dblClickZoomEnabled: true,
            mouseWheelZoomEnabled: true,
            preventMouseEventsDefault: false,
            zoomScaleSensitivity: 0.3,
          });
        } catch (error) {
          console.warn('Could not initialize svg-pan-zoom:', error);
        }
      }

    } catch (error) {
      console.error('Error initializing SVG interactivity:', error);
    } finally {
      isInitializingRef.current = false;
    }
  }, [handleRoomClick, handleShapeHover, roomsData]);

  // Add interactivity after SVG is rendered
  useEffect(() => {
    if (!svgLoaded || !svgContent) return;

    const timeoutId = setTimeout(() => {
      initializeSVGInteractivity();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [svgLoaded, svgContent, initializeSVGInteractivity]);

  // Re-initialize after modal closes
  useEffect(() => {
    if (!selectedRoom && svgLoaded && svgContent) {
      const timeoutId = setTimeout(() => {
        initializeSVGInteractivity();
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedRoom, svgLoaded, svgContent, initializeSVGInteractivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (panZoomInstanceRef.current) {
        try {
          panZoomInstanceRef.current.destroy();
          panZoomInstanceRef.current = null;
        } catch (error) {
          console.warn('Error destroying pan-zoom instance on unmount:', error);
        }
      }
    };
  }, []);

  const handleReserveRoom = (roomId: string, roomName: string) => {
    onRoomSelect(roomId, roomName);
  };

  const handleZoomIn = useCallback(() => {
    try {
      if (panZoomInstanceRef.current && panZoomInstanceRef.current.zoomIn) {
        panZoomInstanceRef.current.zoomIn();
      }
    } catch (error) {
      console.warn('Error zooming in:', error);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    try {
      if (panZoomInstanceRef.current && panZoomInstanceRef.current.zoomOut) {
        panZoomInstanceRef.current.zoomOut();
      }
    } catch (error) {
      console.warn('Error zooming out:', error);
    }
  }, []);

  const handleResetView = useCallback(() => {
    try {
      if (panZoomInstanceRef.current) {
        if (panZoomInstanceRef.current.resetZoom) {
          panZoomInstanceRef.current.resetZoom();
        }
        setTimeout(() => {
          try {
            if (panZoomInstanceRef.current) {
              if (panZoomInstanceRef.current.center) {
                panZoomInstanceRef.current.center();
              }
              if (panZoomInstanceRef.current.fit) {
                panZoomInstanceRef.current.fit();
              }
            }
          } catch (error) {
            console.warn('Error centering/fitting after reset:', error);
          }
        }, 50);
      }
    } catch (error) {
      console.warn('Error resetting zoom:', error);
    }
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col">
      {/* SVG Styles */}
      <style>{`
        .mobile-floor-plan {
          border: 1px solid #ccc;
          width: 100%;
          height: 100%;
          background: white;
        }
        
        .room {
          cursor: pointer;
          transition: opacity 0.3s ease, filter 0.3s ease;
          pointer-events: all;
        }
        
        .room:hover,
        .room-hover {
          opacity: 0.8;
          filter: brightness(1.1);
        }
        
        .room-label {
          fill: #000;
          font-family: sans-serif;
          font-size: 14px;
          pointer-events: all;
          cursor: pointer;
          transition: fill 0.3s ease;
        }
        
        .room-label:hover {
          fill: #D32F2F;
        }
        
        /* Ensure SVG elements are interactive */
        .mobile-floor-plan * {
          pointer-events: auto;
        }

        /* Pan container styling */
        .pan-container {
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
        }
      `}</style>

      <header className="bg-blue-500 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-blue-100 uppercase tracking-wide font-medium">Kaiser Permanente</p>
                  <h1 className="text-lg font-bold text-white">Select Room</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-white">
                <p className="text-sm font-medium">Joe Yun</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Updated Legend */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#C8E6C9', border: '1px solid #4CAF50' }}></div>
              <span className="text-xs font-medium text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FFCDD2', border: '1px solid #F44336' }}></div>
              <span className="text-xs font-medium text-gray-700">Reserved</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded bg-white" style={{ border: '2px solid #4CAF50' }}></div>
              <span className="text-xs font-medium text-gray-700">Vacant</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded bg-white" style={{ border: '2px solid #FF9800' }}></div>
              <span className="text-xs font-medium text-gray-700">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-100">
        <div
          ref={svgContainerRef}
          className="w-full h-full bg-gray-100"
          style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}
          role="application"
          aria-label="Interactive architectural floor map"
        >
          {!svgLoaded && !svgError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading floor plan...</p>
              </div>
            </div>
          )}

          {svgError && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">Failed to load floor plan</p>
                <p className="text-sm mt-1">{svgError}</p>
              </div>
            </div>
          )}

          {svgLoaded && svgContent && (
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Zoom In"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </button>
            
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Zoom Out"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            
            <button
              onClick={handleResetView}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Reset View"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-20 left-4 right-4 bg-white/95 rounded-lg p-3 text-sm text-gray-600 shadow-lg border">
          <p className="text-center font-medium">
            Tap rooms for details • Pinch to zoom • Drag to pan
          </p>
        </div>
      </div>

      {/* Room Details Modal */}
      <MobileRoomModal 
        room={selectedRoom} 
        onClose={() => setSelectedRoom(null)} 
        onReserve={handleReserveRoom}
      />

      {/* Global Sticky Bottom Navigation */}
      {onTabChange && (
        <BottomNavigation 
          currentTab={currentTab}
          onTabChange={onTabChange}
          onSettingsClick={onSettingsClick}
        />
      )}
    </div>
  );
};

export default FloorMapMobile;