export type RoomStatus = 'office' | 'forecast' | 'hoteling' | 'vacant' | 'pending' | 'available';

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: RoomStatus;
  capacity?: number;
  equipment?: string[];
  description?: string;
}

export interface LegendItem {
  status: RoomStatus;
  label: string;
  color: string;
  borderColor?: string;
} 