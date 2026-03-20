import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard } from '@/data/cards';
import TradingCard from '@/components/TradingCard';
import NavBar from '@/components/NavBar';
import WaveBackground from '@/components/WaveBackground';
import { useGameState } from '@/hooks/useGameState';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper function to dynamically synthesize sound effects based on rarity
const playSound = (rarity: string) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playNote = (freq: number, startTime: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = rarity === 'legendary' || rarity === 'epic' ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    switch (rarity.toLowerCase()) {
      case 'legendary': // Epic Arpeggio
        playNote(440, now, 0.4, 0.3);
        playNote(554.37, now + 0.1, 0.4, 0.3);
        playNote(659.25, now + 0.2, 0.6, 0.3);
        playNote(880, now + 0.3, 0.8, 0.5);
        break;
      case 'epic': // High Double Chime
        playNote(523.25, now, 0.3, 0.3);
        playNote(659.25, now + 0.15, 0.5, 0.4);
        break;
      case 'rare': // Single Clear Chime
        playNote(587.33, now, 0.4, 0.3);
        break;
      default: // Standard common pop
        playNote(440, now, 0.2, 0.2);
        break;
    }
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export default function PacksPage() {
  const { user } = useAuth();
  const game = useGameState();
  
  // Pack Opening State
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<GameCard[]>([]);
  
  // Stacking Mechanics State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);

  const handleOpenPack = async () => {
    if (!user) {
      toast.error("Authentication Required", { description: "Please log in to purchase packs." });
      return;
    }
    if (isPurchasing) return;
    setIsPurchasing(true);

    try {
      const { data: success, error } = await supabase.rpc('deduct_coins', { amount: 100 });
      if (error) throw error;
      if (!success) {
        toast.error("Not enough coins", { description: "Visit the store to get more!" });
        setIsPurchasing(false);
        return;
      }

      window.dispatchEvent(new Event('balance_updated'));
      const cards = game.openPack();
      
      if (cards && cards.length > 0) {
        setRevealedCards(cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setAllRevealed(false);
        setIsOpening(true);
      }
    } catch (error: any) {
      toast.error("Transaction Failed", { description: "An error occurred." });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      // 1. Flip the top card and play sound
      setIsFlipped(true);
      playSound(revealedCards[currentIndex].rarity);
    } else {
      // 2. Clicked again: swipe it away and move to next
      if (currentIndex < revealedCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {
        // 3. No cards left
        setAllRevealed(true);
      }
    }
  };

  const handleDone = () => {
    setIsOpening(false);
    setRevealedCards([]);
  };

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
              className={`w-64 h-80 bg-ocean-deep rounded-2xl border-2 border-wave/30 flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-wave/20 transition-all ${isPurchasing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:-rotate-2'}`}
              whileTap={!isPurchasing ? { scale: 0.95 } : {}}
              onClick={handleOpenPack}
            >
              <Package className={`w-16 h-16 text-wave mb-4 ${isPurchasing ? 'animate-bounce' : ''}`} />
              <span className="font-heading text-4xl text-primary-foreground">
                {isPurchasing ? 'Buying...' : 'Card Pack'}
              </span>
              <span className="font-body text-sm text-ocean-light mt-2">5 Cards Inside</span>
              <span className="font-body text-sm text-gold mt-1 drop-shadow-md">🪙 100</span>
            </motion.div>

            <div className="text-center text-muted-foreground font-body text-sm">
              <p>Packs opened: {game.packsOpened} • Cards collected: {game.collection.length}</p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6 mt-4">
            <p className="font-body text-lg text-primary-foreground font-bold h-8">
              {allRevealed ? "Pack Complete!" : !isFlipped ? "Tap the deck to reveal your card!" : "Tap again to keep drawing!"}
            </p>

            {/* The Stacked Deck Area */}
            <div className="relative w-64 h-[400px] mx-auto perspective-1000 mt-4">
              <AnimatePresence>
                {!allRevealed && revealedCards.map((card, i) => {
                  if (i < currentIndex) return null; // Remove card if we've moved past it
                  
                  const isTop = i === currentIndex;
                  const offset = (i - currentIndex) * 6; // Stack depth visuals

                  return (
                    <motion.div
                      key={i}
                      className="absolute left-0 right-0 origin-bottom"
                      style={{ zIndex: 10 - i }}
                      initial={{ y: -300, opacity: 0, scale: 0.5 }}
                      animate={{
                        y: offset * 1.5,
                        x: offset,
                        opacity: 1,
                        rotateZ: isTop ? 0 : (i % 2 === 0 ? 2 : -2),
                        scale: isTop && isFlipped ? 1.05 : 1, // Slight pop when flipped
                      }}
                      // Swipe away to the left when discarded
                      exit={{ x: -400, opacity: 0, rotateZ: -20, transition: { duration: 0.3 } }} 
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <TradingCard
                        card={card}
                        // If it's the top card, use the flip state. If it's underneath, force it face down.
                        flipped={isTop ? !isFlipped : true} 
                        onClick={isTop ? handleCardClick : undefined}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Reveal Continue Button when stack is empty */}
              {allRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Button
                    onClick={handleDone}
                    className="bg-wave text-primary-foreground hover:bg-wave/80 font-body px-8 py-3 text-lg shadow-lg"
                  >
                    Awesome! Continue
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}