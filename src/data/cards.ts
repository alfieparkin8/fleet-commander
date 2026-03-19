export type CardType = 'ship' | 'port' | 'country';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CardStats {
  stat1: number; // Ships: Passenger Capacity / Ports: Daily Traffic / Countries: Coastline (km)
  stat2: number; // Ships: Gross Tonnage / Ports: Berths / Countries: Cruise Ports
  stat3: number; // Ships: Speed (knots) / Ports: Year Established / Countries: Tourism Score
  stat4: number; // Ships: Year Built / Ports: Rating / Countries: GDP per capita (k)
}

export interface GameCard {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  image: string;
  stats: CardStats;
  description: string;
  statLabels: [string, string, string, string];
}

const shipEmojis = ['🚢', '⛴️', '🛳️', '🚤', '⛵'];
const portEmojis = ['⚓', '🏖️', '🌊', '🏝️', '🌅'];
const countryEmojis = ['🇮🇹', '🇬🇷', '🇪🇸', '🇭🇷', '🇳🇴', '🇬🇧', '🇫🇷', '🇺🇸', '🇯🇵', '🇦🇺'];

export const allCards: GameCard[] = [
  // SHIPS
  { id: 'ship-1', name: 'Queen Mary 2', type: 'ship', rarity: 'legendary', image: '🚢', stats: { stat1: 2691, stat2: 148528, stat3: 30, stat4: 2004 }, description: 'The grandest ocean liner afloat, a true icon of Cunard.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-2', name: 'Queen Anne', type: 'ship', rarity: 'legendary', image: '🛳️', stats: { stat1: 2996, stat2: 113000, stat3: 23, stat4: 2024 }, description: 'Cunard\'s newest ship, blending tradition with modern luxury.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-3', name: 'Queen Victoria', type: 'ship', rarity: 'epic', image: '⛴️', stats: { stat1: 2061, stat2: 90049, stat3: 23, stat4: 2007 }, description: 'Elegant Cunard vessel with classic ocean liner style.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-4', name: 'Queen Elizabeth', type: 'ship', rarity: 'epic', image: '🚢', stats: { stat1: 2081, stat2: 90900, stat3: 23, stat4: 2010 }, description: 'Named by Her Majesty, a jewel of the Cunard fleet.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-5', name: 'Sky Princess', type: 'ship', rarity: 'rare', image: '🛳️', stats: { stat1: 3660, stat2: 145000, stat3: 22, stat4: 2019 }, description: 'Princess Cruises\' stunning MedallionClass ship.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-6', name: 'Celebrity Apex', type: 'ship', rarity: 'rare', image: '⛴️', stats: { stat1: 2910, stat2: 129500, stat3: 22, stat4: 2020 }, description: 'Modern luxury with the Magic Carpet experience.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-7', name: 'Bolette', type: 'ship', rarity: 'common', image: '🚢', stats: { stat1: 1380, stat2: 63524, stat3: 21, stat4: 2000 }, description: 'Fred. Olsen\'s charming mid-sized exploration ship.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-8', name: 'Anthem of the Seas', type: 'ship', rarity: 'epic', image: '🛳️', stats: { stat1: 4905, stat2: 168666, stat3: 22, stat4: 2015 }, description: 'Royal Caribbean\'s Quantum-class adventure ship.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-9', name: 'MSC Virtuosa', type: 'ship', rarity: 'rare', image: '⛴️', stats: { stat1: 4842, stat2: 181541, stat3: 22, stat4: 2021 }, description: 'MSC\'s spectacular entertainment-focused vessel.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-10', name: 'Icon of the Seas', type: 'ship', rarity: 'legendary', image: '🚢', stats: { stat1: 5610, stat2: 250800, stat3: 22, stat4: 2024 }, description: 'The world\'s largest cruise ship, a floating city.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-11', name: 'Norwegian Prima', type: 'ship', rarity: 'rare', image: '🛳️', stats: { stat1: 3215, stat2: 142500, stat3: 21, stat4: 2022 }, description: 'NCL\'s innovative Prima class with The Drop slide.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },
  { id: 'ship-12', name: 'Marella Explorer', type: 'ship', rarity: 'common', image: '⛴️', stats: { stat1: 1924, stat2: 76998, stat3: 20, stat4: 1996 }, description: 'A favourite for British holidaymakers at sea.', statLabels: ['Passengers', 'Gross Tons', 'Speed (kn)', 'Year Built'] },

  // PORTS
  { id: 'port-1', name: 'Southampton', type: 'port', rarity: 'legendary', image: '⚓', stats: { stat1: 2000000, stat2: 5, stat3: 1843, stat4: 95 }, description: 'The UK\'s premier cruise port and home of Cunard.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-2', name: 'Barcelona', type: 'port', rarity: 'epic', image: '🏖️', stats: { stat1: 3500000, stat2: 9, stat3: 1900, stat4: 92 }, description: 'Mediterranean\'s busiest cruise port with Gaudí charm.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-3', name: 'Cádiz', type: 'port', rarity: 'rare', image: '🌅', stats: { stat1: 400000, stat2: 2, stat3: 1600, stat4: 88 }, description: 'Ancient Andalusian port with rich history and tapas.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-4', name: 'Civitavecchia', type: 'port', rarity: 'epic', image: '⚓', stats: { stat1: 2800000, stat2: 6, stat3: 1612, stat4: 85 }, description: 'Gateway to Rome and the wonders of Italy.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-5', name: 'Dubrovnik', type: 'port', rarity: 'rare', image: '🏝️', stats: { stat1: 750000, stat2: 3, stat3: 1400, stat4: 93 }, description: 'The Pearl of the Adriatic, a Game of Thrones icon.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-6', name: 'Bergen', type: 'port', rarity: 'rare', image: '🌊', stats: { stat1: 600000, stat2: 3, stat3: 1070, stat4: 94 }, description: 'Gateway to the Norwegian fjords, UNESCO heritage.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-7', name: 'Miami', type: 'port', rarity: 'legendary', image: '🏖️', stats: { stat1: 7000000, stat2: 12, stat3: 1896, stat4: 90 }, description: 'The cruise capital of the world.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-8', name: 'Santorini', type: 'port', rarity: 'epic', image: '🏝️', stats: { stat1: 800000, stat2: 0, stat3: 1500, stat4: 97 }, description: 'Stunning caldera views, tender port paradise.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-9', name: 'Alicante', type: 'port', rarity: 'common', image: '🌅', stats: { stat1: 200000, stat2: 2, stat3: 1700, stat4: 82 }, description: 'Sun-drenched Spanish port on the Costa Blanca.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },
  { id: 'port-10', name: 'Lisbon', type: 'port', rarity: 'epic', image: '⚓', stats: { stat1: 1100000, stat2: 4, stat3: 1500, stat4: 91 }, description: 'Portugal\'s capital with stunning river views.', statLabels: ['Annual Pax', 'Berths', 'Est. Year', 'Rating'] },

  // COUNTRIES
  { id: 'country-1', name: 'Italy', type: 'country', rarity: 'epic', image: '🇮🇹', stats: { stat1: 7600, stat2: 45, stat3: 95, stat4: 34 }, description: 'The heart of Mediterranean cruising culture.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-2', name: 'Greece', type: 'country', rarity: 'epic', image: '🇬🇷', stats: { stat1: 13676, stat2: 38, stat3: 93, stat4: 20 }, description: 'Island-hopping paradise with ancient wonders.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-3', name: 'Spain', type: 'country', rarity: 'rare', image: '🇪🇸', stats: { stat1: 4964, stat2: 30, stat3: 92, stat4: 30 }, description: 'From Barcelona to the Canaries, endless cruising.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-4', name: 'Croatia', type: 'country', rarity: 'rare', image: '🇭🇷', stats: { stat1: 5835, stat2: 12, stat3: 88, stat4: 18 }, description: 'Adriatic jewel with stunning coastline.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-5', name: 'Norway', type: 'country', rarity: 'rare', image: '🇳🇴', stats: { stat1: 25148, stat2: 35, stat3: 90, stat4: 82 }, description: 'Fjords, northern lights, and Viking heritage.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-6', name: 'United Kingdom', type: 'country', rarity: 'rare', image: '🇬🇧', stats: { stat1: 12429, stat2: 20, stat3: 85, stat4: 46 }, description: 'Home of Cunard and maritime tradition.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-7', name: 'France', type: 'country', rarity: 'rare', image: '🇫🇷', stats: { stat1: 4853, stat2: 25, stat3: 94, stat4: 42 }, description: 'From Marseille to Le Havre, cruise elegance.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
  { id: 'country-8', name: 'USA', type: 'country', rarity: 'legendary', image: '🇺🇸', stats: { stat1: 19924, stat2: 60, stat3: 88, stat4: 76 }, description: 'The world\'s biggest cruise market.', statLabels: ['Coastline km', 'Cruise Ports', 'Tourism ★', 'GDP/Cap (k)'] },
];

export const rarityColors: Record<Rarity, string> = {
  common: 'bg-muted text-muted-foreground',
  rare: 'bg-wave/20 text-wave',
  epic: 'bg-purple-500/20 text-purple-400',
  legendary: 'bg-gold/20 text-gold',
};

export const rarityBorderColors: Record<Rarity, string> = {
  common: 'border-muted-foreground/30',
  rare: 'border-wave/50',
  epic: 'border-purple-400/50',
  legendary: 'border-gold/50',
};

export function getRandomCards(count: number): GameCard[] {
  const cards: GameCard[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let pool: GameCard[];
    if (roll < 0.5) pool = allCards.filter(c => c.rarity === 'common');
    else if (roll < 0.8) pool = allCards.filter(c => c.rarity === 'rare');
    else if (roll < 0.95) pool = allCards.filter(c => c.rarity === 'epic');
    else pool = allCards.filter(c => c.rarity === 'legendary');
    if (pool.length === 0) pool = allCards;
    cards.push({ ...pool[Math.floor(Math.random() * pool.length)] });
  }
  return cards;
}
