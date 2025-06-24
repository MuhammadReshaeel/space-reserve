import React, { useState } from 'react';
import FloorMapMobile from '../components/FloorMapMobile';
import BottomNavigation from '../components/BottomNavigation';
import CalendarView from '../components/CalendarView';

type BookingType = 'workspace' | 'conference' | null;

const RoomReservationsMobile: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'form' | 'floormap' | 'calendar'>('home');
  const [selectedBookingType, setSelectedBookingType] = useState<BookingType>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState('Walnut Creek Medical Center');
  const [currentTab, setCurrentTab] = useState<'home' | 'book-room' | 'calendar' | 'settings'>('home');
  
  const [formData, setFormData] = useState({
    requestDate: '',
    requestForMe: true,
    requestedFor: '',
    timeSlot: 'all-day',
    building: '',
    floor: '',
    room: ''
  });

  const handleBookWorkspace = () => {
    setSelectedBookingType('workspace');
    setCurrentView('form');
    setCurrentTab('book-room');
  };

  const handleBookConference = () => {
    setSelectedBookingType('conference');
    setCurrentView('form');
    setCurrentTab('book-room');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedBookingType(null);
    setCurrentTab('home');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleLocationChange = (location: string) => {
    setUserLocation(location);
    setShowLocationModal(false);
  };

  const handleRoomSelect = (roomId: string, roomName: string) => {
    setFormData(prev => ({
      ...prev,
      room: roomName
    }));
    setCurrentView('form');
  };

  const handleFloorMapBack = () => {
    setCurrentView('form');
  };

  const handleTabChange = (tab: 'home' | 'book-room' | 'calendar' | 'settings') => {
    setCurrentTab(tab);
    
    switch (tab) {
      case 'home':
        setCurrentView('home');
        setSelectedBookingType(null);
        break;
      case 'book-room':
        // Stay on current view if already in booking flow
        if (currentView === 'home') {
          // Show booking options or stay on home
        }
        break;
      case 'calendar':
        setCurrentView('calendar');
        setSelectedBookingType(null);
        break;
      case 'settings':
        // Settings will be handled by onSettingsClick
        break;
    }
  };

  const buildings = [
    'Walnut Creek Medical Center',
    'Oakland Medical Center',
    'San Francisco Medical Center',
    'San Jose Medical Center'
  ];

  const userLocations = [
    {
      name: 'Walnut Creek Medical Center',
      address: '1425 South Main Street, Walnut Creek, CA 94596',
      type: 'Medical Center'
    },
    {
      name: 'Oakland Medical Center',
      address: '3600 Broadway, Oakland, CA 94611',
      type: 'Medical Center'
    },
    {
      name: 'San Francisco Medical Center',
      address: '2425 Geary Boulevard, San Francisco, CA 94115',
      type: 'Medical Center'
    },
    {
      name: 'San Jose Medical Center',
      address: '250 Hospital Parkway, San Jose, CA 95119',
      type: 'Medical Center'
    },
    {
      name: 'Remote Work',
      address: 'Working from home',
      type: 'Remote'
    }
  ];

  const floors = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5'];
  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105', 'Room 106'];

  // Location Modal Component
  const LocationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Select Your Location</h3>
              <p className="text-blue-100 text-sm">Choose your current work location</p>
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {userLocations.map((location) => (
              <button
                key={location.name}
                onClick={() => handleLocationChange(location.name)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  userLocation === location.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    location.type === 'Remote' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{location.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      location.type === 'Remote' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {location.type}
                    </span>
                  </div>
                  {userLocation === location.name && (
                    <div className="text-blue-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView === 'floormap') {
    return (
      <FloorMapMobile
        onRoomSelect={handleRoomSelect}
        onBack={handleFloorMapBack}
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSettingsClick={() => setShowLocationModal(true)}
      />
    );
  }

  if (currentView === 'calendar') {
    return (
      <>
        <CalendarView />
        <BottomNavigation 
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onSettingsClick={() => setShowLocationModal(true)}
        />
        {showLocationModal && <LocationModal />}
      </>
    );
  }

  if (currentView === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col">
        {/* Header */}
        <header className="bg-blue-500 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-wide font-medium">Kaiser Permanente</p>
                    <h1 className="text-lg font-bold text-white">New Request</h1>
                  </div>
                </div>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">Joe Yun</p>
                  <svg className="w-4 h-4 text-blue-200 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-20 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Book {selectedBookingType === 'workspace' ? 'Workspace' : 'Conference Room'}
              </h2>
              <p className="text-gray-600">Fill out the details for your reservation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Request Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Request Date*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => handleInputChange('requestDate', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Request is for Me Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="requestForMe"
                  checked={formData.requestForMe}
                  onChange={(e) => handleInputChange('requestForMe', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-50 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="requestForMe" className="text-sm font-medium text-gray-700">
                  Request is for Me
                </label>
              </div>

              {/* Requested For */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Requested For*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.requestedFor}
                    onChange={(e) => handleInputChange('requestedFor', e.target.value)}
                    placeholder="[Enter NUID, Last or First Name]"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder-gray-400"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Time Preference
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="all-day"
                      checked={formData.timeSlot === 'all-day'}
                      onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-50 border-gray-200 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">All Day</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="morning"
                      checked={formData.timeSlot === 'morning'}
                      onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-50 border-gray-200 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Morning 8a-12p</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="timeSlot"
                      value="afternoon"
                      checked={formData.timeSlot === 'afternoon'}
                      onChange={(e) => handleInputChange('timeSlot', e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-50 border-gray-200 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Afternoon 12p-5p</span>
                  </label>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                <h3 className="text-lg font-bold text-blue-800 mb-3">Location</h3>
                
                {/* Building */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Building*
                  </label>
                  <div className="relative">
                    <select
                      value={formData.building}
                      onChange={(e) => handleInputChange('building', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                      required
                    >
                      <option value="">Select Building</option>
                      {buildings.map((building) => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floor */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Floor*
                  </label>
                  <div className="relative">
                    <select
                      value={formData.floor}
                      onChange={(e) => handleInputChange('floor', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
                      required
                      disabled={!formData.building}
                    >
                      <option value="">Select Floor</option>
                      {floors.map((floor) => (
                        <option key={floor} value={floor}>{floor}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Room */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Room*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.room}
                      placeholder="Select from floor plan"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      readOnly
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentView('floormap')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Request
              </button>
            </form>
          </div>
        </main>



        {/* Location Modal */}
        {showLocationModal && <LocationModal />}

        {/* Global Sticky Bottom Navigation */}
        <BottomNavigation 
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onSettingsClick={() => setShowLocationModal(true)}
        />
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col">
      {/* Header */}
      <header className="bg-blue-500 shadow-lg">
        <div className="px-4 py-4">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-blue-100 uppercase tracking-wide font-medium">Kaiser Permanente</p>
                <h1 className="text-lg font-bold text-white">Room Reservations</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

              {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-20">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Joe</h2>
            <p className="text-blue-100">Ready to book your space?</p>
            <p className="text-blue-200 text-sm mt-1">📍 {userLocation}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-white">
              <p className="text-sm font-medium">Joe Yun</p>
              <svg className="w-4 h-4 text-blue-200 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Booking Options */}
        <div className="space-y-4">
          {/* Book Workspace */}
          <button
            onClick={handleBookWorkspace}
            className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-16 h-10 bg-amber-600 rounded-t-lg relative">
                    <div className="absolute top-0 left-2 w-8 h-6 bg-gray-800 rounded-sm">
                      <div className="w-6 h-4 bg-blue-400 rounded-sm mt-1 mx-auto"></div>
                    </div>
                    <div className="absolute top-1 right-1 w-3 h-4 bg-white rounded-sm shadow-sm"></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-green-500 rounded-lg"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Book Workspace</h3>
              <p className="text-gray-600 text-sm">Reserve a personal workspace for focused work</p>
            </div>
          </button>

          {/* Book Conference */}
          <button
            onClick={handleBookConference}
            className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-16 h-8 bg-amber-700 rounded-lg relative">
                    <div className="absolute -top-2 left-1 w-3 h-3 bg-red-500 rounded"></div>
                    <div className="absolute -top-2 right-1 w-3 h-3 bg-red-500 rounded"></div>
                    <div className="absolute -bottom-2 left-1 w-3 h-3 bg-red-500 rounded"></div>
                    <div className="absolute -bottom-2 right-1 w-3 h-3 bg-red-500 rounded"></div>
                    <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded"></div>
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Book Conference</h3>
              <p className="text-gray-600 text-sm">Reserve a meeting room for team collaboration</p>
            </div>
          </button>
        </div>
      </main>



      {/* Location Modal */}
      {showLocationModal && <LocationModal />}

      {/* Global Sticky Bottom Navigation */}
      <BottomNavigation 
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onSettingsClick={() => setShowLocationModal(true)}
      />
    </div>
  );
};

export default RoomReservationsMobile; 