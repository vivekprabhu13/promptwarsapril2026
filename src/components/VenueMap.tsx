import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MOCK_SECTIONS, Friend } from '@/mockData';
import { cn } from '@/lib/utils';
import { MapPin, Info, Coffee, Utensils, User } from 'lucide-react';

interface VenueConfig {
  name: string;
  latCenter: number;
  lngCenter: number;
  roads: {
    north: string;
    east: string;
    south: string;
    west: string;
  };
}

const VENUE_CONFIGS: Record<string, VenueConfig> = {
  'chinnaswamy': {
    name: 'Chinnaswamy Stadium',
    latCenter: 12.9788,
    lngCenter: 77.5996,
    roads: { north: 'CUBBON ROAD', east: 'QUEENS ROAD', south: 'M. G. ROAD', west: 'LINK ROAD' }
  },
  'bangalore': {
    name: 'Chinnaswamy Stadium',
    latCenter: 12.9788,
    lngCenter: 77.5996,
    roads: { north: 'CUBBON ROAD', east: 'QUEENS ROAD', south: 'M. G. ROAD', west: 'LINK ROAD' }
  },
  'narendra modi': {
    name: 'Narendra Modi Stadium',
    latCenter: 23.0919,
    lngCenter: 72.5975,
    roads: { north: 'ASHRAM ROAD', east: 'RIVERFRONT', south: 'S.P. RING RD', west: 'AIRPORT RD' }
  },
  'gujarat': {
    name: 'Narendra Modi Stadium',
    latCenter: 23.0919,
    lngCenter: 72.5975,
    roads: { north: 'ASHRAM ROAD', east: 'RIVERFRONT', south: 'S.P. RING RD', west: 'AIRPORT RD' }
  },
  'default': {
    name: 'Stadium Map',
    latCenter: 12.9788,
    lngCenter: 77.5996,
    roads: { north: 'NORTH GATEWAY', east: 'EAST AVENUE', south: 'SOUTH BOULEVARD', west: 'WEST ACCESS' }
  }
};

export function VenueMap({ targetSection, venue, friends = [] }: { targetSection?: string, venue?: string, friends?: Friend[] }) {
  const [userLocation, setUserLocation] = useState<{ x: number, y: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getVenueConfig = (v?: string): VenueConfig => {
    if (!v) return VENUE_CONFIGS.default;
    const lowerVenue = v.toLowerCase();
    for (const key in VENUE_CONFIGS) {
      if (lowerVenue.includes(key)) return VENUE_CONFIGS[key];
    }
    return VENUE_CONFIGS.default;
  };

  const config = getVenueConfig(venue);

  const sectionCoords: Record<string, { x: number, y: number }> = {
    'N-STAND': { x: 200, y: 75 },
    'H': { x: 290, y: 105 },
    'G': { x: 320, y: 200 },
    'M1-M4': { x: 290, y: 290 },
    'T STAND': { x: 200, y: 330 },
    'P2': { x: 200, y: 310 },
    'C': { x: 80, y: 200 },
    'D': { x: 135, y: 225 },
    'A': { x: 110, y: 100 },
    'B': { x: 140, y: 125 },
    'E': { x: 145, y: 180 },
    'Section 102': { x: 120, y: 120 },
    '102': { x: 120, y: 120 },
    'Gate 2': { x: 130, y: 355 },
    'Pavilion Bar': { x: 200, y: 65 },
    'Section A': { x: 110, y: 100 },
  };

  const targetCoords = targetSection ? (sectionCoords[targetSection] || sectionCoords[targetSection.replace('Section ', '')]) : null;

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const stadiumLatCenter = config.latCenter;
        const stadiumLngCenter = config.lngCenter;
        const latRange = 0.0025;
        const lngRange = 0.0025;

        // Dynamic mapping based on the active venue
        if (Math.abs(lat - stadiumLatCenter) < latRange && Math.abs(lng - stadiumLngCenter) < lngRange) {
          const x = 200 + ((lng - stadiumLngCenter) / lngRange) * 150;
          const y = 200 - ((lat - stadiumLatCenter) / latRange) * 150;
          setUserLocation({ x, y });
        } else {
          // Default/Demo pointer if outside range
          setUserLocation({ x: 120, y: 280 }); 
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(error.message);
        setUserLocation({ x: 120, y: 280 });
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="relative w-full aspect-square bg-[#0a0502] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      {/* Immersive Atmospheric gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3a1510_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_top,#C4121210_0%,transparent_100%)]" />
      </div>

      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="bg-white/5 border border-white/10 text-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
          {config.name}
        </div>
        {venue && !VENUE_CONFIGS[venue.toLowerCase()] && (
          <span className="text-[10px] text-muted-foreground ml-1">Live Venue Data</span>
        )}
      </div>

      <svg viewBox="0 0 400 400" className="w-full h-full relative z-0">
        {/* Roads and External Labels - Atmospheric style */}
        <text x="200" y="18" textAnchor="middle" fontSize="9" className="fill-white/20 font-mono tracking-[0.2em] uppercase">{config.roads.north}</text>
        <text x="18" y="200" textAnchor="middle" fontSize="9" className="fill-white/20 font-mono tracking-[0.2em] uppercase" transform="rotate(-90, 18, 200)">{config.roads.west}</text>
        <text x="200" y="388" textAnchor="middle" fontSize="9" className="fill-white/20 font-mono tracking-[0.2em] uppercase">{config.roads.south}</text>
        <text x="382" y="200" textAnchor="middle" fontSize="9" className="fill-white/20 font-mono tracking-[0.2em] uppercase" transform="rotate(90, 382, 200)">{config.roads.east}</text>

        {/* Stadium Boundary */}
        <circle cx="200" cy="200" r="170" fill="#3D100A" stroke="#4D150D" strokeWidth="1" />
        
        {/* Field */}
        <circle cx="200" cy="200" r="85" fill="#166534" stroke="#22c55e" strokeWidth="2" />
        
        {/* Pitch */}
        <rect x="192" y="165" width="16" height="70" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
        <text x="200" y="200" textAnchor="middle" fontSize="10" className="fill-amber-900 font-bold" transform="rotate(-90, 200, 200)">PITCH</text>

        {/* Sections */}
        {/* N-STAND (Top) */}
        <path d="M 160 45 A 155 155 0 0 1 240 45 L 225 95 A 105 105 0 0 0 175 95 Z" fill="#4D150D" />
        <text x="200" y="75" textAnchor="middle" fontSize="9" className="fill-muted-foreground font-bold">N-STAND</text>

        {/* H Stand (Top Right) */}
        <path d="M 250 50 A 155 155 0 0 1 340 140 L 280 160 A 105 105 0 0 0 235 100 Z" fill="#4D150D" />
        <text x="290" y="105" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-bold">H</text>

        {/* G Stand (Right) */}
        <path d="M 350 155 A 155 155 0 0 1 350 245 L 290 230 A 105 105 0 0 0 290 170 Z" fill="#4D150D" />
        <text x="320" y="200" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-bold">G</text>

        {/* M Sections (Bottom Right) */}
        <path d="M 340 260 A 155 155 0 0 1 260 350 L 240 295 A 105 105 0 0 0 285 240 Z" fill="#4D150D" />
        <text x="290" y="290" textAnchor="middle" fontSize="8" className="fill-muted-foreground font-bold">M1-M4</text>

        {/* T Stand (Bottom) */}
        <path d="M 150 350 A 155 155 0 0 0 250 350 L 235 300 A 105 105 0 0 1 165 300 Z" fill="#4D150D" />
        <text x="200" y="330" textAnchor="middle" fontSize="9" className="fill-muted-foreground font-bold">T STAND</text>

        {/* P2 Stand (Bottom Inner) */}
        <path d="M 160 325 A 130 130 0 0 0 240 325 L 230 290 A 100 100 0 0 1 170 290 Z" fill="#4D150D" />
        <text x="200" y="310" textAnchor="middle" fontSize="8" className="fill-muted-foreground font-bold">P2</text>

        {/* J Corporate (Bottom Outer) */}
        <path d="M 200 360 A 165 165 0 0 1 260 355" fill="none" stroke="#94a3b8" strokeWidth="10" />
        <text x="235" y="375" textAnchor="middle" fontSize="7" className="fill-slate-600 font-bold">J CORPORATE</text>

        {/* C Stand (Left) */}
        <path d="M 50 155 A 155 155 0 0 0 50 245 L 110 230 A 105 105 0 0 1 110 170 Z" fill="#4D150D" />
        <text x="80" y="200" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-bold">C</text>

        {/* A, B, E Sections (Top Left) */}
        <path d="M 60 140 A 155 155 0 0 1 150 50 L 170 100 A 105 105 0 0 0 115 160 Z" fill="#4D150D" />
        <text x="110" y="100" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-bold">A</text>
        <text x="140" y="125" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-bold">B</text>
        <text x="145" y="180" textAnchor="middle" fontSize="12" className="fill-muted-foreground font-bold">E</text>

        {/* Pavilions (Prominent) */}
        <rect x="175" y="45" width="50" height="15" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
        <text x="200" y="55" textAnchor="middle" fontSize="6" className="fill-amber-900 font-bold">MAIN PAVILION</text>
        
        <rect x="230" y="345" width="40" height="12" fill="#fef3c7" stroke="#d97706" strokeWidth="1" transform="rotate(-15, 250, 351)" />
        <text x="250" y="354" textAnchor="middle" fontSize="5" className="fill-amber-900 font-bold" transform="rotate(-15, 250, 351)">J PAVILION</text>

        {/* Restroom Blocks (Universal Person Icon) */}
        {/* r1: Restroom Block 102 */}
        <g transform="translate(120, 120)">
          <circle r="14" fill="#2B0B07" stroke="#7D0A07" strokeWidth="2" />
          <circle cx="0" cy="-5" r="2.5" fill="#7D0A07" />
          <path d="M -3 -1 L 3 -1 L 2 4 L -2 4 Z" fill="#7D0A07" />
          <path d="M -1.2 4 L -1.2 7 M 1.2 4 L 1.2 7" stroke="#7D0A07" strokeWidth="1.2" strokeLinecap="round" />
          <text y="24" textAnchor="middle" fontSize="7" className="fill-muted-foreground font-bold">Restroom</text>
          <text y="32" textAnchor="middle" fontSize="6" className="fill-muted-foreground/60">Block 102</text>
        </g>
        {/* r2: Restroom Block 205 */}
        <g transform="translate(320, 200)">
          <circle r="14" fill="#2B0B07" stroke="#7D0A07" strokeWidth="2" />
          <circle cx="0" cy="-5" r="2.5" fill="#7D0A07" />
          <path d="M -3 -1 L 3 -1 L 2 4 L -2 4 Z" fill="#7D0A07" />
          <path d="M -1.2 4 L -1.2 7 M 1.2 4 L 1.2 7" stroke="#7D0A07" strokeWidth="1.2" strokeLinecap="round" />
          <text y="24" textAnchor="middle" fontSize="7" className="fill-muted-foreground font-bold">Restroom</text>
          <text y="32" textAnchor="middle" fontSize="6" className="fill-muted-foreground/60">Block 205</text>
        </g>
        {/* r3: Restroom Gate 1 */}
        <g transform="translate(170, 350)">
          <circle r="14" fill="#2B0B07" stroke="#7D0A07" strokeWidth="2" />
          <circle cx="0" cy="-5" r="2.5" fill="#7D0A07" />
          <path d="M -3 -1 L 3 -1 L 2 4 L -2 4 Z" fill="#7D0A07" />
          <path d="M -1.2 4 L -1.2 7 M 1.2 4 L 1.2 7" stroke="#7D0A07" strokeWidth="1.2" strokeLinecap="round" />
          <text y="24" textAnchor="middle" fontSize="7" className="fill-muted-foreground font-bold">Restroom</text>
          <text y="32" textAnchor="middle" fontSize="6" className="fill-muted-foreground/60">Gate 1</text>
        </g>

        {/* Concessions (Universal Food/Drink Icons) */}
        {/* c1: Grandstand Concourse Food */}
        <g transform="translate(100, 150)">
          <circle r="14" fill="#2B0B07" stroke="#f97316" strokeWidth="2" />
          {/* Fork */}
          <path d="M -4.5 -6 L -4.5 -1 M -3 -6 L -3 -1 M -6 -6 L -6 -1 M -4.5 -1 L -4.5 6" stroke="#f97316" strokeWidth="1" strokeLinecap="round" />
          {/* Knife */}
          <path d="M 3 -6 L 3 6 M 3 -6 A 3 6 0 0 1 6 0 L 3 0" fill="#f97316" stroke="#f97316" strokeWidth="1" />
          <text y="24" textAnchor="middle" fontSize="7" className="fill-muted-foreground font-bold">Food</text>
          <text y="32" textAnchor="middle" fontSize="6" className="fill-muted-foreground/60">Grandstand</text>
        </g>
        {/* c2: East Stand Snacks */}
        <g transform="translate(70, 200)">
          <circle r="14" fill="#2B0B07" stroke="#f97316" strokeWidth="2" />
          {/* Fork */}
          <path d="M -4.5 -6 L -4.5 -1 M -3 -6 L -3 -1 M -6 -6 L -6 -1 M -4.5 -1 L -4.5 6" stroke="#f97316" strokeWidth="1" strokeLinecap="round" />
          {/* Knife */}
          <path d="M 3 -6 L 3 6 M 3 -6 A 3 6 0 0 1 6 0 L 3 0" fill="#f97316" stroke="#f97316" strokeWidth="1" />
          <text y="24" textAnchor="middle" fontSize="7" className="fill-muted-foreground font-bold">Snacks</text>
          <text y="32" textAnchor="middle" fontSize="6" className="fill-muted-foreground/60">East Stand</text>
        </g>
        {/* c3: Pavilion Bar */}
        <g transform="translate(200, 65)">
          <circle r="14" fill="#2B0B07" stroke="#f97316" strokeWidth="2" />
          {/* Martini Glass */}
          <path d="M -6 -6 L 6 -6 L 0 1 Z" fill="#f97316" />
          <path d="M 0 1 L 0 6 M -3 6 L 3 6" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" />
          <text y="-20" textAnchor="middle" fontSize="7" className="fill-muted-foreground font-bold">Bar</text>
          <text y="-28" textAnchor="middle" fontSize="6" className="fill-muted-foreground/60">Pavilion</text>
        </g>

        {/* Gates */}
        <rect x="185" y="25" width="30" height="15" fill="#1e3a8a" rx="2" />
        <text x="200" y="35" textAnchor="middle" fontSize="7" className="fill-white font-bold">G13</text>

        <rect x="10" y="170" width="30" height="15" fill="#166534" rx="2" transform="rotate(-90, 25, 177)" />
        <text x="25" y="177" textAnchor="middle" fontSize="7" className="fill-white font-bold" transform="rotate(-90, 25, 177)">G8</text>

        <rect x="50" y="280" width="30" height="15" fill="#0369a1" rx="2" transform="rotate(-45, 65, 287)" />
        <text x="65" y="287" textAnchor="middle" fontSize="7" className="fill-white font-bold" transform="rotate(-45, 65, 287)">G6</text>

        <rect x="115" y="345" width="30" height="15" fill="#991b1b" rx="2" />
        <text x="130" y="355" textAnchor="middle" fontSize="7" className="fill-white font-bold">G2</text>

        <rect x="155" y="360" width="30" height="15" fill="#d97706" rx="2" />
        <text x="170" y="370" textAnchor="middle" fontSize="7" className="fill-white font-bold">G1</text>

        {/* You Are Here Pointer */}
        {userLocation && (
          <motion.g 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="pointer-events-none"
          >
            <circle cx={userLocation.x} cy={userLocation.y} r="12" fill="#C41212" opacity="0.2">
              <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={userLocation.x} cy={userLocation.y} r="5" fill="#C41212" stroke="white" strokeWidth="2" />
            <text x={userLocation.x} y={userLocation.y - 12} textAnchor="middle" fontSize="10" className="fill-[#C41212] font-bold">You are here</text>
          </motion.g>
        )}

        {/* Target Section Marker */}
        {targetCoords && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pointer-events-none"
          >
            <circle cx={targetCoords.x} cy={targetCoords.y} r="15" fill="#E65124" opacity="0.3">
              <animate attributeName="r" values="15;25;15" dur="3s" repeatCount="indefinite" />
            </circle>
            <MapPin cx={targetCoords.x} cy={targetCoords.y} className="w-6 h-6 text-[#E65124]" style={{ transform: `translate(${targetCoords.x - 12}px, ${targetCoords.y - 24}px)` }} />
            <text x={targetCoords.x} y={targetCoords.y + 15} textAnchor="middle" fontSize="10" className="fill-[#E65124] font-bold">Your Seat</text>
          </motion.g>
        )}

        {/* Friend Markers */}
        {friends.map((friend) => {
          const coords = sectionCoords[friend.location];
          if (!coords) return null;
          return (
            <motion.g
              key={friend.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="pointer-events-none"
            >
              <circle cx={coords.x} cy={coords.y} r="8" fill="#3b82f6" opacity="0.4" />
              <circle cx={coords.x} cy={coords.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="1" />
              <text x={coords.x} y={coords.y - 10} textAnchor="middle" fontSize="8" className="fill-blue-400 font-bold">{friend.name}</text>
            </motion.g>
          );
        })}
      </svg>

      {locationError && (
        <div className="absolute top-4 right-4 bg-red-900/40 text-red-400 text-[10px] px-2 py-1 rounded-full border border-red-900/50 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>GPS: {locationError}</span>
        </div>
      )}
    </div>
  );
}
