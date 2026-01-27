import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptsCount, price } = await req.json();

    if (!attemptsCount || !price) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user subscription
    const subscriptions = await base44.entities.Subscription.filter({
      user_email: user.email
    });

    if (subscriptions.length === 0) {
      return Response.json({ error: 'No subscription found' }, { status: 404 });
    }

    const subscription = subscriptions[0];

    // Update subscription with new attempts
    const updatedSubscription = await base44.asServiceRole.entities.Subscription.update(
      subscription.id,
      {
        predictions_limit: subscription.predictions_limit + attemptsCount
      }
    );

    return Response.json({ 
      success: true,
      message: `${attemptsCount} attempts added successfully`,
      subscription: updatedSubscription
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});