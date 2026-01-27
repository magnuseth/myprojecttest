/**
 * Get site settings and configuration
 * Endpoint: /site/settings
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { successResponse, handleError } from '../common/response.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get public site settings
    // This is a placeholder - you can create a SiteSettings entity later
    
    const settings = {
      features: {
        predictorsEnabled: true,
        multiLanguage: true,
        darkMode: true,
      },
      plans: [
        {
          id: 'free',
          name: 'Free',
          predictionsLimit: 10,
          price: 0,
        },
        {
          id: 'basic',
          name: 'Basic',
          predictionsLimit: 50,
          price: 249,
        },
        {
          id: 'pro',
          name: 'Pro',
          predictionsLimit: 250,
          price: 999,
        },
        {
          id: 'high_roller',
          name: 'High Roller',
          predictionsLimit: 1000,
          price: 9999,
        },
      ],
      supportedLanguages: ['en', 'ru', 'es', 'pt', 'tr', 'hi'],
      // Predictor backend configuration will be added here later
    };
    
    return successResponse(settings);
    
  } catch (error) {
    return handleError(error);
  }
});