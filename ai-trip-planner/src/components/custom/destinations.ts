export interface Destination {
  name: string;
  coord: string;
  query: string;
}

export const MARQUEE_ROW_1: Destination[] = [
  { name: 'Bali', coord: '8.5°S · INDONESIA', query: 'Ubud, Bali, Indonesia' },
  { name: 'Shenzhen', coord: '22.5°N · CHINA', query: 'Shenzhen, China' },
  { name: 'New York', coord: '40.7°N · USA', query: 'New York City, USA' },
  { name: 'Braşov', coord: '45.6°N · ROMANIA', query: 'Brașov, Romania' },
  { name: 'Maui', coord: '20.8°N · HAWAII', query: 'Maui, Hawaii' },
];

export const MARQUEE_ROW_2: Destination[] = [
  { name: 'Paris', coord: '48.8°N · FRANCE', query: 'Paris, France' },
  { name: 'Tokyo', coord: '35.7°N · JAPAN', query: 'Tokyo, Japan' },
  { name: 'Lisbon', coord: '38.7°N · PORTUGAL', query: 'Lisbon, Portugal' },
  { name: 'Reykjavík', coord: '64.1°N · ICELAND', query: 'Reykjavík, Iceland' },
  { name: 'Marrakech', coord: '31.6°N · MOROCCO', query: 'Marrakech, Morocco' },
];
