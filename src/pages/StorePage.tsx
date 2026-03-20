import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import NavBar from "@/components/NavBar";

interface CoinPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  priceId: string;
  coins: number;
}

export default function StorePage() {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-stripe-products');
        if (error) throw new Error(error.message);
        
        const sortedPackages = (data as CoinPackage[]).sort((a, b) => a.coins - b.coins);
        setPackages(sortedPackages);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Failed to load store items. Please try again later.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in to purchase coins.",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(priceId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) throw new Error(error.message);
      if (!data?.url) throw new Error("No checkout URL returned from server");

      toast.success("Redirecting to checkout...", {
        description: "Please complete your payment securely with Stripe.",
      });

      window.location.assign(data.url);
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Error", {
        description: error.message || "Failed to initiate checkout. Please try again.",
      });
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Added padding top (pt-24) to clear the fixed NavBar */}
      <div className="container mx-auto pt-24 pb-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Fleet Armory</h1>
          <p className="text-lg text-muted-foreground">
            Purchase coins to upgrade your fleet and unlock new commanders.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {isFetching ? (
            <>
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <Skeleton className="h-[250px] w-full rounded-xl" />
            </>
          ) : (
            packages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold mb-2">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></span>
                    {pkg.coins.toLocaleString()} Coins
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handlePurchase(pkg.priceId)}
                    disabled={isLoading === pkg.priceId}
                  >
                    {isLoading === pkg.priceId ? "Initializing..." : !user ? "Log in to Purchase" : "Purchase"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}