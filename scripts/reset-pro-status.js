/**
 * One-time script to reset pro status in the database
 * 
 * Run this in Expo Go by temporarily importing and calling it,
 * or use it as a reference for the SQL to run.
 * 
 * To use in Expo Go:
 * 1. In App.js, temporarily add: import './scripts/reset-pro-status';
 * 2. Reload the app
 * 3. Remove the import
 */

import * as SQLite from 'expo-sqlite';

const resetProStatus = () => {
  try {
    const db = SQLite.openDatabaseSync('statchomper.db');
    db.runSync('UPDATE settings SET isPro = 0 WHERE id = 1');
    console.log('✅ Pro status reset to FREE');
  } catch (error) {
    console.error('❌ Error resetting pro status:', error);
  }
};

// Auto-run when imported
resetProStatus();

export default resetProStatus;
