import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all active subscriptions
    const subscriptions = await base44.asServiceRole.entities.Subscription.filter({
      is_active: true
    });

    let resetCount = 0;

    for (const subscription of subscriptions) {
      await base44.asServiceRole.entities.Subscription.update(subscription.id, {
        predictions_used: 0
      });
      resetCount++;
    }

    return Response.json({ 
      success: true,
      message: `Reset ${resetCount} subscriptions`,
      resetCount
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});