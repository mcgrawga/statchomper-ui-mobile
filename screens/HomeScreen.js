import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Switch
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PlayerCard from '../components/PlayerCard';
import { getAllGames, deleteGame, deletePlayerGames } from '../services/database';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation, route }) {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  // Track which player is currently expanded (only one at a time)
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  const [shouldScrollToPlayer, setShouldScrollToPlayer] = useState(false);
  const flatListRef = useRef(null);
  const [games, setGames] = useState([]);
  const lastExpandParam = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

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
      
      // Check if expandPlayer param exists
      const currentExpandParam = route.params?.expandPlayer;
      
      if (currentExpandParam) {
        // Expand this player
        setExpandedPlayer(currentExpandParam);
        setShouldScrollToPlayer(true);
        
        // Clear the param and reset ref so it can trigger again
        navigation.setParams({ expandPlayer: undefined });
        lastExpandParam.current = null;
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
    // Find the game by ID
    const game = games.find(g => g._id === gameId);
    if (game) {
      navigation.navigate('EditGame', { game });
    }
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

  const handleDeletePlayer = (playerName) => {
    try {
      // Delete all games for this player from database
      deletePlayerGames(playerName);
      console.log('Deleted all games for player:', playerName);
      
      // Remove all games for this player from state (for immediate UI update)
      setGames(prevGames => prevGames.filter(game => game.player !== playerName));
      
      // Close expansion if this player was expanded
      if (expandedPlayer === playerName) {
        setExpandedPlayer(null);
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      // Optionally show error to user
    }
  };

  const handleOpenPrivacyPolicy = () => {
    setShowMenu(false);
    navigation.navigate('PrivacyPolicy');
  };

  const handleToggleDarkMode = (value) => {
    toggleDarkMode(value);
  };

  const dynamicStyles = getStyles(colors);
  
  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.headerTitleContainer}>
          <Text style={dynamicStyles.headerIcon}>🏀</Text>
          <Text style={dynamicStyles.headerTitle}>HoopTrack</Text>
        </View>
        <TouchableOpacity 
          style={dynamicStyles.menuButton}
          onPress={() => setShowMenu(true)}
          activeOpacity={0.7}
        >
          <Feather name="more-vertical" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Page Heading */}
      <View style={dynamicStyles.pageHeadingContainer}>
        <Text style={dynamicStyles.pageHeading}>Players</Text>
        <Text style={dynamicStyles.pageSubheading}>
          {playerData.length} {playerData.length === 1 ? 'player' : 'players'}
        </Text>
      </View>

      {/* Empty State */}
      {playerData.length === 0 ? (
        <View style={dynamicStyles.emptyState}>
          <Text style={dynamicStyles.emptyStateTitle}>No Games Yet</Text>
          <Text style={dynamicStyles.emptyStateText}>
            Tap the + button below to add your first game
          </Text>
          <Text style={dynamicStyles.emptyStateIcon}>👇</Text>
        </View>
      ) : (
        /* Player List */
        <FlatList
          ref={flatListRef}
          data={playerData}
          extraData={games}
          keyExtractor={(item) => `${item.player}-${item.games.map(g => g._id).join('-')}`}
          renderItem={({ item, index }) => (
            <PlayerCard
              player={item.player}
              games={item.games}
              isExpanded={expandedPlayer === item.player}
              onToggle={() => handleTogglePlayer(item.player, index)}
              onEditGame={handleEditGame}
              onDeleteGame={handleDeleteGame}
              onDeletePlayer={handleDeletePlayer}
            />
          )}
          contentContainerStyle={dynamicStyles.listContent}
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
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={dynamicStyles.fab}
        onPress={() => {
          setExpandedPlayer(null);
          navigation.setParams({ expandPlayer: undefined });
          navigation.navigate('AddGame');
        }}
      >
        <Text style={dynamicStyles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={showMenu}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={dynamicStyles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={dynamicStyles.menuContainer}>
            <TouchableOpacity 
              style={dynamicStyles.menuItem}
              onPress={() => {
                setShowMenu(false);
                handleOpenPrivacyPolicy();
              }}
            >
              <Feather name="lock" size={18} color={colors.textSecondary} />
              <Text style={dynamicStyles.menuItemText}>Privacy Policy</Text>
            </TouchableOpacity>
            
            <View style={dynamicStyles.menuDivider} />
            
            <View style={dynamicStyles.menuItem}>
              <Feather name="moon" size={18} color={colors.textSecondary} />
              <Text style={dynamicStyles.menuItemText}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 32,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerIcon: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    marginLeft: 'auto',
    paddingRight: 4,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  pageHeadingContainer: {
    backgroundColor: colors.background,
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
    color: colors.textPrimary,
  },
  pageSubheading: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowColor,
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
