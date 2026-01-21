import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useIAP } from 'react-native-iap';
import HomeScreen from './screens/HomeScreen';
import AddGameScreen from './screens/AddGameScreen';
import EditGameScreen from './screens/EditGameScreen';
import { initDatabase, seedDatabase, clearDatabase } from './services/database';
import { PRODUCT_ID, updateProStatus } from './services/purchases';
import Colors from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [iapError, setIapError] = useState(null);
  
  // Initialize IAP with useIAP hook - wrap in try/catch for safety
  let iapHook = { connected: false, products: [], getProducts: () => {}, currentPurchase: null, finishTransaction: () => {}, getPurchaseHistory: () => {} };
  try {
    iapHook = useIAP();
  } catch (error) {
    console.error('IAP initialization error:', error);
    setIapError(error);
  }
  
  const {
    connected,
    products,
    getProducts,
    currentPurchase,
    finishTransaction,
    getPurchaseHistory,
  } = iapHook;

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
        
        // Temporarily seed database for screenshots
        clearDatabase();
        seedDatabase();
        console.log('Database seeded with mock data');
        
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

  // Load products when IAP connection is ready
  useEffect(() => {
    if (connected && getProducts) {
      try {
        console.log('IAP connected, loading products...');
        getProducts([PRODUCT_ID]);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }
  }, [connected]);

  // Handle purchase completion
  useEffect(() => {
    const handlePurchase = async () => {
      if (currentPurchase?.productId === PRODUCT_ID && finishTransaction) {
        try {
          console.log('Processing purchase:', currentPurchase);
          
          // Update pro status in database
          updateProStatus(true);
          
          // Finish the transaction
          await finishTransaction({ purchase: currentPurchase, isConsumable: false });
          
          console.log('Pro version activated successfully');
        } catch (error) {
          console.error('Error processing purchase:', error);
        }
      }
    };

    handlePurchase();
  }, [currentPurchase]);

  // Auto-restore purchases on startup
  useEffect(() => {
    const restorePurchases = async () => {
      if (connected && getPurchaseHistory) {
        try {
          const purchaseHistory = await getPurchaseHistory();
          const proPurchase = purchaseHistory?.find(p => p.productId === PRODUCT_ID);
          
          if (proPurchase) {
            updateProStatus(true);
            console.log('Pro version restored from purchase history');
          }
        } catch (error) {
          console.error('Error restoring purchases:', error);
        }
      }
    };

    restorePurchases();
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
