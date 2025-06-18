import { RoomStatus, LegendItem } from '../types/Room';

export const getRoomColors = (status: RoomStatus) => {
  switch (status) {
    case 'office':
      return {
        fill: '#bbf7d0', // light green
        stroke: '#16a34a', // green border
        strokeWidth: 1,
      };
    case 'forecast':
      return {
        fill: '#bfdbfe', // light blue
        stroke: '#2563eb', // blue border
        strokeWidth: 1,
      };
    case 'hoteling':
      return {
        fill: '#fef3c7', // light yellow
        stroke: '#d97706', // yellow border
        strokeWidth: 1,
      };
    case 'vacant':
      return {
        fill: '#ffffff', // white fill
        stroke: '#16a34a', // green border
        strokeWidth: 3,
      };
    case 'pending':
      return {
        fill: '#ffffff', // white fill
        stroke: '#ea580c', // orange border
        strokeWidth: 3,
      };
    default:
      return {
        fill: '#f3f4f6', // gray
        stroke: '#6b7280',
        strokeWidth: 1,
      };
  }
};

export const legendItems: LegendItem[] = [
  {
    status: 'office',
    label: 'Office spaces',
    color: '#bbf7d0',
    borderColor: '#16a34a',
  },
  {
    status: 'forecast',
    label: 'Forecast provider spaces',
    color: '#bfdbfe',
    borderColor: '#2563eb',
  },
  {
    status: 'hoteling',
    label: 'Hoteling spaces',
    color: '#fef3c7',
    borderColor: '#d97706',
  },
  {
    status: 'vacant',
    label: 'Vacant spaces',
    color: '#ffffff',
    borderColor: '#16a34a',
  },
  {
    status: 'pending',
    label: 'Pending Requests',
    color: '#ffffff',
    borderColor: '#ea580c',
  },
]; 