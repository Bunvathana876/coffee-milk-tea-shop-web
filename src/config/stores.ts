export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  status: 'open' | 'closed';
  pickupEstimate: string;
  features: string[];
}

export const STORES: StoreLocation[] = [
  {
    id: 'bkk1',
    name: 'BKK1 Flagship Store',
    address: '#42, Street 214, BKK1, Phnom Penh',
    hours: '7:00 AM – 9:00 PM',
    phone: '+855 23 999 888',
    status: 'open',
    pickupEstimate: '10–15 min pickup',
    features: ['Slow Bar Espresso', 'Artisanal Boba Lab', 'Patio Seating', 'Free Fiber WiFi'],
  },
  {
    id: 'toul-kork',
    name: 'Toul Kork Branch',
    address: '#18, Street 315, Toul Kork, Phnom Penh',
    hours: '7:30 AM – 8:30 PM',
    phone: '+855 23 999 777',
    status: 'open',
    pickupEstimate: '12–18 min pickup',
    features: ['Drive-Thru Window', 'Outdoor Garden', 'Quiet Workspaces'],
  },
  {
    id: 'riverside',
    name: 'Riverside Express',
    address: '#88, Sisowath Quay, Daun Penh, Phnom Penh',
    hours: '8:00 AM – 10:00 PM',
    phone: '+855 23 999 666',
    status: 'open',
    pickupEstimate: '8–12 min pickup',
    features: ['River View Deck', 'Quick Grab & Go', 'Late Night Brews'],
  },
];

