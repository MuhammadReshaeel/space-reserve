import React from 'react';
import FloorMapSVG from '../components/FloorMapSVG';
import { mockRooms } from '../data/mockRooms';

interface FloorMapSVGPageProps {
  showMobileLegend?: boolean;
  setShowMobileLegend?: (show: boolean) => void;
}

const FloorMapSVGPage: React.FC<FloorMapSVGPageProps> = ({ 
  showMobileLegend, 
  setShowMobileLegend 
}) => {
  return (
    <FloorMapSVG 
      rooms={mockRooms}
      showMobileLegend={showMobileLegend}
      setShowMobileLegend={setShowMobileLegend}
      svgFileName="OR045101S.svg"
    />
  );
};

export default FloorMapSVGPage; 