# Space Reserve - Interactive Floor Map POC

A React-based proof of concept for an interactive, color-coded floor map that works seamlessly on both desktop and mobile devices.

## Features

- **Interactive Floor Map**: Dynamic rendering of rooms using react-konva
- **Color-Coded Rooms**: Visual status indicators for different room types:
  - 🟢 **Office spaces** - Light green fill
  - 🔵 **Forecast provider spaces** - Light blue fill  
  - 🟡 **Hoteling spaces** - Light yellow fill
  - ⚪ **Vacant spaces** - White fill with green border
  - 🟠 **Pending Requests** - White fill with orange border
- **Zoom & Pan**: Smooth zooming and panning with react-zoom-pan-pinch
- **Mobile Responsive**: Touch-friendly with pinch-to-zoom support
- **Room Details**: Click/tap any room to view detailed information
- **Toggleable Legend**: Shows/hides on mobile devices via floating button
- **Accessibility**: Full keyboard navigation and screen reader support

## Technology Stack

- **React 18** with TypeScript
- **react-konva** for canvas-based room rendering
- **react-zoom-pan-pinch** for zoom and pan functionality
- **Tailwind CSS** for styling and responsive design
- **Modern UI/UX** with clean, intuitive interface

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd space-reserve-poc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Desktop
- **Scroll** to zoom in/out
- **Click and drag** to pan around the map
- **Click** on any room to view details
- **Legend** is always visible in the top-right corner

### Mobile
- **Pinch** to zoom in/out
- **Touch and drag** to pan around the map
- **Tap** on any room to view details
- **Tap the legend button** (top-right) to show/hide the legend

## Project Structure

```
src/
├── components/
│   ├── FloorMap.tsx          # Main map component with zoom/pan
│   ├── Legend.tsx            # Color-coded legend component
│   └── RoomModal.tsx         # Room details modal
├── data/
│   └── mockRooms.ts          # Mock room data
├── types/
│   └── Room.ts               # TypeScript interfaces
├── utils/
│   └── roomColors.ts         # Color utilities and constants
└── App.tsx                   # Main application component
```

## Customization

### Adding New Room Statuses
1. Update the `RoomStatus` type in `src/types/Room.ts`
2. Add color configuration in `src/utils/roomColors.ts`
3. Update the legend items array

### Modifying Room Data
Edit the `mockRooms` array in `src/data/mockRooms.ts` to add, remove, or modify rooms.

### Styling Changes
The project uses Tailwind CSS. Modify component classes or extend the Tailwind configuration in `tailwind.config.js`.

## Features in Detail

### Room Rendering
- Each room is rendered as a rectangle with rounded corners
- Room names and IDs are dynamically sized based on room dimensions
- Interactive hover states with cursor changes
- Accessibility attributes for screen readers

### Zoom & Pan Controls
- Minimum zoom: 30% (0.3x)
- Maximum zoom: 300% (3x)
- Smooth transitions and momentum scrolling
- Double-click to zoom in
- Pinch gestures on touch devices

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Touch-optimized interactions
- Adaptive legend visibility
- Context-aware help text

## Browser Support

- Chrome 80+
- Firefox 74+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a proof of concept. For production use, consider:
- Adding real data integration
- Implementing user authentication
- Adding room booking functionality  
- Performance optimizations for large floor plans
- Unit and integration tests

## License

This project is for demonstration purposes.
