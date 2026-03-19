import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/data/cards';
import TradingCard from '@/components/TradingCard';
import NavBar from '@/components/NavBar';
import WaveBackground from '@/components/WaveBackground';
import { useGameState } from '@/hooks/useGameState';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PacksPage() {
  const game = useGameState();
  const [revealedCards, setRevealedCards] = useState<GameCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenPack = () => {
    if (game.coins < 100) return;
    const cards = game.openPack();
    if (cards.length > 0) {
      setRevealedCards(cards);
      setFlippedIndices(new Set());
      setIsOpening(true);
    }
  };

  const handleFlipCard = (index: number) => {
    setFlippedIndices(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleDone = () => {
    setIsOpening(false);
    setRevealedCards([]);
    setFlippedIndices(new Set());
  };

  const allRevealed = flippedIndices.size === revealedCards.length;

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
          Open Packs
        </motion.h1>
        <p className="text-center text-muted-foreground font-body mb-8">
          Each pack contains 5 random cards • Cost: 🪙 100
        </p>

        {!isOpening ? (
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-64 h-80 bg-ocean-deep rounded-2xl border-2 border-wave/30 flex flex-col items-center justify-center cursor-pointer card-rare"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenPack}
            >
              <Package className="w-16 h-16 text-wave mb-4" />
              <span className="font-heading text-4xl text-primary-foreground">Card Pack</span>
              <span className="font-body text-sm text-ocean-light mt-2">5 Cards Inside</span>
              <span className="font-body text-sm text-gold mt-1">🪙 100</span>
            </motion.div>

            {game.coins < 100 && (
              <p className="text-destructive font-body text-sm">Not enough coins! Win battles to earn more.</p>
            )}

            <div className="text-center text-muted-foreground font-body text-sm">
              <p>Packs opened: {game.packsOpened} • Cards collected: {game.collection.length}</p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <p className="font-body text-muted-foreground">Tap cards to reveal them!</p>
            <div className="flex flex-wrap justify-center gap-4">
              <AnimatePresence>
                {revealedCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateY: 180 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring' }}
                  >
                    <TradingCard
                      card={card}
                      flipped={!flippedIndices.has(i)}
                      onClick={() => handleFlipCard(i)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {allRevealed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button
                  onClick={handleDone}
                  className="bg-wave text-primary-foreground hover:bg-wave/80 font-body px-8 py-3 text-lg"
                >
                  Awesome! Continue
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
