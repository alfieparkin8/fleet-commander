import { motion } from 'framer-motion';
import { Anchor, Swords, Package, BookOpen, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NavBarProps {
  coins?: number; // Optional fallback
}

export default function NavBar({ coins: propCoins }: NavBarProps) {
  const { user, signOut } = useAuth();
  const [realCoins, setRealCoins] = useState(0);
  const navigate = useNavigate();

  // Helper function to fetch the latest balance
  const fetchCoins = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles' as any) // Using the quick fix to prevent TypeScript warnings
      .select('coins')
      .eq('id', user.id)
      .single();
    
    if (data) setRealCoins(data.coins);
  };

  useEffect(() => {
    if (!user) return;

    fetchCoins();

    // 1. Listen for instant local updates (when you buy a pack)
    window.addEventListener('balance_updated', fetchCoins);

    // 2. Listen for real-time background updates from Supabase (when Stripe webhook fires)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        () => {
          fetchCoins(); // Instantly refresh when the database detects a change
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('balance_updated', fetchCoins);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out");
      navigate('/'); // Redirect to the home page after logging out
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const displayCoins = user ? realCoins : (propCoins || 0);

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
          
          {/* AUTH / COINS SECTION - separated by a subtle border */}
          <div className="flex items-center gap-2 ml-1 sm:ml-2 pl-2 sm:pl-4 border-l border-ocean-mid/50">
            {user ? (
              <>
                {/* Coin Store Link */}
                <Link to="/store" className="flex items-center gap-1 bg-gold/20 hover:bg-gold/30 transition-colors text-gold px-3 py-1 rounded-full font-body font-bold text-sm">
                  <span>🪙</span>
                  <span>{displayCoins.toLocaleString()}</span>
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 p-1.5 rounded-lg text-ocean-light hover:bg-destructive/20 hover:text-destructive transition-colors font-body text-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Login Link */
              <Link to="/auth" className="flex items-center gap-1 bg-wave text-primary-foreground hover:bg-wave/80 transition-colors px-4 py-1.5 rounded-lg font-body text-sm font-semibold shadow-sm">
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}