import { useState, useCallback } from 'react';
import { GameCard, getRandomCards } from '@/data/cards';

export interface GameState {
  collection: GameCard[];
  coins: number;
  wins: number;
  losses: number;
  packsOpened: number;
}

const STORAGE_KEY = 'yas-card-game';

function loadState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { collection: [], coins: 500, wins: 0, losses: 0, packsOpened: 0 };
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);

  const update = useCallback((updater: (prev: GameState) => GameState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const openPack = useCallback(() => {
    const cost = 100;
    if (state.coins < cost) return [];
    const newCards = getRandomCards(5);
    update(prev => ({
      ...prev,
      coins: prev.coins - cost,
      collection: [...prev.collection, ...newCards],
      packsOpened: prev.packsOpened + 1,
    }));
    return newCards;
  }, [state.coins, update]);

  const addWin = useCallback((reward: number) => {
    update(prev => ({ ...prev, wins: prev.wins + 1, coins: prev.coins + reward }));
  }, [update]);

  const addLoss = useCallback(() => {
    update(prev => ({ ...prev, losses: prev.losses + 1 }));
  }, [update]);

  const removeCard = useCallback((cardId: string) => {
    update(prev => {
      const idx = prev.collection.findIndex(c => c.id === cardId);
      if (idx === -1) return prev;
      const next = [...prev.collection];
      next.splice(idx, 1);
      return { ...prev, collection: next };
    });
  }, [update]);

  const addCoins = useCallback((amount: number) => {
    update(prev => ({ ...prev, coins: prev.coins + amount }));
  }, [update]);

  return { ...state, openPack, addWin, addLoss, removeCard, addCoins };
}
