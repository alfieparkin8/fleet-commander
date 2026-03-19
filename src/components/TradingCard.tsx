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

export default function TradingCard({ card, onClick, selected, highlightStat, compact, flipped }: TradingCardProps) {
  const rarityLabel = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
  const glowClass = `card-${card.rarity}`;

  if (flipped) {
    return (
      <motion.div
        className={cn(
          "relative w-48 h-72 rounded-xl border-2 cursor-pointer overflow-hidden",
          "bg-ocean-deep border-ocean-mid"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <span className="text-5xl">🌊</span>
            <p className="font-heading text-3xl text-primary-foreground mt-2">Young at Sea</p>
          </div>
        </div>
        <div className="absolute inset-0 animate-shimmer pointer-events-none rounded-xl" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border-2 cursor-pointer overflow-hidden transition-all",
        rarityBorderColors[card.rarity],
        glowClass,
        selected && "ring-2 ring-wave scale-105",
        compact ? "w-36 h-52" : "w-48 h-72",
        "bg-ocean-deep"
      )}
      whileHover={{ scale: selected ? 1.05 : 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      layout
    >
      {/* Header */}
      <div className={cn("px-3 py-1.5 flex items-center justify-between", compact && "px-2 py-1")}>
        <span className={cn("font-heading font-bold text-primary-foreground", compact ? "text-lg" : "text-xl")}>{card.name}</span>
      </div>

      {/* Image area */}
      <div className={cn(
        "flex items-center justify-center bg-ocean-mid/40",
        compact ? "h-16" : "h-20"
      )}>
        <span className={compact ? "text-3xl" : "text-4xl"}>{card.image}</span>
      </div>

      {/* Rarity badge */}
      <div className="px-3 py-1 flex items-center justify-between">
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-body font-semibold", rarityColors[card.rarity])}>
          {rarityLabel}
        </span>
        <span className="text-xs text-ocean-light font-body capitalize">{card.type}</span>
      </div>

      {/* Stats */}
      <div className={cn("px-3 space-y-0.5", compact && "px-2")}>
        {card.statLabels.map((label, i) => {
          const statKey = `stat${i + 1}` as keyof typeof card.stats;
          const isHighlighted = highlightStat === i;
          return (
            <div key={i} className={cn(
              "flex justify-between items-center text-xs font-body rounded px-1",
              isHighlighted && "bg-wave/20 text-wave font-bold",
              !isHighlighted && "text-ocean-light"
            )}>
              <span className="truncate">{label}</span>
              <span className="font-semibold ml-1">{card.stats[statKey].toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Description - only on full size */}
      {!compact && (
        <p className="px-3 pt-1 text-[10px] text-ocean-light/70 font-body line-clamp-2">{card.description}</p>
      )}
    </motion.div>
  );
}
