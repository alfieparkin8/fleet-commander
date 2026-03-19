import { useState } from 'react';
import { motion } from 'framer-motion';
import TradingCard from '@/components/TradingCard';
import NavBar from '@/components/NavBar';
import WaveBackground from '@/components/WaveBackground';
import { useGameState } from '@/hooks/useGameState';
import { CardType } from '@/data/cards';

const filters: { label: string; value: CardType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🚢 Ships', value: 'ship' },
  { label: '⚓ Ports', value: 'port' },
  { label: '🌍 Countries', value: 'country' },
];

export default function CollectionPage() {
  const game = useGameState();
  const [filter, setFilter] = useState<CardType | 'all'>('all');

  const filtered = filter === 'all'
    ? game.collection
    : game.collection.filter(c => c.type === filter);

  // Count unique cards
  const uniqueIds = new Set(game.collection.map(c => c.id));

  return (
    <div className="min-h-screen">
      <WaveBackground />
      <NavBar coins={game.coins} />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-6xl text-center text-foreground mb-2"
        >
          Your Collection
        </motion.h1>
        <p className="text-center text-muted-foreground font-body mb-6">
          {uniqueIds.size} unique cards • {game.collection.length} total
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                filter === f.value
                  ? 'bg-wave text-primary-foreground font-bold'
                  : 'bg-ocean-deep/50 text-ocean-light hover:bg-ocean-mid/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">📦</span>
            <p className="font-heading text-4xl text-foreground mt-4">No cards yet!</p>
            <p className="font-body text-muted-foreground mt-2">Open some packs to start collecting.</p>
          </div>
        ) : (
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {filtered.map((card, i) => (
              <motion.div
                key={`${card.id}-${i}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
              >
                <TradingCard card={card} compact />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
