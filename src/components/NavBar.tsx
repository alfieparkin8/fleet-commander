import { motion } from 'framer-motion';
import { Anchor, Swords, Package, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  coins: number;
}

export default function NavBar({ coins }: NavBarProps) {
  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-ocean-deep/95 backdrop-blur-md border-b border-ocean-mid/30"
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Anchor className="w-6 h-6 text-wave" />
          <span className="font-heading text-3xl text-primary-foreground">Young at Sea</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <Link to="/collection" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-ocean-light hover:bg-ocean-mid/30 transition-colors font-body text-sm">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Collection</span>
          </Link>
          <Link to="/packs" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-ocean-light hover:bg-ocean-mid/30 transition-colors font-body text-sm">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Packs</span>
          </Link>
          <Link to="/battle" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-ocean-light hover:bg-ocean-mid/30 transition-colors font-body text-sm">
            <Swords className="w-4 h-4" />
            <span className="hidden sm:inline">Battle</span>
          </Link>
          <div className="flex items-center gap-1 bg-gold/20 text-gold px-3 py-1 rounded-full font-body font-bold text-sm">
            <span>🪙</span>
            <span>{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
