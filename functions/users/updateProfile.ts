/**
 * Update user profile
 * Endpoint: /users/profile
 * Method: PATCH
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { successResponse, handleError, validationErrorResponse } from '../common/response.ts';
import { requireAuth } from '../common/guards.ts';

interface UpdateProfileInput {
  fullName?: string;
}

Deno.serve(async (req) => {
  try {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return authResult.error;
    }
    
    const { user, base44 } = authResult;
    
    const body: UpdateProfileInput = await req.json();
    
    // Validate input
    if (!body.fullName || body.fullName.trim().length < 2) {
      return validationErrorResponse({
        fullName: 'Full name must be at least 2 characters',
      });
    }
    
    // Update user via Base44 auth system
    await base44.auth.updateMe({
      full_name: body.fullName.trim(),
    });
    
    return successResponse({
      message: 'Profile updated successfully',
      fullName: body.fullName.trim(),
    });
    
  } catch (error) {
    return handleError(error);
  }
});