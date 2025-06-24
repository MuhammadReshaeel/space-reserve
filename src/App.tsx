import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomReservationsMobile from './pages/RoomReservationsMobile';
import SpaceReserveDesktop from './pages/SpaceReserveDesktop';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomReservationsMobile />} />
        <Route path="/space-reserve-desktop" element={<SpaceReserveDesktop />} />
      </Routes>
    </Router>
  );
};

export default App;
