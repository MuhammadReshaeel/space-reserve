import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Room } from '../types/Room';
import { getRoomColors } from '../utils/roomColors';
import { mockRooms } from '../data/mockRooms';
import RoomModal from './RoomModal';
import Legend from './Legend';

interface FloorMapProps {
  rooms?: Room[];
}

const FloorMap: React.FC<FloorMapProps> = ({ rooms = mockRooms }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 700 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        setStageSize({
          width: Math.max(containerWidth, 1200),
          height: Math.max(containerHeight, 700),
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

  const handleKeyDown = (e: React.KeyboardEvent, room: Room) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRoomClick(room);
    }
  };

  // Calculate the bounds of all rooms to determine canvas size
  const bounds = rooms.reduce(
    (acc, room) => ({
      minX: Math.min(acc.minX, room.x),
      minY: Math.min(acc.minY, room.y),
      maxX: Math.max(acc.maxX, room.x + room.width),
      maxY: Math.max(acc.maxY, room.y + room.height),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  const canvasWidth = Math.max(bounds.maxX + 100, stageSize.width);
  const canvasHeight = Math.max(bounds.maxY + 100, stageSize.height);

  // Wall and corridor definitions for architectural elements
  const walls = [
    // Outer building walls
    { points: [30, 30, canvasWidth - 30, 30], thickness: 8 }, // Top wall
    { points: [30, 30, 30, canvasHeight - 30], thickness: 8 }, // Left wall
    { points: [canvasWidth - 30, 30, canvasWidth - 30, canvasHeight - 30], thickness: 8 }, // Right wall
    { points: [30, canvasHeight - 30, canvasWidth - 30, canvasHeight - 30], thickness: 8 }, // Bottom wall
    
    // Internal structural walls
    { points: [280, 30, 280, 260], thickness: 6 }, // Main vertical divider
    { points: [470, 30, 470, 420], thickness: 6 }, // Central divider
    { points: [810, 30, 810, 580], thickness: 6 }, // Right section divider
    
    // Horizontal corridors
    { points: [30, 260, 470, 260], thickness: 4 }, // Main horizontal corridor
    { points: [30, 390, 850, 390], thickness: 4 }, // Lower corridor
    { points: [470, 220, 810, 220], thickness: 4 }, // Mid corridor
    
    // Internal room dividers
    { points: [190, 170, 190, 260], thickness: 3 }, // Office divider
    { points: [450, 170, 450, 220], thickness: 3 }, // Meeting room divider
    { points: [580, 150, 580, 220], thickness: 3 }, // Hoteling divider
    { points: [690, 150, 690, 220], thickness: 3 }, // Hoteling divider 2
    
    // Additional structural elements
    { points: [850, 240, 1000, 240], thickness: 3 }, // Right wing divider
    { points: [850, 330, 1000, 330], thickness: 3 }, // Right wing divider 2
    { points: [360, 400, 360, 480], thickness: 3 }, // Bottom section divider
  ];

  // Corridor areas for visual enhancement
  const corridors = [
    { x: 30, y: 260, width: 440, height: 20, fill: '#f8fafc' }, // Main corridor
    { x: 30, y: 390, width: 820, height: 20, fill: '#f8fafc' }, // Lower corridor
    { x: 470, y: 220, width: 340, height: 20, fill: '#f8fafc' }, // Mid corridor
    { x: 280, y: 30, width: 20, height: 230, fill: '#f8fafc' }, // Vertical corridor 1
    { x: 470, y: 30, width: 20, height: 390, fill: '#f8fafc' }, // Vertical corridor 2
    { x: 810, y: 30, width: 20, height: 550, fill: '#f8fafc' }, // Vertical corridor 3
  ];

  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      <Legend />
      
      <div 
        ref={containerRef}
        className="w-full h-full"
        role="application"
        aria-label="Interactive floor map"
      >
        <TransformWrapper
          initialScale={0.8}
          minScale={0.3}
          maxScale={3}
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
                  x={30}
                  y={30}
                  width={canvasWidth - 60}
                  height={canvasHeight - 60}
                  fill="#ffffff"
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                
                {/* Corridor areas */}
                {corridors.map((corridor, index) => (
                  <Rect
                    key={`corridor-${index}`}
                    x={corridor.x}
                    y={corridor.y}
                    width={corridor.width}
                    height={corridor.height}
                    fill={corridor.fill}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                  />
                ))}
                
                {/* Structural walls */}
                {walls.map((wall, index) => (
                  <Line
                    key={`wall-${index}`}
                    points={wall.points}
                    stroke="#374151"
                    strokeWidth={wall.thickness}
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
                
                {/* Render rooms */}
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
                        cornerRadius={3}
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
                        x={room.x + 6}
                        y={room.y + 6}
                        text={room.name}
                        fontSize={fontSize}
                        fontFamily="Arial, sans-serif"
                        fontStyle="bold"
                        fill="#1f2937"
                        width={room.width - 12}
                        height={room.height / 2 - 6}
                        align="center"
                        verticalAlign="middle"
                        wrap="word"
                        ellipsis={true}
                        onClick={() => handleRoomClick(room)}
                        onTap={() => handleRoomClick(room)}
                        listening={true}
                      />
                      
                      {/* Room ID */}
                      {room.height > 50 && (
                        <Text
                          x={room.x + 6}
                          y={room.y + room.height - 18}
                          text={room.id}
                          fontSize={Math.min(fontSize * 0.8, 9)}
                          fontFamily="Arial, sans-serif"
                          fill="#6b7280"
                          width={room.width - 12}
                          align="center"
                          onClick={() => handleRoomClick(room)}
                          onTap={() => handleRoomClick(room)}
                          listening={true}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
                
                {/* Building entrance indicator */}
                <Rect
                  x={canvasWidth / 2 - 30}
                  y={canvasHeight - 30}
                  width={60}
                  height={8}
                  fill="#10b981"
                  cornerRadius={4}
                />
                <Text
                  x={canvasWidth / 2 - 30}
                  y={canvasHeight - 50}
                  text="ENTRANCE"
                  fontSize={10}
                  fontFamily="Arial, sans-serif"
                  fontStyle="bold"
                  fill="#059669"
                  width={60}
                  align="center"
                />
                
                {/* Floor label */}
                <Text
                  x={50}
                  y={canvasHeight - 100}
                  text="FLOOR PLAN - LEVEL 1"
                  fontSize={14}
                  fontFamily="Arial, sans-serif"
                  fontStyle="bold"
                  fill="#374151"
                />
              </Layer>
            </Stage>
          </TransformComponent>
        </TransformWrapper>
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

export default FloorMap; 