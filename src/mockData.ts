export interface VenueSection {
  id: string;
  name: string;
  density: number; // 0 to 1
  waitTime: number; // minutes
  type: 'concession' | 'restroom' | 'gate' | 'seating';
}

export const MOCK_SECTIONS: VenueSection[] = [
  { id: 'g1', name: 'Gate 1', density: 0.8, waitTime: 12, type: 'gate' },
  { id: 'g2', name: 'Gate 2', density: 0.4, waitTime: 5, type: 'gate' },
  { id: 'g6', name: 'Gate 6', density: 0.6, waitTime: 8, type: 'gate' },
  { id: 'g8', name: 'Gate 8', density: 0.3, waitTime: 2, type: 'gate' },
  { id: 'g13', name: 'Gate 13', density: 0.5, waitTime: 7, type: 'gate' },
  { id: 's_a', name: 'Section A', density: 0.7, waitTime: 0, type: 'seating' },
  { id: 's_b', name: 'Section B', density: 0.8, waitTime: 0, type: 'seating' },
  { id: 's_c', name: 'Section C (Green)', density: 0.9, waitTime: 0, type: 'seating' },
  { id: 's_d', name: 'Section D (Blue)', density: 0.6, waitTime: 0, type: 'seating' },
  { id: 's_e', name: 'Section E', density: 0.5, waitTime: 0, type: 'seating' },
  { id: 's_g', name: 'Section G', density: 0.85, waitTime: 0, type: 'seating' },
  { id: 's_h', name: 'Section H', density: 0.75, waitTime: 0, type: 'seating' },
  { id: 's_j', name: 'J Corporate', density: 0.4, waitTime: 0, type: 'seating' },
  { id: 's_n', name: 'N-Stand (Blue)', density: 0.95, waitTime: 0, type: 'seating' },
  { id: 's_p1', name: 'Section P1', density: 0.8, waitTime: 0, type: 'seating' },
  { id: 's_p2', name: 'Section P2 (Orange)', density: 0.9, waitTime: 0, type: 'seating' },
  { id: 's_p3', name: 'Section P3', density: 0.7, waitTime: 0, type: 'seating' },
  { id: 's_p4', name: 'Section P4', density: 0.6, waitTime: 0, type: 'seating' },
  { id: 's_t', name: 'T Stand (Red)', density: 0.98, waitTime: 0, type: 'seating' },
  { id: 's_m1', name: 'Section M1', density: 0.5, waitTime: 0, type: 'seating' },
  { id: 's_m2', name: 'Section M2', density: 0.6, waitTime: 0, type: 'seating' },
  { id: 's_m3', name: 'Section M3', density: 0.5, waitTime: 0, type: 'seating' },
  { id: 's_m4', name: 'Section M4', density: 0.4, waitTime: 0, type: 'seating' },
  // Concessions & Restrooms
  { id: 'c1', name: 'Grandstand Concourse Food', density: 0.85, waitTime: 18, type: 'concession' },
  { id: 'c2', name: 'East Stand Snacks', density: 0.4, waitTime: 4, type: 'concession' },
  { id: 'c3', name: 'Pavilion Bar', density: 0.6, waitTime: 10, type: 'concession' },
  { id: 'r1', name: 'Restroom Block 102', density: 0.75, waitTime: 12, type: 'restroom' },
  { id: 'r2', name: 'Restroom Block 205', density: 0.2, waitTime: 1, type: 'restroom' },
  { id: 'r3', name: 'Restroom Gate 1', density: 0.5, waitTime: 6, type: 'restroom' },
];

export const EVENT_INFO = {
  title: 'RCB vs MI - IPL 2026',
  venue: 'Chinnaswamy Stadium, Bengaluru',
  startTime: '2026-04-14T19:30:00Z',
  status: 'Toss in 15m',
};

export interface Friend {
  id: string;
  name: string;
  location: string;
  status: string;
  avatar: string;
}

export const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Alice', location: 'Section A', status: 'In Seat', avatar: 'https://picsum.photos/seed/alice/100' },
  { id: '2', name: 'Bob', location: 'Gate 2', status: 'Entering', avatar: 'https://picsum.photos/seed/bob/100' },
  { id: '3', name: 'Charlie', location: 'Pavilion Bar', status: 'Buying Food', avatar: 'https://picsum.photos/seed/charlie/100' },
];
