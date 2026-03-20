import { GameCard, rarityColors, rarityBorderColors } from '@/data/cards';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TradingCardProps {
  card: GameCard;
  onClick?: () => void;
  selected?: boolean;
  highlightStat?: number;
  compact?: boolean;
  flipped?: boolean;
}

// Premium colored hover shadows based on rarity
const rarityHoverShadows: Record<string, string> = {
  common: 'hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]',
  uncommon: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.4)]',
  rare: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]',
  epic: 'hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]',
  legendary: 'hover:shadow-[0_0_60px_rgba(245,158,11,0.7)]',
};

export default function TradingCard({ card, onClick, selected, highlightStat, compact, flipped }: TradingCardProps) {
  const rarityLabel = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
  const hoverShadow = rarityHoverShadows[card.rarity.toLowerCase()] || rarityHoverShadows.common;

  // The Flipped Back of the Card (Seen during Pack Opening)
  if (flipped) {
    return (
      <motion.div
        className={cn(
          "relative rounded-xl border-[4px] cursor-pointer overflow-hidden",
          "bg-gradient-to-br from-ocean-deep via-[#081221] to-ocean-deep border-ocean-light/40 shadow-2xl",
          compact ? "w-44 h-64" : "w-64 h-96", // Scaled down to fit the deck perfectly
          "group"
        )}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {/* Card Back Pattern */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-wave via-transparent to-transparent" />
        
        <div className="flex items-center justify-center h-full relative z-10">
          {/* Glowing Circle with your Logo */}
          <div className={cn(
            "flex items-center justify-center bg-black/40 rounded-full backdrop-blur-md border-2 border-wave/20 shadow-[0_0_30px_rgba(56,189,248,0.2)]",
            compact ? "w-24 h-24 p-3" : "w-36 h-36 p-5"
          )}>
            <img 
              src="https://www.youngatsea.com/images/young-at-sea-logo.png" 
              alt="Young at Sea Logo" 
              className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
            />
          </div>
        </div>
        
        {/* Foil Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform -translate-x-full group-hover:translate-x-full ease-in-out" style={{ transitionDuration: '1.5s' }} />
      </motion.div>
    );
  }

  // The Front of the Card
  return (
    <motion.div
      className={cn(
        "relative rounded-xl border-[4px] cursor-pointer overflow-hidden transition-all duration-300 group",
        "bg-gradient-to-b from-[#0f1b2d] to-[#060d17] shadow-2xl",
        rarityBorderColors[card.rarity],
        hoverShadow,
        selected && "ring-2 ring-wave scale-105 shadow-[0_0_40px_rgba(56,189,248,0.5)]",
        compact ? "w-44 h-64" : "w-64 h-96" // Scaled down to real trading card aspect ratio
      )}
      whileHover={{ scale: selected ? 1.05 : 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
    >
      {/* Foil Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />

      {/* Header */}
      <div className={cn(
        "flex items-center justify-between bg-black/40 border-b border-white/10 backdrop-blur-sm relative z-10", 
        compact ? "px-3 py-2" : "px-3 py-2.5"
      )}>
        <span className={cn(
          "font-heading font-black text-primary-foreground drop-shadow-md truncate tracking-wide", 
          compact ? "text-base" : "text-lg"
        )}>
          {card.name}
        </span>
      </div>

      {/* Image Area (Art Box) */}
      <div className={cn(
        "flex items-center justify-center relative bg-gradient-to-b from-ocean-mid/60 to-ocean-deep shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] border-b border-white/5",
        compact ? "h-24" : "h-36"
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-60" />
        <span className={cn(
          "relative z-10 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]",
          compact ? "text-5xl" : "text-7xl"
        )}>
          {card.image}
        </span>
      </div>

      {/* Rarity and Type Ribbon */}
      <div className={cn(
        "flex items-center justify-between bg-black/60 border-b border-white/10 relative z-10 shadow-md",
        compact ? "px-3 py-1.5" : "px-3 py-2"
      )}>
        <span className={cn(
          "rounded shadow-sm font-body font-black uppercase tracking-widest border border-white/20", 
          compact ? "text-[9px] px-2 py-0.5" : "text-[10px] px-2.5 py-0.5",
          rarityColors[card.rarity]
        )}>
          {rarityLabel}
        </span>
        <span className={cn(
          "text-ocean-light/90 font-body uppercase tracking-[0.2em] font-bold",
          compact ? "text-[9px]" : "text-[10px]"
        )}>
          {card.type}
        </span>
      </div>

      {/* Stats Box */}
      <div className={cn(
        "relative z-10 flex flex-col", 
        compact ? "p-2 space-y-1" : "p-3 space-y-1.5 mt-0.5"
      )}>
        {card.statLabels.map((label, i) => {
          const statKey = `stat${i + 1}` as keyof typeof card.stats;
          const isHighlighted = highlightStat === i;
          return (
            <div key={i} className={cn(
              "flex justify-between items-center font-body rounded transition-colors",
              compact ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
              isHighlighted 
                ? "bg-wave/30 text-white font-bold border border-wave/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]" 
                : "bg-black/30 text-ocean-light border border-white/5 hover:bg-black/50"
            )}>
              <span className="truncate opacity-80 tracking-wide">{label}</span>
              <span className="font-bold text-white drop-shadow-md">{card.stats[statKey].toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Flavor Text Description (Only visible on the large card) */}
      {!compact && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-3 px-4 z-10">
          <p className="text-[11px] leading-relaxed text-ocean-light/70 font-body italic line-clamp-3 text-center drop-shadow-md">
            "{card.description}"
          </p>
        </div>
      )}
    </motion.div>
  );
}