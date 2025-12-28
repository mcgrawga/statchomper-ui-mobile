import * as SQLite from 'expo-sqlite';
import { mockGames } from '../data/mockData';

let db;

// Initialize database and create tables
export const initDatabase = () => {
  try {
    if (!db) {
      db = SQLite.openDatabaseSync('statchomper.db');
      console.log('Database opened successfully');
    }
    
    // Create games table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player TEXT NOT NULL,
        datePlayed TEXT NOT NULL,
        opponent TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        twoPointMade INTEGER DEFAULT 0,
        twoPointAttempts INTEGER DEFAULT 0,
        twoPointPercentage TEXT DEFAULT 'n/a',
        threePointMade INTEGER DEFAULT 0,
        threePointAttempts INTEGER DEFAULT 0,
        threePointPercentage TEXT DEFAULT 'n/a',
        freeThrowMade INTEGER DEFAULT 0,
        freeThrowAttempts INTEGER DEFAULT 0,
        freeThrowPercentage TEXT DEFAULT 'n/a',
        rebounds INTEGER DEFAULT 0,
        assists INTEGER DEFAULT 0,
        steals INTEGER DEFAULT 0,
        blocks INTEGER DEFAULT 0,
        turnovers INTEGER DEFAULT 0,
        fouls INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Get database instance
const getDb = () => {
  if (!db) {
    console.log('Database not initialized, initializing now...');
    initDatabase();
  }
  if (!db) {
    throw new Error('Failed to initialize database');
  }
  return db;
};

// Seed database with mock data
export const seedDatabase = () => {
  try {
    const database = getDb();
    
    // Check if database is already seeded
    const result = database.getFirstSync('SELECT COUNT(*) as count FROM games');
    
    if (result && result.count > 0) {
      console.log('Database already seeded with', result.count, 'games');
      return;
    }
    
    console.log('Seeding database with', mockGames.length, 'games...');
    
    // Insert mock data using individual insert statements
    let successCount = 0;
    mockGames.forEach((game, index) => {
      try {
        database.runSync(
          `INSERT INTO games (
            player, datePlayed, opponent, points,
            twoPointMade, twoPointAttempts, twoPointPercentage,
            threePointMade, threePointAttempts, threePointPercentage,
            freeThrowMade, freeThrowAttempts, freeThrowPercentage,
            rebounds, assists, steals, blocks, turnovers, fouls
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          game.player,
          game.datePlayed,
          game.opponent,
          game.boxScore.points,
          game.boxScore.twoPointMade,
          game.boxScore.twoPointAttempts,
          game.boxScore.twoPointPercentage.toString(),
          game.boxScore.threePointMade,
          game.boxScore.threePointAttempts,
          game.boxScore.threePointPercentage.toString(),
          game.boxScore.freeThrowMade,
          game.boxScore.freeThrowAttempts,
          game.boxScore.freeThrowPercentage.toString(),
          game.boxScore.rebounds,
          game.boxScore.assists,
          game.boxScore.steals,
          game.boxScore.blocks,
          game.boxScore.turnovers,
          game.boxScore.fouls
        );
        successCount++;
      } catch (insertError) {
        console.error(`Error inserting game ${index + 1}:`, insertError);
      }
    });
    
    console.log(`Database seeded successfully with ${successCount} of ${mockGames.length} games`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Get all games
export const getAllGames = () => {
  try {
    const database = getDb();
    const games = database.getAllSync('SELECT * FROM games ORDER BY datePlayed DESC');
    
    // Transform to match the expected format
    return games.map(game => ({
      _id: game.id.toString(),
      player: game.player,
      datePlayed: game.datePlayed,
      opponent: game.opponent,
      boxScore: {
        points: game.points,
        twoPointMade: game.twoPointMade,
        twoPointAttempts: game.twoPointAttempts,
        twoPointPercentage: game.twoPointPercentage,
        threePointMade: game.threePointMade,
        threePointAttempts: game.threePointAttempts,
        threePointPercentage: game.threePointPercentage,
        freeThrowMade: game.freeThrowMade,
        freeThrowAttempts: game.freeThrowAttempts,
        freeThrowPercentage: game.freeThrowPercentage,
        rebounds: game.rebounds,
        assists: game.assists,
        steals: game.steals,
        blocks: game.blocks,
        turnovers: game.turnovers,
        fouls: game.fouls,
      }
    }));
  } catch (error) {
    console.error('Error getting all games:', error);
    return [];
  }
};

// Get games by player
export const getGamesByPlayer = (playerName) => {
  try {
    const database = getDb();
    const games = database.getAllSync(
      'SELECT * FROM games WHERE player = ? ORDER BY datePlayed DESC',
      [playerName]
    );
    
    return games.map(game => ({
      _id: game.id.toString(),
      player: game.player,
      datePlayed: game.datePlayed,
      opponent: game.opponent,
      boxScore: {
        points: game.points,
        twoPointMade: game.twoPointMade,
        twoPointAttempts: game.twoPointAttempts,
        twoPointPercentage: game.twoPointPercentage,
        threePointMade: game.threePointMade,
        threePointAttempts: game.threePointAttempts,
        threePointPercentage: game.threePointPercentage,
        freeThrowMade: game.freeThrowMade,
        freeThrowAttempts: game.freeThrowAttempts,
        freeThrowPercentage: game.freeThrowPercentage,
        rebounds: game.rebounds,
        assists: game.assists,
        steals: game.steals,
        blocks: game.blocks,
        turnovers: game.turnovers,
        fouls: game.fouls,
      }
    }));
  } catch (error) {
    console.error('Error getting games by player:', error);
    return [];
  }
};

// Get unique player names
export const getPlayers = () => {
  try {
    const database = getDb();
    const players = database.getAllSync(
      'SELECT DISTINCT player FROM games ORDER BY player ASC'
    );
    return players.map(p => p.player);
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

// Add a new game
export const addGame = (gameData) => {
  try {
    const database = getDb();
    const result = database.runSync(
      `INSERT INTO games (
        player, datePlayed, opponent, points,
        twoPointMade, twoPointAttempts, twoPointPercentage,
        threePointMade, threePointAttempts, threePointPercentage,
        freeThrowMade, freeThrowAttempts, freeThrowPercentage,
        rebounds, assists, steals, blocks, turnovers, fouls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      gameData.player,
      gameData.datePlayed,
      gameData.opponent,
      gameData.boxScore.points,
      gameData.boxScore.twoPointMade,
      gameData.boxScore.twoPointAttempts,
      gameData.boxScore.twoPointPercentage,
      gameData.boxScore.threePointMade,
      gameData.boxScore.threePointAttempts,
      gameData.boxScore.threePointPercentage,
      gameData.boxScore.freeThrowMade,
      gameData.boxScore.freeThrowAttempts,
      gameData.boxScore.freeThrowPercentage,
      gameData.boxScore.rebounds,
      gameData.boxScore.assists,
      gameData.boxScore.steals,
      gameData.boxScore.blocks,
      gameData.boxScore.turnovers,
      gameData.boxScore.fouls
    );
    
    console.log('Game added successfully with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding game:', error);
    throw error;
  }
};

// Delete a game
export const deleteGame = (gameId) => {
  try {
    const database = getDb();
    database.runSync('DELETE FROM games WHERE id = ?', [gameId]);
    console.log('Game deleted successfully');
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};

// Delete all games for a player
export const deletePlayerGames = (playerName) => {
  try {
    const database = getDb();
    const result = database.runSync('DELETE FROM games WHERE player = ?', [playerName]);
    console.log(`Deleted ${result.changes} games for player: ${playerName}`);
    return result.changes;
  } catch (error) {
    console.error('Error deleting player games:', error);
    throw error;
  }
};

// Update a game
export const updateGame = (gameId, gameData) => {
  try {
    const database = getDb();
    database.runSync(
      `UPDATE games SET
        player = ?, datePlayed = ?, opponent = ?, points = ?,
        twoPointMade = ?, twoPointAttempts = ?, twoPointPercentage = ?,
        threePointMade = ?, threePointAttempts = ?, threePointPercentage = ?,
        freeThrowMade = ?, freeThrowAttempts = ?, freeThrowPercentage = ?,
        rebounds = ?, assists = ?, steals = ?, blocks = ?, turnovers = ?, fouls = ?
      WHERE id = ?`,
      gameData.player,
      gameData.datePlayed,
      gameData.opponent,
      gameData.boxScore.points,
      gameData.boxScore.twoPointMade,
      gameData.boxScore.twoPointAttempts,
      gameData.boxScore.twoPointPercentage,
      gameData.boxScore.threePointMade,
      gameData.boxScore.threePointAttempts,
      gameData.boxScore.threePointPercentage,
      gameData.boxScore.freeThrowMade,
      gameData.boxScore.freeThrowAttempts,
      gameData.boxScore.freeThrowPercentage,
      gameData.boxScore.rebounds,
      gameData.boxScore.assists,
      gameData.boxScore.steals,
      gameData.boxScore.blocks,
      gameData.boxScore.turnovers,
      gameData.boxScore.fouls,
      gameId
    );
    
    console.log('Game updated successfully');
  } catch (error) {
    console.error('Error updating game:', error);
    throw error;
  }
};
