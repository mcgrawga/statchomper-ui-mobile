import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function GameCard({ game, onEdit }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPercentage = (value) => {
    if (value === 'n/a' || value === null || value === undefined) return 'n/a';
    // Handle if value is already a string percentage
    if (typeof value === 'string') {
      return value.includes('%') ? value : `${value}%`;
    }
    // Handle if value is a number
    return `${value.toFixed(1)}%`;
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.playerName}>{game.player}</Text>
          <Text style={styles.date}>{formatDate(game.datePlayed)}</Text>
          <Text style={styles.opponent}>vs. {game.opponent}</Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => onEdit && onEdit(game._id)}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {/* All Stats */}
        <View style={styles.statsGrid}>
          <StatItem label="Points" value={game.boxScore.points} />
          <StatItem label="Rebounds" value={game.boxScore.rebounds} />
          <StatItem label="Assists" value={game.boxScore.assists} />
          <StatItem label="Blocks" value={game.boxScore.blocks} />
          <StatItem label="Fouls" value={game.boxScore.fouls} />
          <StatItem label="Steals" value={game.boxScore.steals} />
          <StatItem label="Turnovers" value={game.boxScore.turnovers} />
          
          <StatItem 
            label="2-Pointers"
            value={`${game.boxScore.twoPointMade}/${game.boxScore.twoPointAttempts}${!isNaN(game.boxScore.twoPointPercentage) ? ` (${Math.round(game.boxScore.twoPointPercentage)}%)` : ''}`}
          />
          <StatItem 
            label="3-Pointers"
            value={`${game.boxScore.threePointMade}/${game.boxScore.threePointAttempts}${!isNaN(game.boxScore.threePointPercentage) ? ` (${Math.round(game.boxScore.threePointPercentage)}%)` : ''}`}
          />
          <StatItem 
            label="Free Throws"
            value={`${game.boxScore.freeThrowMade}/${game.boxScore.freeThrowAttempts}${!isNaN(game.boxScore.freeThrowPercentage) ? ` (${Math.round(game.boxScore.freeThrowPercentage)}%)` : ''}`}
          />
        </View>
      </View>
    </View>
  );
}

// Compact stat item for grid layout
function StatItem({ label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statItemLabel}>{label}</Text>
      <Text style={styles.statItemValue}> {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  opponent: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 20,
  },
  statsContainer: {
    padding: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
  },
  statItemLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statItemValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
