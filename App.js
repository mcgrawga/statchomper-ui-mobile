import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddGameScreen from './screens/AddGameScreen';
import EditGameScreen from './screens/EditGameScreen';
import { initDatabase, seedDatabase } from './services/database';
import Colors from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

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
        console.log('Database initialized, now seeding...');
        seedDatabase();
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
