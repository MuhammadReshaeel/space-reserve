import { Room } from '../types/Room';

export const mockRooms: Room[] = [
  // LOBBY - Main entrance area
  { id: 'LB001', name: 'Main Lobby', x: 60, y: 80, width: 200, height: 120, status: 'office' },
  
  // Left Wing - Office cluster
  { id: 'OF101', name: 'Executive Office', x: 60, y: 220, width: 120, height: 80, status: 'office' },
  { id: 'OF102', name: 'Manager Office', x: 60, y: 320, width: 80, height: 70, status: 'office' },
  { id: 'OF103', name: 'Senior Office', x: 160, y: 320, width: 80, height: 70, status: 'office' },
  { id: 'OF104', name: 'Team Office', x: 60, y: 410, width: 120, height: 80, status: 'office' },
  
  // Reception and waiting area
  { id: 'RC001', name: 'Reception', x: 280, y: 80, width: 100, height: 60, status: 'office' },
  { id: 'WT001', name: 'Waiting Area', x: 280, y: 160, width: 100, height: 60, status: 'office' },
  
  // Central Conference Rooms
  { id: 'CF101', name: 'Conference A', x: 280, y: 240, width: 120, height: 90, status: 'office' },
  { id: 'CF102', name: 'Conference B', x: 280, y: 350, width: 120, height: 90, status: 'office' },
  { id: 'CF103', name: 'Meeting Room', x: 280, y: 460, width: 120, height: 80, status: 'office' },
  
  // Forecast Zone - Central area
  { id: 'FC201', name: 'Forecast Hub 1', x: 420, y: 80, width: 110, height: 80, status: 'forecast' },
  { id: 'FC202', name: 'Forecast Hub 2', x: 550, y: 80, width: 110, height: 80, status: 'forecast' },
  { id: 'FC203', name: 'Forecast Center', x: 420, y: 180, width: 140, height: 100, status: 'forecast' },
  
  // Hoteling Stations
  { id: 'HT301', name: 'Hot Desk A', x: 420, y: 300, width: 80, height: 60, status: 'hoteling' },
  { id: 'HT302', name: 'Hot Desk B', x: 520, y: 300, width: 80, height: 60, status: 'hoteling' },
  { id: 'HT303', name: 'Hot Desk C', x: 420, y: 380, width: 80, height: 60, status: 'hoteling' },
  { id: 'HT304', name: 'Hot Desk D', x: 520, y: 380, width: 80, height: 60, status: 'hoteling' },
  
  // Corner Room with L-shape (matching your image)
  { id: 'CR001', name: 'Corner Office L1', x: 420, y: 460, width: 90, height: 80, status: 'office' },
  { id: 'CR002', name: 'Corner Office L2', x: 530, y: 460, width: 70, height: 50, status: 'office' },
  
  // Right Wing - Mixed use
  { id: 'VT401', name: 'Available Suite', x: 680, y: 80, width: 120, height: 100, status: 'vacant' },
  { id: 'VT402', name: 'Vacant Office', x: 680, y: 200, width: 90, height: 80, status: 'vacant' },
  { id: 'OF201', name: 'Private Office 1', x: 790, y: 200, width: 80, height: 80, status: 'office' },
  
  // Pending Approval Area
  { id: 'PN501', name: 'Pending Suite A', x: 680, y: 300, width: 100, height: 90, status: 'pending' },
  { id: 'PN502', name: 'Pending Suite B', x: 800, y: 300, width: 100, height: 90, status: 'pending' },
  
  // Corner Rooms with angled layout (matching architectural style)
  { id: 'CR003', name: 'Corner Unit 1', x: 680, y: 410, width: 70, height: 60, status: 'forecast' },
  { id: 'CR004', name: 'Corner Unit 2', x: 770, y: 410, width: 60, height: 70, status: 'forecast' },
  { id: 'CR005', name: 'Corner Extension', x: 680, y: 490, width: 90, height: 50, status: 'hoteling' },
  
  // Far Right Wing
  { id: 'OF301', name: 'End Office 1', x: 920, y: 80, width: 100, height: 80, status: 'office' },
  { id: 'OF302', name: 'End Office 2', x: 920, y: 180, width: 100, height: 80, status: 'office' },
  { id: 'VT403', name: 'End Vacant', x: 920, y: 280, width: 100, height: 80, status: 'vacant' },
  { id: 'PN503', name: 'End Pending', x: 920, y: 380, width: 100, height: 80, status: 'pending' },
  { id: 'HT305', name: 'End Hoteling', x: 920, y: 480, width: 100, height: 60, status: 'hoteling' },
  
  // Utility and Support Rooms
  { id: 'UT001', name: 'Storage', x: 60, y: 510, width: 60, height: 40, status: 'vacant' },
  { id: 'UT002', name: 'Copy Room', x: 140, y: 510, width: 60, height: 40, status: 'office' },
  { id: 'UT003', name: 'Break Room', x: 220, y: 510, width: 80, height: 40, status: 'office' },
  
  // Additional corner configurations
  { id: 'CR006', name: 'Corner Complex', x: 850, y: 410, width: 60, height: 90, status: 'pending' },
  { id: 'CR007', name: 'Corner Annex', x: 850, y: 510, width: 90, height: 40, status: 'hoteling' },
];