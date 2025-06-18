import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Room } from '../types/Room';
import { mockRooms } from '../data/mockRooms';
import RoomModal from './RoomModal';
import Legend from './Legend';

interface FloorMapReactFlowProps {
  rooms?: Room[];
  showMobileLegend?: boolean;
  setShowMobileLegend?: (show: boolean) => void;
}

// Custom Room Node Component
const RoomNode = ({ data }: { data: any }) => {
  const { room, onRoomClick } = data;

  // Get room colors based on status
  const getRoomColor = (status: string) => {
    switch (status) {
      case 'office':
        return '#bbf7d0';
      case 'forecast':
        return '#bfdbfe';
      case 'hoteling':
        return '#fef3c7';
      case 'vacant':
        return '#ffffff';
      case 'pending':
        return '#ffffff';
      default:
        return '#f3f4f6';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'office':
        return '#16a34a';
      case 'forecast':
        return '#2563eb';
      case 'hoteling':
        return '#d97706';
      case 'vacant':
        return '#16a34a';
      case 'pending':
        return '#ea580c';
      default:
        return '#6b7280';
    }
  };

  const getBorderWidth = (status: string) => {
    return status === 'vacant' || status === 'pending' ? '2px' : '1px';
  };

  const handleClick = () => {
    onRoomClick(room);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 rounded-sm"
      style={{
        width: `${room.width}px`,
        height: `${room.height}px`,
        backgroundColor: getRoomColor(room.status),
        border: `${getBorderWidth(room.status)} solid ${getBorderColor(room.status)}`,
        opacity: room.status === 'vacant' || room.status === 'pending' ? 0.8 : 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px',
        boxSizing: 'border-box',
      }}
    >
      <div 
        className="font-semibold text-gray-900 text-center leading-tight"
        style={{ 
          fontSize: Math.min(room.width / 8, room.height / 8, 12) + 'px',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {room.name}
      </div>
      {room.height > 40 && (
        <div 
          className="text-gray-600 text-center mt-1"
          style={{ 
            fontSize: Math.min(room.width / 12, room.height / 12, 10) + 'px',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {room.id}
        </div>
      )}
    </div>
  );
};

// Building Structure Component
const BuildingStructure = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Main building outline */}
      <div 
        className="absolute border-2 border-slate-600"
        style={{
          left: '50px',
          top: '50px',
          width: '1100px',
          height: '550px',
        }}
      />
      
      {/* Horizontal corridor */}
      <div 
        className="absolute border-t-2 border-slate-600"
        style={{
          left: '50px',
          top: '325px',
          width: '200px',
        }}
      />
      <div 
        className="absolute border-t-2 border-slate-600"
        style={{
          left: '300px',
          top: '325px',
          width: '200px',
        }}
      />
      <div 
        className="absolute border-t-2 border-slate-600"
        style={{
          left: '550px',
          top: '325px',
          width: '200px',
        }}
      />
      <div 
        className="absolute border-t-2 border-slate-600"
        style={{
          left: '800px',
          top: '325px',
          width: '350px',
        }}
      />
      
      {/* Vertical separators */}
      <div 
        className="absolute border-l-2 border-slate-600"
        style={{
          left: '375px',
          top: '50px',
          height: '125px',
        }}
      />
      <div 
        className="absolute border-l-2 border-slate-600"
        style={{
          left: '375px',
          top: '225px',
          height: '100px',
        }}
      />
      <div 
        className="absolute border-l-2 border-slate-600"
        style={{
          left: '375px',
          top: '375px',
          height: '225px',
        }}
      />
      
      <div 
        className="absolute border-l-2 border-slate-600"
        style={{
          left: '775px',
          top: '50px',
          height: '125px',
        }}
      />
      <div 
        className="absolute border-l-2 border-slate-600"
        style={{
          left: '775px',
          top: '225px',
          height: '100px',
        }}
      />
      <div 
        className="absolute border-l-2 border-slate-600"
        style={{
          left: '775px',
          top: '375px',
          height: '225px',
        }}
      />
      
      {/* Main entrance door */}
      <div 
        className="absolute bg-green-600"
        style={{
          left: '570px',
          top: '48px',
          width: '60px',
          height: '4px',
        }}
      />
      
      {/* Internal doors */}
      <div 
        className="absolute bg-slate-600"
        style={{
          left: '320px',
          top: '315px',
          width: '4px',
          height: '20px',
        }}
      />
      <div 
        className="absolute bg-slate-600"
        style={{
          left: '720px',
          top: '315px',
          width: '4px',
          height: '20px',
        }}
      />
      <div 
        className="absolute bg-slate-600"
        style={{
          left: '520px',
          top: '315px',
          width: '4px',
          height: '20px',
        }}
      />
      <div 
        className="absolute bg-slate-600"
        style={{
          left: '920px',
          top: '315px',
          width: '4px',
          height: '20px',
        }}
      />
    </div>
  );
};

// Define custom node types
const nodeTypes: NodeTypes = {
  roomNode: RoomNode,
};

const FloorMapReactFlow: React.FC<FloorMapReactFlowProps> = ({ 
  rooms = mockRooms, 
  showMobileLegend, 
  setShowMobileLegend 
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showLegend, setShowLegend] = useState(false);

  // Convert rooms to React Flow nodes
  const initialNodes: Node[] = rooms.map((room) => ({
    id: room.id,
    type: 'roomNode',
    position: { x: room.x, y: room.y },
    data: { 
      room,
      onRoomClick: setSelectedRoom,
    },
    draggable: false,
    selectable: true,
    style: {
      width: room.width,
      height: room.height,
    },
  }));

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="h-screen w-full bg-gray-100 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Floor Map - React Flow</h1>
            <p className="text-sm text-gray-600">Interactive 2D floor plan using React Flow</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Pan: Click + Drag | Zoom: Scroll
            </div>
            
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium md:hidden"
            >
              {showLegend ? 'Hide Legend' : 'Show Legend'}
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={`absolute top-20 right-4 z-10 transition-transform duration-300 ${showLegend ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <Legend 
          rooms={mockRooms} 
          showMobileLegend={showMobileLegend}
          setShowMobileLegend={setShowMobileLegend}
        />
      </div>

      {/* React Flow Canvas */}
      <div className="h-full w-full pt-20" style={{ background: '#f8fafc' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#e2e8f0" gap={20} />
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const room = node.data.room;
              switch (room.status) {
                case 'office': return '#bbf7d0';
                case 'forecast': return '#bfdbfe';
                case 'hoteling': return '#fef3c7';
                case 'vacant': return '#ffffff';
                case 'pending': return '#ffffff';
                default: return '#f3f4f6';
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-right"
          />
          
          {/* Building Structure Overlay */}
          <Panel position="top-left">
            <BuildingStructure />
          </Panel>
        </ReactFlow>
      </div>

      {/* Room Modal */}
      {selectedRoom && (
        <RoomModal room={selectedRoom} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default FloorMapReactFlow; 