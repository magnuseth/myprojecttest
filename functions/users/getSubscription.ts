/**
 * Get user subscription details
 * Endpoint: /users/subscription
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { successResponse, handleError, notFoundResponse } from '../common/response.ts';
import { requireAuth } from '../common/guards.ts';

Deno.serve(async (req) => {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return authResult.error;
    }
    
    const { user, base44 } = authResult;
    
    // Get subscription
    const subscriptions = await base44.asServiceRole.entities.Subscription.filter({
      user_email: user.email
    });
    
    if (!subscriptions || subscriptions.length === 0) {
      return notFoundResponse('Subscription not found');
    }
    
    const subscription = subscriptions[0];
    
    // Calculate remaining predictions
    const remaining = subscription.predictions_limit - subscription.predictions_used;
    const usagePercentage = Math.round(
      (subscription.predictions_used / subscription.predictions_limit) * 100
    );
    
    return successResponse({
      plan: subscription.plan,
      predictionsUsed: subscription.predictions_used,
      predictionsLimit: subscription.predictions_limit,
      predictionsRemaining: remaining,
      usagePercentage,
      isActive: subscription.is_active,
      expiresAt: subscription.expires_at,
      // Predictor backend will be connected here later
      // This is where predictor usage tracking will integrate
    });
    
  } catch (error) {
    return handleError(error);
  }
});