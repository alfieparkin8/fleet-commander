import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('Stripe-Signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      return new Response('Missing signature or webhook secret', { status: 400 });
    }

    const body = await req.text();
    
    // Verify the webhook signature securely
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      
      if (!userId) throw new Error('No client_reference_id found in session');

      // 1. Get the line items to find out WHAT they bought
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const productId = lineItems.data[0]?.price?.product as string;

      if (!productId) throw new Error('No product ID found in session');

      // 2. Fetch the Product from Stripe and read the title
      const product = await stripe.products.retrieve(productId);
      
      // DYNAMIC COIN LOGIC: Extract the number from the title
      const match = product.name.match(/\d+/);
      const coinsToAdd = match ? parseInt(match[0], 10) : 0;

      if (coinsToAdd === 0) throw new Error(`Could not determine coin amount from product title: ${product.name}`);

      // 3. Initialize Supabase Admin client
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // 4. Fetch current balance & Update
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('coins')
        .eq('id', userId)
        .single();
        
      if (fetchError) throw fetchError;

      const newBalance = (profile?.coins || 0) + coinsToAdd;

      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ coins: newBalance })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});