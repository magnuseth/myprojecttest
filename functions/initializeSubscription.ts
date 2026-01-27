import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if subscription already exists
    const existingSubscriptions = await base44.entities.Subscription.filter({
      user_email: user.email
    });

    if (existingSubscriptions.length > 0) {
      return Response.json({ 
        message: 'Subscription already exists',
        subscription: existingSubscriptions[0]
      });
    }

    // Create new subscription
    const newSubscription = await base44.asServiceRole.entities.Subscription.create({
      user_email: user.email,
      plan: 'free',
      predictions_used: 0,
      predictions_limit: 10,
      is_active: true
    });

    return Response.json({ 
      message: 'Subscription created successfully',
      subscription: newSubscription
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});