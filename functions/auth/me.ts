/**
 * Get current authenticated user
 * Endpoint: /auth/me
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
    
    // Get user subscription data
    const subscription = await base44.entities.Subscription.filter({
      user_email: user.email
    });
    
    return successResponse({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      subscription: subscription[0] || null,
    });
    
  } catch (error) {
    return handleError(error);
  }
});