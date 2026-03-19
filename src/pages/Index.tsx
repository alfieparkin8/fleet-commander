import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Swords, BookOpen, Anchor } from 'lucide-react';
import NavBar from '@/components/NavBar';
import WaveBackground from '@/components/WaveBackground';
import { useGameState } from '@/hooks/useGameState';

export default function Index() {
  const game = useGameState();

  const menuItems = [
    { to: '/packs', icon: Package, label: 'Open Packs', desc: 'Get 5 new cards for 🪙 100', color: 'bg-wave/20 text-wave' },
    { to: '/collection', icon: BookOpen, label: 'Collection', desc: `${game.collection.length} cards collected`, color: 'bg-ocean-light/20 text-ocean-light' },
    { to: '/battle', icon: Swords, label: 'Battle', desc: `${game.wins}W - ${game.losses}L record`, color: 'bg-gold/20 text-gold' },
  ];

  return (
    <div className="min-h-screen">
      <WaveBackground />
      <NavBar coins={game.coins} />

      <div className="container mx-auto pt-28 pb-16 px-4">
        {/* Hero */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Anchor className="w-16 h-16 text-wave" />
          </motion.div>
          <h1 className="font-heading text-8xl sm:text-9xl text-foreground leading-none">
            Young at Sea
          </h1>
          <p className="font-heading text-4xl sm:text-5xl text-wave mt-2">
            Trading Card Game
          </p>
          <p className="font-body text-muted-foreground mt-4 max-w-md mx-auto">
            Collect ships, ports & countries. Battle other players Top Trumps style!
          </p>
        </motion.div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link to={item.to}>
                <div className="bg-ocean-deep/80 backdrop-blur rounded-2xl p-6 text-center border border-ocean-mid/20 hover:border-wave/40 transition-all hover:scale-105 cursor-pointer">
                  <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-3xl text-primary-foreground">{item.label}</h3>
                  <p className="font-body text-sm text-ocean-light mt-1">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-flex gap-8 bg-ocean-deep/60 backdrop-blur rounded-2xl px-8 py-4 border border-ocean-mid/20">
            <div>
              <p className="font-heading text-4xl text-wave">{game.collection.length}</p>
              <p className="font-body text-xs text-ocean-light">Cards</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-gold">{game.coins.toLocaleString()}</p>
              <p className="font-body text-xs text-ocean-light">Coins</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-wave">{game.wins}</p>
              <p className="font-body text-xs text-ocean-light">Wins</p>
            </div>
            <div>
              <p className="font-heading text-4xl text-destructive">{game.packsOpened}</p>
              <p className="font-body text-xs text-ocean-light">Packs</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
