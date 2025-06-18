import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Arc } from 'react-konva';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Room } from '../types/Room';
import { getRoomColors } from '../utils/roomColors';
import { mockRooms } from '../data/mockRooms';
import RoomModal from './RoomModal';
import Legend from './Legend';

interface FloorMapKonvaProps {
  rooms?: Room[];
  showMobileLegend?: boolean;
  setShowMobileLegend?: (show: boolean) => void;
}

const FloorMapKonva: React.FC<FloorMapKonvaProps> = ({ 
  rooms = mockRooms, 
  showMobileLegend, 
  setShowMobileLegend 
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [stageSize, setStageSize] = useState({ width: 1400, height: 800 });
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        setStageSize({
          width: Math.max(containerWidth, 1400),
          height: Math.max(containerHeight, 800),
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  // Zoom control handlers
  const handleZoomIn = () => {
    if (transformRef.current) {
      transformRef.current.zoomIn(0.3);
    }
  };

  const handleZoomOut = () => {
    if (transformRef.current) {
      transformRef.current.zoomOut(0.3);
    }
  };

  const handleResetZoom = () => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const canvasWidth = 1400;
  const canvasHeight = 800;

  // Professional architectural walls with precise door openings
  const walls = [
    // Outer building perimeter
    { points: [50, 50, 1350, 50], thickness: 2, color: '#9ca3af' }, // Top wall
    { points: [50, 50, 50, 750], thickness: 2, color: '#9ca3af' }, // Left wall
    { points: [1350, 50, 1350, 750], thickness: 2, color: '#9ca3af' }, // Right wall
    { points: [50, 750, 1350, 750], thickness: 2, color: '#9ca3af' }, // Bottom wall
    
    // Main vertical separators with door openings
    { points: [300, 50, 300, 180], thickness: 1, color: '#d1d5db' }, // Left section - top
    { points: [300, 220, 300, 360], thickness: 1, color: '#d1d5db' }, // Left section - mid
    { points: [300, 400, 300, 540], thickness: 1, color: '#d1d5db' }, // Left section - bottom 1
    { points: [300, 580, 300, 750], thickness: 1, color: '#d1d5db' }, // Left section - bottom 2
    
    { points: [600, 50, 600, 160], thickness: 1, color: '#d1d5db' }, // Center section - top
    { points: [600, 200, 600, 340], thickness: 1, color: '#d1d5db' }, // Center section - mid
    { points: [600, 380, 600, 520], thickness: 1, color: '#d1d5db' }, // Center section - bottom 1
    { points: [600, 560, 600, 750], thickness: 1, color: '#d1d5db' }, // Center section - bottom 2
    
    { points: [900, 50, 900, 180], thickness: 1, color: '#d1d5db' }, // Right section - top
    { points: [900, 220, 900, 360], thickness: 1, color: '#d1d5db' }, // Right section - mid
    { points: [900, 400, 900, 540], thickness: 1, color: '#d1d5db' }, // Right section - bottom 1
    { points: [900, 580, 900, 750], thickness: 1, color: '#d1d5db' }, // Right section - bottom 2
    
    // Main horizontal corridors with door openings
    { points: [50, 200, 180, 200], thickness: 1, color: '#d1d5db' }, // Top corridor - left
    { points: [220, 200, 480, 200], thickness: 1, color: '#d1d5db' }, // Top corridor - center left
    { points: [520, 200, 780, 200], thickness: 1, color: '#d1d5db' }, // Top corridor - center right
    { points: [820, 200, 1080, 200], thickness: 1, color: '#d1d5db' }, // Top corridor - right left
    { points: [1120, 200, 1350, 200], thickness: 1, color: '#d1d5db' }, // Top corridor - right
    
    { points: [50, 400, 180, 400], thickness: 1, color: '#d1d5db' }, // Mid corridor - left
    { points: [220, 400, 480, 400], thickness: 1, color: '#d1d5db' }, // Mid corridor - center left
    { points: [520, 400, 780, 400], thickness: 1, color: '#d1d5db' }, // Mid corridor - center right
    { points: [820, 400, 1080, 400], thickness: 1, color: '#d1d5db' }, // Mid corridor - right left
    { points: [1120, 400, 1350, 400], thickness: 1, color: '#d1d5db' }, // Mid corridor - right
    
    { points: [50, 600, 180, 600], thickness: 1, color: '#d1d5db' }, // Bottom corridor - left
    { points: [220, 600, 480, 600], thickness: 1, color: '#d1d5db' }, // Bottom corridor - center left
    { points: [520, 600, 780, 600], thickness: 1, color: '#d1d5db' }, // Bottom corridor - center right
    { points: [820, 600, 1080, 600], thickness: 1, color: '#d1d5db' }, // Bottom corridor - right left
    { points: [1120, 600, 1350, 600], thickness: 1, color: '#d1d5db' }, // Bottom corridor - right
    
    // Internal room dividers with door openings
    { points: [150, 50, 150, 160], thickness: 1, color: '#e5e7eb' }, // Small offices - top
    { points: [150, 200, 150, 240], thickness: 1, color: '#e5e7eb' }, // Small offices - mid
    { points: [450, 50, 450, 160], thickness: 1, color: '#e5e7eb' }, // Meeting rooms - top
    { points: [450, 200, 450, 240], thickness: 1, color: '#e5e7eb' }, // Meeting rooms - mid
    { points: [750, 50, 750, 160], thickness: 1, color: '#e5e7eb' }, // Hoteling - top
    { points: [750, 200, 750, 240], thickness: 1, color: '#e5e7eb' }, // Hoteling - mid
    { points: [1050, 50, 1050, 160], thickness: 1, color: '#e5e7eb' }, // Right wing - top
    { points: [1050, 200, 1050, 240], thickness: 1, color: '#e5e7eb' }, // Right wing - mid
    
    // Additional horizontal dividers
    { points: [50, 300, 280, 300], thickness: 1, color: '#e5e7eb' }, // Left section horizontal
    { points: [320, 300, 580, 300], thickness: 1, color: '#e5e7eb' }, // Center section horizontal
    { points: [620, 300, 880, 300], thickness: 1, color: '#e5e7eb' }, // Right center horizontal
    { points: [920, 300, 1350, 300], thickness: 1, color: '#e5e7eb' }, // Right section horizontal
    
    { points: [50, 500, 280, 500], thickness: 1, color: '#e5e7eb' }, // Left section horizontal 2
    { points: [320, 500, 580, 500], thickness: 1, color: '#e5e7eb' }, // Center section horizontal 2
    { points: [620, 500, 880, 500], thickness: 1, color: '#e5e7eb' }, // Right center horizontal 2
    { points: [920, 500, 1350, 500], thickness: 1, color: '#e5e7eb' }, // Right section horizontal 2
  ];

  // Professional door representations with swing indicators
  const doors = [
    // Main entrance doors
    { x: 675, y: 45, width: 50, height: 10, type: 'main', swing: 'in' },
    
    // Vertical wall doors (in wall gaps)
    { x: 295, y: 180, width: 10, height: 40, type: 'single', swing: 'right' },
    { x: 295, y: 360, width: 10, height: 40, type: 'single', swing: 'left' },
    { x: 295, y: 540, width: 10, height: 40, type: 'single', swing: 'right' },
    
    { x: 595, y: 160, width: 10, height: 40, type: 'single', swing: 'left' },
    { x: 595, y: 340, width: 10, height: 40, type: 'single', swing: 'right' },
    { x: 595, y: 520, width: 10, height: 40, type: 'single', swing: 'left' },
    
    { x: 895, y: 180, width: 10, height: 40, type: 'single', swing: 'right' },
    { x: 895, y: 360, width: 10, height: 40, type: 'single', swing: 'left' },
    { x: 895, y: 540, width: 10, height: 40, type: 'single', swing: 'right' },
    
    // Horizontal corridor doors
    { x: 180, y: 195, width: 40, height: 10, type: 'single', swing: 'up' },
    { x: 480, y: 195, width: 40, height: 10, type: 'single', swing: 'down' },
    { x: 780, y: 195, width: 40, height: 10, type: 'single', swing: 'up' },
    { x: 1080, y: 195, width: 40, height: 10, type: 'single', swing: 'down' },
    
    { x: 180, y: 395, width: 40, height: 10, type: 'single', swing: 'down' },
    { x: 480, y: 395, width: 40, height: 10, type: 'single', swing: 'up' },
    { x: 780, y: 395, width: 40, height: 10, type: 'single', swing: 'down' },
    { x: 1080, y: 395, width: 40, height: 10, type: 'single', swing: 'up' },
    
    { x: 180, y: 595, width: 40, height: 10, type: 'single', swing: 'up' },
    { x: 480, y: 595, width: 40, height: 10, type: 'single', swing: 'down' },
    { x: 780, y: 595, width: 40, height: 10, type: 'single', swing: 'up' },
    { x: 1080, y: 595, width: 40, height: 10, type: 'single', swing: 'down' },
    
    // Room entry doors
    { x: 145, y: 160, width: 10, height: 40, type: 'office', swing: 'right' },
    { x: 445, y: 160, width: 10, height: 40, type: 'office', swing: 'left' },
    { x: 745, y: 160, width: 10, height: 40, type: 'office', swing: 'right' },
    { x: 1045, y: 160, width: 10, height: 40, type: 'office', swing: 'left' },
  ];

  // Corridor highlight areas
  const corridors = [
    { x: 50, y: 195, width: 1300, height: 10, fill: '#f9fafb', stroke: '#f3f4f6' }, // Top corridor
    { x: 50, y: 395, width: 1300, height: 10, fill: '#f9fafb', stroke: '#f3f4f6' }, // Mid corridor
    { x: 50, y: 595, width: 1300, height: 10, fill: '#f9fafb', stroke: '#f3f4f6' }, // Bottom corridor
    { x: 295, y: 50, width: 10, height: 700, fill: '#f9fafb', stroke: '#f3f4f6' }, // Left vertical
    { x: 595, y: 50, width: 10, height: 700, fill: '#f9fafb', stroke: '#f3f4f6' }, // Center vertical
    { x: 895, y: 50, width: 10, height: 700, fill: '#f9fafb', stroke: '#f3f4f6' }, // Right vertical
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Legend 
        rooms={rooms} 
        showMobileLegend={showMobileLegend}
        setShowMobileLegend={setShowMobileLegend}
      />
      
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

          {/* Floor Map Container */}
          <div className="relative">
            <div 
              ref={containerRef}
              className="bg-gray-100"
              style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}
              role="application"
              aria-label="Interactive architectural floor map"
            >
              <TransformWrapper
                ref={transformRef}
          initialScale={0.6}
          minScale={0.3}
          maxScale={2.5}
          centerOnInit={true}
          limitToBounds={false}
          panning={{
            disabled: false,
            velocityDisabled: false,
          }}
          pinch={{
            disabled: false,
          }}
          doubleClick={{
            disabled: false,
            mode: 'zoomIn',
          }}
          wheel={{
            disabled: false,
          }}
        >
          <TransformComponent
            wrapperClass="w-full h-full"
            contentClass="w-full h-full flex items-center justify-center"
          >
            <Stage 
              width={canvasWidth} 
              height={canvasHeight}
              className="bg-white border border-gray-300 shadow-lg"
            >
              <Layer>
                {/* Building background */}
                <Rect
                  x={50}
                  y={50}
                  width={canvasWidth - 100}
                  height={canvasHeight - 100}
                  fill="#fefefe"
                  stroke="#d1d5db"
                  strokeWidth={1}
                />
                
                {/* Corridor highlight areas */}
                {corridors.map((corridor, index) => (
                  <Rect
                    key={`corridor-${index}`}
                    x={corridor.x}
                    y={corridor.y}
                    width={corridor.width}
                    height={corridor.height}
                    fill={corridor.fill}
                    stroke={corridor.stroke}
                    strokeWidth={1}
                  />
                ))}
                
                {/* Architectural walls */}
                {walls.map((wall, index) => (
                  <Line
                    key={`wall-${index}`}
                    points={wall.points}
                    stroke={wall.color}
                    strokeWidth={wall.thickness}
                    lineCap="square"
                    lineJoin="miter"
                  />
                ))}
                
                {/* Professional doors with swing indicators */}
                {doors.map((door, index) => (
                  <React.Fragment key={`door-${index}`}>
                    {door.type === 'main' ? (
                      // Main entrance door
                      <React.Fragment>
                        <Rect
                          x={door.x}
                          y={door.y}
                          width={door.width}
                          height={door.height}
                          fill="#059669"
                          stroke="#047857"
                          strokeWidth={1}
                          cornerRadius={2}
                        />
                        <Text
                          x={door.x}
                          y={door.y - 15}
                          text="MAIN ENTRANCE"
                          fontSize={8}
                          fontFamily="Arial, sans-serif"
                          fontStyle="bold"
                          fill="#059669"
                          width={door.width}
                          align="center"
                        />
                      </React.Fragment>
                    ) : (
                      // Internal doors with swing arcs
                      <React.Fragment>
                        <Rect
                          x={door.x}
                          y={door.y}
                          width={door.width}
                          height={door.height}
                          fill="#ffffff"
                          stroke="#9ca3af"
                          strokeWidth={1}
                        />
                        
                        {/* Door swing indicator */}
                        {door.swing === 'right' && (
                          <Arc
                            x={door.x + door.width}
                            y={door.y + door.height/2}
                            innerRadius={0}
                            outerRadius={door.height/2}
                            angle={90}
                            rotation={0}
                            stroke="#d1d5db"
                            strokeWidth={1}
                            dash={[2, 2]}
                          />
                        )}
                        {door.swing === 'left' && (
                          <Arc
                            x={door.x}
                            y={door.y + door.height/2}
                            innerRadius={0}
                            outerRadius={door.height/2}
                            angle={90}
                            rotation={90}
                            stroke="#d1d5db"
                            strokeWidth={1}
                            dash={[2, 2]}
                          />
                        )}
                        {door.swing === 'up' && (
                          <Arc
                            x={door.x + door.width/2}
                            y={door.y}
                            innerRadius={0}
                            outerRadius={door.width/2}
                            angle={90}
                            rotation={180}
                            stroke="#d1d5db"
                            strokeWidth={1}
                            dash={[2, 2]}
                          />
                        )}
                        {door.swing === 'down' && (
                          <Arc
                            x={door.x + door.width/2}
                            y={door.y + door.height}
                            innerRadius={0}
                            outerRadius={door.width/2}
                            angle={90}
                            rotation={270}
                            stroke="#d1d5db"
                            strokeWidth={1}
                            dash={[2, 2]}
                          />
                        )}
                        
                        {/* Door handle */}
                        <Circle
                          x={door.width > door.height ? door.x + door.width * 0.8 : door.x + door.width/2}
                          y={door.height > door.width ? door.y + door.height * 0.8 : door.y + door.height/2}
                          radius={1}
                          fill="#9ca3af"
                        />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))}
                
                {/* Render rooms with professional styling */}
                {rooms.map((room) => {
                  const colors = getRoomColors(room.status);
                  const fontSize = Math.min(room.width / 10, room.height / 5, 11);
                  
                  return (
                    <React.Fragment key={room.id}>
                      <Rect
                        x={room.x}
                        y={room.y}
                        width={room.width}
                        height={room.height}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth={colors.strokeWidth}
                        cornerRadius={2}
                        shadowColor="rgba(0,0,0,0.1)"
                        shadowBlur={2}
                        shadowOffset={{ x: 1, y: 1 }}
                        shadowOpacity={0.3}
                        onClick={() => handleRoomClick(room)}
                        onTap={() => handleRoomClick(room)}
                        onMouseEnter={(e) => {
                          const stage = e.target.getStage();
                          if (stage) {
                            stage.container().style.cursor = 'pointer';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const stage = e.target.getStage();
                          if (stage) {
                            stage.container().style.cursor = 'default';
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${room.name}, ${room.status} status`}
                      />
                      
                      {/* Room name */}
                      <Text
                        x={room.x + 4}
                        y={room.y + 4}
                        text={room.name}
                        fontSize={fontSize}
                        fontFamily="Arial, sans-serif"
                        fontStyle="bold"
                        fill="#1a202c"
                        width={room.width - 8}
                        height={room.height / 2 - 4}
                        align="center"
                        verticalAlign="middle"
                        wrap="word"
                        ellipsis={true}
                        onClick={() => handleRoomClick(room)}
                        onTap={() => handleRoomClick(room)}
                        listening={true}
                      />
                      
                      {/* Room ID */}
                      {room.height > 40 && (
                        <Text
                          x={room.x + 4}
                          y={room.y + room.height - 16}
                          text={room.id}
                          fontSize={Math.min(fontSize * 0.8, 8)}
                          fontFamily="Arial, sans-serif"
                          fill="#4a5568"
                          width={room.width - 8}
                          align="center"
                          onClick={() => handleRoomClick(room)}
                          onTap={() => handleRoomClick(room)}
                          listening={true}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
                
                {/* Floor plan title and info */}
                <Text
                  x={60}
                  y={canvasHeight - 80}
                  text="ARCHITECTURAL FLOOR PLAN - LEVEL 1"
                  fontSize={14}
                  fontFamily="Arial, sans-serif"
                  fontStyle="bold"
                  fill="#2d3748"
                />
                
                <Text
                  x={60}
                  y={canvasHeight - 60}
                  text="Interactive Canvas Implementation with Professional Doors & Corridors"
                  fontSize={10}
                  fontFamily="Arial, sans-serif"
                  fill="#4a5568"
                />
                
                {/* Scale indicator */}
                <Line
                  points={[canvasWidth - 150, canvasHeight - 80, canvasWidth - 100, canvasHeight - 80]}
                  stroke="#2d3748"
                  strokeWidth={2}
                />
                <Text
                  x={canvasWidth - 150}
                  y={canvasHeight - 95}
                  text="50 ft"
                  fontSize={8}
                  fontFamily="Arial, sans-serif"
                  fill="#2d3748"
                  width={50}
                  align="center"
                />
              </Layer>
            </Stage>
          </TransformComponent>
        </TransformWrapper>
      </div>

                  {/* Zoom Controls Toolbar - Desktop */}
            <div className="hidden md:block absolute top-6 left-6 z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
              <div className="flex items-center p-2 space-x-1">
                {/* Zoom In */}
                <button 
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
                  title="Zoom In"
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
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Zoom Controls - Top Right */}
            <div className="md:hidden absolute top-6 right-6 z-30 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
              <div className="flex items-center p-1 space-x-1">
                {/* Zoom In */}
                <button 
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  title="Zoom In"
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
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
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

export default FloorMapKonva; 