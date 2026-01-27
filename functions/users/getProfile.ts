/**
 * Get user profile with subscription details
 * Endpoint: /users/profile
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { successResponse, handleError } from '../common/response.ts';
import { requireAuth } from '../common/guards.ts';

Deno.serve(async (req) => {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return authResult.error;
    }
    
    const { user, base44 } = authResult;
    
    // Get subscription
    const subscriptions = await base44.entities.Subscription.filter({
      user_email: user.email
    });
    
    const subscription = subscriptions[0];
    
    // Calculate usage percentage
    const usagePercentage = subscription 
      ? Math.round((subscription.predictions_used / subscription.predictions_limit) * 100)
      : 0;
    
    return successResponse({
      profile: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_date,
      },
      subscription: subscription ? {
        plan: subscription.plan,
        predictionsUsed: subscription.predictions_used,
        predictionsLimit: subscription.predictions_limit,
        usagePercentage,
        isActive: subscription.is_active,
        expiresAt: subscription.expires_at,
      } : null,
    });
    
  } catch (error) {
    return handleError(error);
  }
});