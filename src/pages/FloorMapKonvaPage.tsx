import React from 'react';
import FloorMapKonva from '../components/FloorMapKonva';

interface FloorMapKonvaPageProps {
  showMobileLegend: boolean;
  setShowMobileLegend: (show: boolean) => void;
}

const FloorMapKonvaPage: React.FC<FloorMapKonvaPageProps> = ({ 
  showMobileLegend, 
  setShowMobileLegend 
}) => {
  return (
    <FloorMapKonva 
      showMobileLegend={showMobileLegend}
      setShowMobileLegend={setShowMobileLegend}
    />
  );
};

export default FloorMapKonvaPage; 