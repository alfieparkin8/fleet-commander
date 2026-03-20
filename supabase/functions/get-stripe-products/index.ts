import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req) => {
  // Fix CORS: Explicitly return status 200 for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Fetch all active products and their default prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const formattedProducts = products.data.map(product => {
      const price = product.default_price as Stripe.Price;
      
      // DYNAMIC COIN LOGIC: Extract the first number found in the product's title
      // e.g., "Commander Pack 5000 Coins" -> extracts 5000
      const match = product.name.match(/\d+/);
      const coins = match ? parseInt(match[0], 10) : 0;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: price && price.unit_amount ? `$${(price.unit_amount / 100).toFixed(2)}` : '$0.00',
        priceId: price ? price.id : null,
        coins: coins,
      };
    }).filter(p => p.priceId && p.coins > 0); // Only return products that have a price AND a valid coin amount

    return new Response(JSON.stringify(formattedProducts), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});