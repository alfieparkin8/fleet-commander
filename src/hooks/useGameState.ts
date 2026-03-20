import { useState, useCallback, useEffect } from 'react';
import { GameCard, getRandomCards } from '@/data/cards';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GameState {
  collection: GameCard[];
  coins: number;
  wins: number;
  losses: number;
  packsOpened: number;
}

const STORAGE_KEY = 'yas-card-game';

function loadLocalState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { collection: [], coins: 500, wins: 0, losses: 0, packsOpened: 0 };
}

function saveLocalState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const { user } = useAuth();
  const [state, setState] = useState<GameState>(loadLocalState);

  // 1. Fetch from Supabase when the user logs in
  useEffect(() => {
    if (!user) return;
    const fetchState = async () => {
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('collection, wins, losses, packs_opened, coins')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setState(prev => {
          const newState = {
            ...prev,
            coins: data.coins ?? prev.coins,
            // Assert the JSONB from Supabase as GameCard array
            collection: data.collection ? (data.collection as unknown as GameCard[]) : prev.collection,
            wins: data.wins ?? prev.wins,
            losses: data.losses ?? prev.losses,
            packsOpened: data.packs_opened ?? prev.packsOpened,
          };
          saveLocalState(newState);
          return newState;
        });
      }
    };
    fetchState();
  }, [user]);

  const update = useCallback((updater: (prev: GameState) => GameState) => {
    setState(prev => {
      const next = updater(prev);
      saveLocalState(next); // Keep local storage fast and snappy
      
      // 2. Sync to Supabase securely in the background
      if (user) {
        supabase.from('profiles' as any).update({
          collection: next.collection,
          wins: next.wins,
          losses: next.losses,
          packs_opened: next.packsOpened
          // We intentionally leave out 'coins' here because the Stripe Webhook 
          // and the deduct_coins RPC handle the money securely on the server!
        }).eq('id', user.id).then();
      }
      
      return next;
    });
  }, [user]);

  const openPack = useCallback(() => {
    const newCards = getRandomCards(5);
    
    update(prev => ({
      ...prev,
      collection: [...prev.collection, ...newCards],
      packsOpened: prev.packsOpened + 1,
    }));
    
    return newCards;
  }, [update]);

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