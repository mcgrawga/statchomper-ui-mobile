import { getProStatus, setProStatus } from './database';

// Conditionally import RNIap - will be null in Expo Go
let RNIap = null;
try {
  RNIap = require('react-native-iap');
} catch (error) {
  console.log('react-native-iap not available (Expo Go) - using TEST_MODE');
}

// Product IDs
const PRODUCT_ID = 'pro_version';

// Flag to enable test mode (bypasses actual purchase)
const TEST_MODE = false; // Set to false when ready for production

let purchaseUpdateSubscription = null;
let purchaseErrorSubscription = null;

// Initialize IAP connection
export const initializeIAP = async () => {
  try {
    if (TEST_MODE) {
      console.log('IAP in TEST MODE - purchases will be simulated');
      return true;
    }
    
    // Check if RNIap is available (won't be in Expo Go)
    if (!RNIap || typeof RNIap.initConnection !== 'function') {
      console.log('IAP native module not available (Expo Go). Use TEST_MODE or build with EAS.');
      return false;
    }
    
    await RNIap.initConnection();
    console.log('IAP connection initialized');
    
    // Set up purchase listeners
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase) => {
      console.log('Purchase updated:', purchase);
      // Handle successful purchase
      if (purchase.productId === PRODUCT_ID) {
        handleSuccessfulPurchase(purchase);
      }
    });
    
    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.log('Purchase error:', error);
    });
    
    return true;
  } catch (error) {
    console.log('IAP initialization error (expected in Expo Go):', error.message);
    // Don't throw - allow app to continue with TEST_MODE
    return false;
  }
};

// Close IAP connection
export const closeIAP = async () => {
  try {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    
    if (!TEST_MODE && RNIap) {
      await RNIap.endConnection();
      console.log('IAP connection closed');
    }
  } catch (error) {
    console.error('Error closing IAP:', error);
  }
};

// Check current pro status
export const checkProStatus = () => {
  return getProStatus();
};

// Handle successful purchase
const handleSuccessfulPurchase = async (purchase) => {
  try {
    // Update pro status in database
    setProStatus(true);
    
    // Acknowledge/finish the purchase
    if (!TEST_MODE && RNIap) {
      await RNIap.finishTransaction({ purchase, isConsumable: false });
    }
    
    console.log('Pro version activated successfully');
    return true;
  } catch (error) {
    console.error('Error handling successful purchase:', error);
    return false;
  }
};

// Purchase pro version
export const purchaseProVersion = async () => {
  try {
    if (TEST_MODE || !RNIap) {
      console.log('TEST MODE: Simulating pro purchase');
      // In test mode or without native module, just update the database
      const success = setProStatus(true);
      if (success) {
        return { success: true, message: 'Pro version activated (TEST MODE)' };
      } else {
        return { success: false, message: 'Failed to activate pro version' };
      }
    }
    
    // Real purchase flow
    const products = await RNIap.getProducts([PRODUCT_ID]);
    
    if (!products || products.length === 0) {
      return { success: false, message: 'Product not found' };
    }
    
    const purchase = await RNIap.requestPurchase({
      sku: PRODUCT_ID,
      andDangerouslyFinishTransactionAutomaticallyIOS: false
    });
    
    return { success: true, message: 'Purchase successful' };
  } catch (error) {
    console.error('Error purchasing pro version:', error);
    
    // Handle user cancellation
    if (error.code === 'E_USER_CANCELLED') {
      return { success: false, message: 'Purchase cancelled', cancelled: true };
    }
    
    return { success: false, message: error.message || 'Purchase failed' };
  }
};

// Restore purchases
export const restorePurchases = async () => {
  try {
    if (TEST_MODE || !RNIap) {
      console.log('TEST MODE: Cannot restore purchases in test mode');
      return { success: false, message: 'Restore not available in test mode' };
    }
    
    const purchases = await RNIap.getAvailablePurchases();
    
    // Check if pro version was purchased
    const proPurchase = purchases.find(p => p.productId === PRODUCT_ID);
    
    if (proPurchase) {
      setProStatus(true);
      return { success: true, message: 'Pro version restored' };
    } else {
      return { success: false, message: 'No purchases found to restore' };
    }
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return { success: false, message: error.message || 'Failed to restore purchases' };
  }
};
