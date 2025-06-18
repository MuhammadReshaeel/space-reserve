import React from 'react';
import FloorMapReactFlow from '../components/FloorMapReactFlow';

interface FloorMapThreeJSPageProps {
  showMobileLegend: boolean;
  setShowMobileLegend: (show: boolean) => void;
}

const FloorMapThreeJSPage: React.FC<FloorMapThreeJSPageProps> = ({ 
  showMobileLegend, 
  setShowMobileLegend 
}) => {
  return (
    <FloorMapReactFlow 
      showMobileLegend={showMobileLegend}
      setShowMobileLegend={setShowMobileLegend}
    />
  );
};

export default FloorMapThreeJSPage; 