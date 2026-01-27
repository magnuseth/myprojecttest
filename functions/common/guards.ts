/**
 * Authentication and authorization guards
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { unauthorizedResponse, forbiddenResponse } from './response.ts';

export const requireAuth = async (req: Request) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    
    if (!user) {
      return { error: unauthorizedResponse('Authentication required') };
    }
    
    return { user, base44 };
  } catch (error) {
    return { error: unauthorizedResponse('Invalid or expired session') };
  }
};

export const requireAdmin = async (req: Request) => {
  const authResult = await requireAuth(req);
  
  if (authResult.error) {
    return authResult;
  }
  
  if (authResult.user.role !== 'admin') {
    return { error: forbiddenResponse('Admin access required') };
  }
  
  return authResult;
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request) => {
    const authResult = await requireAuth(req);
    
    if (authResult.error) {
      return authResult;
    }
    
    if (!allowedRoles.includes(authResult.user.role)) {
      return { error: forbiddenResponse('Insufficient permissions') };
    }
    
    return authResult;
  };
};