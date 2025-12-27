import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, TextInput } from 'react-native';
import GameCard from './GameCard';
import Colors from '../constants/Colors';

export default function PlayerCard({ player, games, isExpanded, onToggle, onEditGame }) {
  const [chevronRotation] = useState(new Animated.Value(0));
  const [filterText, setFilterText] = useState('');

  // Animate chevron rotation when expanded state changes
  React.useEffect(() => {
    Animated.timing(chevronRotation, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded]);

  const chevronRotate = chevronRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  // Filter games based on date and opponent
  const filteredGames = games.filter(game => {
    if (!filterText.trim()) return true;
    const searchText = filterText.toLowerCase();
    
    // Format date same way it's displayed in GameCard
    const formattedDate = game.datePlayed 
      ? new Date(game.datePlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()
      : '';
    
    const opponent = game.opponent ? game.opponent.toLowerCase() : '';
    return formattedDate.includes(searchText) || opponent.includes(searchText);
  });

  return (
    <View style={styles.container}>
      {/* Player Header Button */}
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.playerName}>{player}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{games.length}</Text>
          </View>
        </View>
        <Animated.Text 
          style={[
            styles.chevron,
            { transform: [{ rotate: chevronRotate }] }
          ]}
        >
          ›
        </Animated.Text>
      </TouchableOpacity>

      {/* Expanded Games List */}
      {isExpanded && (
        <View style={styles.gamesContainer}>
          {/* Filter Input */}
          <View style={styles.filterContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Filter by date or opponent..."
              placeholderTextColor={Colors.textSecondary}
              value={filterText}
              onChangeText={setFilterText}
            />
            {filterText.length > 0 && (
              <TouchableOpacity onPress={() => setFilterText('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Games List or Empty State */}
          {filteredGames.length > 0 ? (
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {filteredGames.map((game) => (
                <GameCard 
                  key={game._id}
                  game={game} 
                  onEdit={onEditGame}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏀</Text>
              <Text style={styles.emptyText}>No games found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filter</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'left',
    gap: 12,
  },
  badge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textSecondary,
    lineHeight: 36,
  },
  gamesContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  clearIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
