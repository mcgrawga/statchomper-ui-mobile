import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import HomeScreen from './screens/HomeScreen';
import AddGameScreen from './screens/AddGameScreen';
import EditGameScreen from './screens/EditGameScreen';
import { initDatabase } from './services/database';
import { PRODUCT_ID, updateProStatus } from './services/purchases';
import Colors from './constants/Colors';

// Only import useIAP if not in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';
console.log('isExpoGo:', isExpoGo, 'appOwnership:', Constants.appOwnership);
let useIAP = () => ({ connected: false, products: [], getProducts: () => {}, currentPurchase: null, finishTransaction: () => {}, getAvailablePurchases: () => {}, getPurchaseHistory: () => {} });
if (!isExpoGo) {
  try {
    useIAP = require('react-native-iap').useIAP;
  } catch (e) {
    console.log('IAP not available:', e.message);
  }
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  
  // Initialize IAP with useIAP hook
  const {
    connected,
    products,
    getProducts,
    currentPurchase,
    finishTransaction,
    getAvailablePurchases,
    getPurchaseHistory,
  } = useIAP();

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        console.log('Starting database setup...');
        const initResult = initDatabase();
        if (!initResult) {
          console.error('Database initialization returned false');
          setIsDbReady(true); // Continue anyway to show the error to the user
          return;
        }
        console.log('Database initialized');
        console.log('Database setup complete');
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // Set ready anyway so the app doesn't hang
        setIsDbReady(true);
      }
    };
    
    setupDatabase();
  }, []);

  // Just trying this to fix restore issues
  // useEffect(() => {
  //   const restoreAndAck = async () => {
  //     try {
  //       const purchases = await getAvailablePurchases();
  //       for (const p of purchases) {
  //         if (p.productId === PRODUCT_ID && !p.isAcknowledgedAndroid) {
  //           console.log('Acknowledging purchase:', p.transactionId);
  //           await finishTransaction({ purchase: p, isConsumable: false });
  //           updateProStatus(true); // unlock Pro after ACK
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error restoring purchases:', error);
  //     }
  //   };

  //   // Call it on app start
  //   restoreAndAck();
  // }, [finishTransaction]);

  // Handle purchase completion
  useEffect(() => {
    const handlePurchase = async () => {
      if (currentPurchase?.productId !== PRODUCT_ID) return;

      try {
        console.log('Processing purchase:', currentPurchase);

        // 🔴 CRITICAL: acknowledge FIRST
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });

        // ✅ only after ACK succeeds
        updateProStatus(true);

        console.log('Pro version activated successfully');
      } catch (error) {
        console.error('Error processing purchase:', error);
      }
    };

    handlePurchase();
  }, [currentPurchase, finishTransaction]);


  // Auto-restore purchases on startup
  useEffect(() => {
    const restorePurchases = async () => {
      console.log('[AUTO-RESTORE] Connected:', connected, 'Has getAvailablePurchases:', !!getAvailablePurchases, 'Has getPurchaseHistory:', !!getPurchaseHistory);
      if (connected && (getAvailablePurchases || getPurchaseHistory)) {
        try {
          console.log('[AUTO-RESTORE] Checking for existing purchases...');
          
          // Try getAvailablePurchases first
          let availablePurchases = null;
          try {
            console.log('[AUTO-RESTORE] Calling getAvailablePurchases...');
            availablePurchases = await getAvailablePurchases();
            console.log('[AUTO-RESTORE] getAvailablePurchases result:', availablePurchases);
            console.log('[AUTO-RESTORE] Available purchases:', JSON.stringify(availablePurchases));
          } catch (error) {
            console.log('[AUTO-RESTORE] getAvailablePurchases failed:', error);
          }
          
          // If getAvailablePurchases returned nothing or failed, try getPurchaseHistory
          if (!availablePurchases || availablePurchases.length === 0) {
            console.log('[AUTO-RESTORE] Trying getPurchaseHistory as fallback...');
            try {
              const purchaseHistory = await getPurchaseHistory();
              console.log('[AUTO-RESTORE] Purchase history:', JSON.stringify(purchaseHistory));
              availablePurchases = purchaseHistory;
            } catch (error) {
              console.log('[AUTO-RESTORE] getPurchaseHistory failed:', error);
            }
          }
          
          const proPurchase = availablePurchases?.find(p => p.productId === PRODUCT_ID);
          
          if (proPurchase) {
            console.log('[AUTO-RESTORE] Pro purchase found, updating database...');
            updateProStatus(true);
            console.log('[AUTO-RESTORE] Pro version restored and database updated');
          } else {
            console.log('[AUTO-RESTORE] No pro purchase found');
          }
        } catch (error) {
          console.error('[AUTO-RESTORE] Error restoring purchases:', error);
        }
      }
    };

    setTimeout(() => {
      restorePurchases();
    }, 1500);
  }, [connected]);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddGame" component={AddGameScreen} />
        <Stack.Screen name="EditGame" component={EditGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
