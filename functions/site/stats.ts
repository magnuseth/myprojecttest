/**
 * Get site statistics
 * Endpoint: /site/stats
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { successResponse, handleError } from '../common/response.ts';
import { requireAdmin } from '../common/guards.ts';

Deno.serve(async (req) => {
  try {
    // Admin only endpoint
    const authResult = await requireAdmin(req);
    
    if (authResult.error) {
      return authResult.error;
    }
    
    const { base44 } = authResult;
    
    // Get all users
    const users = await base44.asServiceRole.entities.User.list();
    
    // Get all subscriptions
    const subscriptions = await base44.asServiceRole.entities.Subscription.list();
    
    // Calculate statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active !== false).length;
    
    const planDistribution = subscriptions.reduce((acc: any, sub: any) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1;
      return acc;
    }, {});
    
    const totalPredictionsUsed = subscriptions.reduce(
      (sum: number, sub: any) => sum + (sub.predictions_used || 0),
      0
    );
    
    // Get users created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = users.filter(u => {
      const created = new Date(u.created_date);
      return created >= today;
    }).length;
    
    return successResponse({
      users: {
        total: totalUsers,
        active: activeUsers,
        newToday: newUsersToday,
      },
      subscriptions: {
        planDistribution,
        totalPredictionsUsed,
      },
      // Predictor stats will be integrated here later
      predictors: {
        // This section is reserved for predictor backend integration
        totalPredictions: totalPredictionsUsed,
        // Per-game stats will be added when predictor backend is connected
      },
    });
    
  } catch (error) {
    return handleError(error);
  }
});