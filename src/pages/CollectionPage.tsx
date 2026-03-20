import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TradingCard from '@/components/TradingCard';
import NavBar from '@/components/NavBar';
import WaveBackground from '@/components/WaveBackground';
import { useGameState } from '@/hooks/useGameState';
import { CardType, GameCard, rarityBorderColors, rarityColors } from '@/data/cards';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const filters: { label: string; value: CardType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🚢 Ships', value: 'ship' },
  { label: '⚓ Ports', value: 'port' },
  { label: '🌍 Countries', value: 'country' },
];

export default function CollectionPage() {
  const game = useGameState();
  const [filter, setFilter] = useState<CardType | 'all'>('all');
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);

  const filtered = filter === 'all'
    ? game.collection
    : game.collection.filter(c => c.type === filter);

  // Group the cards to find duplicates and unique ones
  const { uniqueCards, cardCounts } = useMemo(() => {
    const counts = new Map<string, number>();
    const uniques: GameCard[] = [];
    
    filtered.forEach(card => {
      if (!counts.has(card.id)) {
        counts.set(card.id, 1);
        uniques.push(card);
      } else {
        counts.set(card.id, counts.get(card.id)! + 1);
      }
    });

    return { uniqueCards: uniques, cardCounts: counts };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <WaveBackground />
      <NavBar />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-6xl text-center text-foreground mb-2"
        >
          Your Collection
        </motion.h1>
        <p className="text-center text-muted-foreground font-body mb-6">
          {uniqueCards.length} unique cards • {game.collection.length} total
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                filter === f.value
                  ? 'bg-wave text-primary-foreground font-bold shadow-lg shadow-wave/20'
                  : 'bg-ocean-deep/50 text-ocean-light hover:bg-ocean-mid/50 border border-ocean-mid/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {uniqueCards.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">📦</span>
            <p className="font-heading text-4xl text-foreground mt-4">No cards yet!</p>
            <p className="font-body text-muted-foreground mt-2">Open some packs to start collecting.</p>
          </div>
        ) : (
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {uniqueCards.map((card, i) => {
              const count = cardCounts.get(card.id) || 1;
              
              return (
                <motion.div
                  key={`${card.id}-${i}`}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  onClick={() => setSelectedCard(card)}
                >
                  {/* Premium Larger Card Tile */}
                  <div className={cn(
                    "w-44 h-64 bg-gradient-to-b from-[#112240] to-ocean-deep border-[3px] rounded-xl flex flex-col relative overflow-hidden cursor-pointer transition-all duration-300 shadow-xl group hover:shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:-translate-y-2 hover:scale-[1.02]",
                    rarityBorderColors[card.rarity] || "border-ocean-mid/50"
                  )}>
                    
                    {/* Duplicate Count Badge */}
                    {count > 1 && (
                      <div className="absolute top-3 right-3 bg-wave text-primary-foreground text-sm font-bold px-2.5 py-0.5 rounded-full z-30 shadow-lg border border-white/20">
                        x{count}
                      </div>
                    )}

                    {/* Subtle hover glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                    {/* Center Artwork */}
                    <div className="flex-1 flex items-center justify-center relative z-10 pb-6">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
                        {card.image}
                      </span>
                    </div>

                    {/* Info Footer (Dark gradient overlay) */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end p-3 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="font-heading font-bold text-lg text-white leading-tight drop-shadow-md line-clamp-2 mb-1.5">
                        {card.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded shadow-sm font-body font-bold uppercase tracking-wider border border-white/20",
                          rarityColors[card.rarity]
                        )}>
                          {card.rarity}
                        </span>
                        <span className="text-[10px] text-ocean-light font-body uppercase tracking-widest font-semibold drop-shadow-sm">
                          {card.type}
                        </span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Pop-up Modal for Full Premium Card */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()} 
              className="relative"
            >
              <button 
                onClick={() => setSelectedCard(null)} 
                className="absolute -top-12 right-0 text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors z-50"
              >
                <X className="w-5 h-5" />
              </button>
              
              <TradingCard card={selectedCard} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}