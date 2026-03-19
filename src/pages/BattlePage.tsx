import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TradingCard from '@/components/TradingCard';
import NavBar from '@/components/NavBar';
import WaveBackground from '@/components/WaveBackground';
import { useGameState } from '@/hooks/useGameState';
import { GameCard, allCards, getRandomCards } from '@/data/cards';
import { Button } from '@/components/ui/button';
import { Swords, Trophy, Frown } from 'lucide-react';

type BattlePhase = 'select' | 'choose-stat' | 'reveal' | 'result';

export default function BattlePage() {
  const game = useGameState();
  const [phase, setPhase] = useState<BattlePhase>('select');
  const [playerCard, setPlayerCard] = useState<GameCard | null>(null);
  const [opponentCard, setOpponentCard] = useState<GameCard | null>(null);
  const [selectedStat, setSelectedStat] = useState<number | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, opponent: 0, round: 0 });

  const selectCard = useCallback((card: GameCard) => {
    setPlayerCard(card);
    setOpponentCard(getRandomCards(1)[0]);
    setPhase('choose-stat');
    setSelectedStat(null);
    setResult(null);
  }, []);

  const chooseStat = useCallback((statIndex: number) => {
    if (!playerCard || !opponentCard) return;
    setSelectedStat(statIndex);
    setPhase('reveal');

    const statKey = `stat${statIndex + 1}` as keyof typeof playerCard.stats;
    const pVal = playerCard.stats[statKey];
    const oVal = opponentCard.stats[statKey];

    // For "Year Built" / "Est. Year" — newer is better
    const higherWins = !(playerCard.statLabels[statIndex].includes('Year'));
    
    let res: 'win' | 'lose' | 'draw';
    if (pVal === oVal) res = 'draw';
    else if (higherWins ? pVal > oVal : pVal > oVal) res = 'win';
    else res = 'lose';

    setResult(res);

    const newScore = { ...score, round: score.round + 1 };
    if (res === 'win') newScore.player++;
    else if (res === 'lose') newScore.opponent++;
    setScore(newScore);

    // After 5 rounds, finalize
    if (newScore.round >= 5) {
      setTimeout(() => {
        if (newScore.player > newScore.opponent) {
          game.addWin(150);
        } else if (newScore.player < newScore.opponent) {
          game.addLoss();
        } else {
          game.addWin(50); // draw reward
        }
        setPhase('result');
      }, 2000);
    } else {
      setTimeout(() => {
        setPhase('select');
        setPlayerCard(null);
        setOpponentCard(null);
        setSelectedStat(null);
        setResult(null);
      }, 2500);
    }
  }, [playerCard, opponentCard, score, game]);

  const resetBattle = () => {
    setPhase('select');
    setPlayerCard(null);
    setOpponentCard(null);
    setSelectedStat(null);
    setResult(null);
    setScore({ player: 0, opponent: 0, round: 0 });
  };

  if (game.collection.length === 0) {
    return (
      <div className="min-h-screen">
        <WaveBackground />
        <NavBar coins={game.coins} />
        <div className="container mx-auto pt-24 px-4 text-center">
          <span className="text-6xl">⚓</span>
          <h1 className="font-heading text-6xl text-foreground mt-4">No Cards to Battle!</h1>
          <p className="font-body text-muted-foreground mt-2">Open some packs first to build your deck.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <WaveBackground />
      <NavBar coins={game.coins} />

      <div className="container mx-auto pt-24 pb-16 px-4">
        {/* Score bar */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="font-heading text-3xl text-wave">You</p>
            <p className="font-heading text-5xl text-foreground">{score.player}</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl text-muted-foreground">Round {Math.min(score.round + 1, 5)}/5</p>
            <Swords className="w-8 h-8 text-wave mx-auto mt-1" />
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl text-destructive">Opponent</p>
            <p className="font-heading text-5xl text-foreground">{score.opponent}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'select' && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-5xl text-center text-foreground mb-4">Choose Your Card</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {game.collection.map((card, i) => (
                  <TradingCard key={`${card.id}-${i}`} card={card} onClick={() => selectCard(card)} compact />
                ))}
              </div>
            </motion.div>
          )}

          {(phase === 'choose-stat' || phase === 'reveal') && playerCard && opponentCard && (
            <motion.div key="battle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-4xl text-center text-foreground mb-6">
                {phase === 'choose-stat' ? 'Pick a Stat to Compare!' : 'Results!'}
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="text-center">
                  <p className="font-heading text-2xl text-wave mb-2">Your Card</p>
                  <TradingCard card={playerCard} highlightStat={selectedStat ?? undefined} />
                </div>

                <div className="text-4xl">⚔️</div>

                <div className="text-center">
                  <p className="font-heading text-2xl text-destructive mb-2">Opponent</p>
                  <TradingCard
                    card={opponentCard}
                    flipped={phase === 'choose-stat'}
                    highlightStat={selectedStat ?? undefined}
                  />
                </div>
              </div>

              {phase === 'choose-stat' && (
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {playerCard.statLabels.map((label, i) => (
                    <Button
                      key={i}
                      onClick={() => chooseStat(i)}
                      className="bg-ocean-mid text-primary-foreground hover:bg-wave font-body"
                    >
                      {label}: {playerCard.stats[`stat${i + 1}` as keyof typeof playerCard.stats].toLocaleString()}
                    </Button>
                  ))}
                </div>
              )}

              {phase === 'reveal' && result && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center mt-6"
                >
                  <span className={`font-heading text-6xl ${
                    result === 'win' ? 'text-wave' : result === 'lose' ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '😞 You Lose!' : '🤝 Draw!'}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="final" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              {score.player > score.opponent ? (
                <>
                  <Trophy className="w-20 h-20 text-gold mx-auto mb-4" />
                  <h2 className="font-heading text-7xl text-foreground">Victory!</h2>
                  <p className="font-body text-xl text-wave mt-2">You won {score.player}-{score.opponent}!</p>
                  <p className="font-body text-gold mt-1">+🪙 150 coins earned!</p>
                </>
              ) : score.player < score.opponent ? (
                <>
                  <Frown className="w-20 h-20 text-destructive mx-auto mb-4" />
                  <h2 className="font-heading text-7xl text-foreground">Defeat</h2>
                  <p className="font-body text-xl text-destructive mt-2">You lost {score.player}-{score.opponent}</p>
                  <p className="font-body text-muted-foreground mt-1">Better luck next time!</p>
                </>
              ) : (
                <>
                  <span className="text-7xl">🤝</span>
                  <h2 className="font-heading text-7xl text-foreground mt-2">Draw!</h2>
                  <p className="font-body text-gold mt-1">+🪙 50 coins earned!</p>
                </>
              )}

              <Button
                onClick={resetBattle}
                className="mt-8 bg-wave text-primary-foreground hover:bg-wave/80 font-body px-8 py-3 text-lg"
              >
                Battle Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
