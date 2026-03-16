import { Purchases } from '@revenuecat/purchases-js';

const revenueCatApiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;

let isConfigured = false;
let mockPurchases: any = null;

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

if (!revenueCatApiKey) {
  if (isLocal) console.warn('Missing RevenueCat Public API Key. App will run in demo mode.');
  mockPurchases = {
    getOfferings: async () => ({
      current: {
        monthly: { identifier: 'mock-monthly' },
        annual: { identifier: 'mock-annual' }
      }
    }),
    purchasePackage: async (pkg: any) => {
      console.log('Mock purchase for', pkg.identifier);
      return { customerInfo: {} };
    }
  };
} else {
  try {
    // RC Web Billing keys usually start with 'strp_'
    if (isLocal && !revenueCatApiKey.startsWith('strp_')) {
       console.info('RevenueCat: Standard API key detected on localhost. Full subscription features may require a Web Billing key.');
    }
    
    if (typeof window !== 'undefined' && Purchases.configure) {
      Purchases.configure(revenueCatApiKey, 'app_user_id'); 
      console.log('RevenueCat initialized successfully');
      isConfigured = true;
    }
  } catch (err) {
    // If it's the specific "Invalid API key" error on localhost, we can downgrade to a warning
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (isLocal && errorMessage.includes('Invalid API key')) {
      console.warn('RevenueCat: Invalid API key for localhost. Subscription features will be disabled.');
    } else {
      console.error('Failed to initialize RevenueCat:', err);
    }
  }
}

export const purchases = isConfigured ? Purchases.getSharedInstance() : mockPurchases;
