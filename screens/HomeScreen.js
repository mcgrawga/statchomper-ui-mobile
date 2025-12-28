import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PlayerCard from '../components/PlayerCard';
import { getAllGames, deleteGame } from '../services/database';
import Colors from '../constants/Colors';

export default function HomeScreen({ navigation, route }) {
  // Track which player is currently expanded (only one at a time)
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [shouldScrollToPlayer, setShouldScrollToPlayer] = useState(false);
  const flatListRef = useRef(null);
  const [games, setGames] = useState([]);

  // Load games from database
  const loadGames = () => {
    const allGames = getAllGames();
    setGames(allGames);
  };

  // Load games on mount
  useEffect(() => {
    loadGames();
  }, []);

  // Reload games when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadGames();
      
      // Check if we need to expand a specific player
      if (route.params?.expandPlayer) {
        const playerToExpand = route.params.expandPlayer;
        setExpandedPlayer(playerToExpand);
        setShouldScrollToPlayer(true);
        
        // Clear the param so it doesn't trigger again
        navigation.setParams({ expandPlayer: undefined });
      }
    }, [route.params?.expandPlayer])
  );

  // Group games by player
  const playerData = useMemo(() => {
    const grouped = {};
    
    games.forEach(game => {
      if (!grouped[game.player]) {
        grouped[game.player] = [];
      }
      grouped[game.player].push(game);
    });

    // Sort games within each player by date (most recent first)
    Object.keys(grouped).forEach(player => {
      grouped[player].sort((a, b) => 
        new Date(b.datePlayed) - new Date(a.datePlayed)
      );
    });

    // Convert to array and sort players alphabetically
    return Object.keys(grouped)
      .sort()
      .map(player => ({
        player,
        games: grouped[player]
      }));
  }, [games]);

  // Scroll to expanded player when data loads (only after adding a game)
  useEffect(() => {
    if (shouldScrollToPlayer && expandedPlayer && playerData.length > 0) {
      const playerIndex = playerData.findIndex(p => p.player === expandedPlayer);
      if (playerIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: playerIndex,
            animated: true,
            viewPosition: 0, // Position player at the top
          });
        }, 400);
      }
      setShouldScrollToPlayer(false);
    }
  }, [shouldScrollToPlayer, expandedPlayer, playerData]);

  const handleTogglePlayer = (playerName, index) => {
    if (expandedPlayer !== playerName) {
      // Close current player and open the new one
      setExpandedPlayer(playerName);
      
      // Scroll to the newly opened player
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: index,
          animated: true,
          viewPosition: 0, // Position player at the top
        });
      }, 100); // Short delay to allow the expand animation to start
    } else {
      // Close the currently open player - no scrolling
      setExpandedPlayer(null);
    }
  };

  const handleEditGame = (gameId) => {
    console.log('Edit game:', gameId);
    // TODO: Navigate to edit screen when implemented
  };

  const handleDeleteGame = (gameId) => {
    try {
      // Delete from database
      deleteGame(gameId);
      console.log('Game deleted from database:', gameId);
      
      // Remove game from state (for immediate UI update)
      setGames(prevGames => prevGames.filter(game => game._id !== gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
      // Optionally show error to user
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏀 Statchomper</Text>
      </View>

      {/* Page Heading */}
      <View style={styles.pageHeadingContainer}>
        <Text style={styles.pageHeading}>Players</Text>
        <Text style={styles.pageSubheading}>
          {playerData.length} {playerData.length === 1 ? 'player' : 'players'}
        </Text>
      </View>

      {/* Player List */}
      <FlatList
        ref={flatListRef}
        data={playerData}
        keyExtractor={(item) => item.player}
        renderItem={({ item, index }) => (
          <PlayerCard
            player={item.player}
            games={item.games}
            isExpanded={expandedPlayer === item.player}
            onToggle={() => handleTogglePlayer(item.player, index)}
            onEditGame={handleEditGame}
            onDeleteGame={handleDeleteGame}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0 });
          });
        }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddGame')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  pageHeadingContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  pageHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pageSubheading: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '300',
    marginTop: -2,
  },
});
