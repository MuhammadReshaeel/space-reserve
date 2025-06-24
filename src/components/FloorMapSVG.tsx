import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Room } from '../types/Room';
import RoomModal from './RoomModal';
import Legend from './Legend';

interface FloorMapSVGProps {
  rooms?: Room[];
  showMobileLegend?: boolean;
  setShowMobileLegend?: (show: boolean) => void;
  svgFileName?: string;
}

const FloorMapSVG: React.FC<FloorMapSVGProps> = ({
  rooms = [],
  showMobileLegend,
  setShowMobileLegend,
  svgFileName = 'OR045101S.svg'
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

  const handleShapeClick = useCallback((elementId: string) => {
    console.log(`Clicked on shape: ${elementId}`);
    // Try to find matching room data
    const room = rooms.find(r => r.id === elementId || r.name.toLowerCase().replace(/\s+/g, '-') === elementId.toLowerCase());
    if (room) {
      setSelectedRoom(room);
    } else {
      // Create a basic room object for shapes without data
      const basicRoom: Room = {
        id: elementId,
        name: elementId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        status: 'available',
        capacity: 1,
        equipment: [],
        description: `Room ${elementId}`
      };
      setSelectedRoom(basicRoom);
    }
  }, [rooms]);

  const handleTextClick = useCallback((elementId: string) => {
    console.log(`Clicked on text: ${elementId}`);
    handleShapeClick(elementId);
  }, [handleShapeClick]);

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

        // Configure SVG element
        svgEl.setAttribute('id', 'svgplan');
        svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%');
        svgEl.removeAttribute('xmlns');
        svgEl.setAttribute('class', 'floor-plan-svg');

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

  // Initialize SVG interactivity and pan-zoom
  const initializeSVGInteractivity = useCallback(() => {
    if (isInitializingRef.current || !svgContainerRef.current) {
      return;
    }

    isInitializingRef.current = true;

    try {
      const container = svgContainerRef.current;
      const svgElement = container.querySelector('#svgplan') as SVGSVGElement;

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

          const clickHandler = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            handleShapeClick(element.id);
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
          handleTextClick(element.id);
        };

        element.addEventListener('click', clickHandler, { passive: false });
      });

      // Initialize pan-zoom
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
            controlIconsEnabled: false, // Disable built-in controls to avoid conflicts
            fit: true,
            center: true,
            minZoom: 0.3,
            maxZoom: 10,
            panEnabled: true,
            dblClickZoomEnabled: true,
            mouseWheelZoomEnabled: true,
            preventMouseEventsDefault: false,
            zoomScaleSensitivity: 0.3,
            beforeZoom: function (oldScale: number, newScale: number) {
              // Allow zooming
              return true;
            },
            onZoom: function (newScale: number) {
              // Handle zoom events if needed
            },
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
  }, [handleShapeClick, handleTextClick, handleShapeHover]);

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

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  // Manual zoom controls with better error handling
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

  const handleResetZoom = useCallback(() => {
    try {
      if (panZoomInstanceRef.current) {
        // Use individual method calls with error handling
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
            // Fallback: reinitialize everything
            initializeSVGInteractivity();
          }
        }, 50);
      }
    } catch (error) {
      console.warn('Error resetting zoom:', error);
      // Fallback: reinitialize everything
      initializeSVGInteractivity();
    }
  }, [initializeSVGInteractivity]);

  const handleFullscreen = useCallback(() => {
    try {
      if (svgContainerRef.current) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          svgContainerRef.current.requestFullscreen();
        }
      }
    } catch (error) {
      console.warn('Error toggling fullscreen:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Legend
        rooms={rooms}
        showMobileLegend={showMobileLegend}
        setShowMobileLegend={setShowMobileLegend}
      />

      {/* SVG Styles */}
      <style>{`
        .floor-plan-svg {
          border: 1px solid #ccc;
          width: 100%;
          height: 100%;
          background: white;
        }
        
        .room {
          cursor: pointer;
          transition: opacity 0.3s ease, filter 0.3s ease;
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
        .floor-plan-svg * {
          pointer-events: auto;
        }
      `}</style>

      {/* Color Legend */}
      <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Highlight Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#C8E6C9', border: '1px solid #4CAF50' }}></div>
            <span className="text-xs text-gray-700">Office spaces</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#BBDEFB', border: '1px solid #2196F3' }}></div>
            <span className="text-xs text-gray-700">Forecast provider spaces</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFE0B2', border: '1px solid #FF9800' }}></div>
            <span className="text-xs text-gray-700">Hoteling spaces</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-white" style={{ border: '2px solid #4CAF50' }}></div>
            <span className="text-xs text-gray-700">Vacant spaces</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-white" style={{ border: '2px solid #FF9800' }}></div>
            <span className="text-xs text-gray-700">Pending Requests</span>
          </div>
        </div>
      </div>

      {/* Main Floor Map Section */}
      <div className="p-4 md:p-6 md:pr-80 lg:pr-96">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Interactive Floor Plan</h2>
                <p className="text-sm text-gray-600 mt-1">Professional architectural layout with room details</p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Click rooms for details</span>
              </div>
            </div>
          </div>

          {/* SVG Container */}
          <div className="relative">
            <div
              ref={svgContainerRef}
              className="bg-gray-100"
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

            {/* Manual Zoom Controls - Desktop */}
            {svgLoaded && (
              <div className="hidden md:block absolute top-6 left-6 z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
                <div className="flex items-center p-2 space-x-1">
                  {/* Zoom In */}
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
                    title="Zoom In"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>

                  {/* Zoom Out */}
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
                    title="Zoom Out"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>

                  {/* Reset/Center */}
                  <button
                    onClick={handleResetZoom}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
                    title="Reset View"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
                    title="Toggle Fullscreen"
                    type="button"
                  >
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Zoom Controls - Top Right */}
            {svgLoaded && (
              <div className="md:hidden absolute top-6 right-6 z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
                <div className="flex items-center p-1 space-x-1">
                  {/* Zoom In */}
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Zoom In"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>

                  {/* Zoom Out */}
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Zoom Out"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>

                  {/* Reset/Center */}
                  <button
                    onClick={handleResetZoom}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Reset View"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Toggle Fullscreen"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room details modal */}
      <RoomModal room={selectedRoom} onClose={handleCloseModal} />

      {/* Mobile instructions */}
      <div className="md:hidden absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 rounded-lg p-3 text-sm text-gray-600 shadow-lg border">
        <p className="text-center font-medium">
          Pinch to zoom • Drag to pan • Tap rooms for details
        </p>
      </div>

      {/* Desktop instructions */}
      <div className="hidden md:block absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 text-sm text-gray-600 shadow-lg border">
        <p className="font-medium">
          Scroll to zoom • Drag to pan • Click rooms for details
        </p>
      </div>
    </div>
  );
};

export default FloorMapSVG; 