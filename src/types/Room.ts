export type RoomStatus = 'office' | 'forecast' | 'hoteling' | 'vacant' | 'pending';

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: RoomStatus;
}

export interface LegendItem {
  status: RoomStatus;
  label: string;
  color: string;
  borderColor?: string;
} 