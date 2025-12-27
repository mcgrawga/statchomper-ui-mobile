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
        <StatRow label="Points" value={game.boxScore.points} />
        <StatRow label="Rebounds" value={game.boxScore.rebounds} />
        <StatRow label="Assists" value={game.boxScore.assists} />
        <StatRow label="Blocks" value={game.boxScore.blocks} />
        <StatRow label="Fouls" value={game.boxScore.fouls} />
        <StatRow label="Steals" value={game.boxScore.steals} />
        <StatRow label="Turnovers" value={game.boxScore.turnovers} />
        
        {/* Shooting Stats */}
        <ShootingRow 
          label="2-Pointers"
          made={game.boxScore.twoPointMade}
          attempts={game.boxScore.twoPointAttempts}
          percentage={game.boxScore.twoPointPercentage}
        />
        <ShootingRow 
          label="3-Pointers"
          made={game.boxScore.threePointMade}
          attempts={game.boxScore.threePointAttempts}
          percentage={game.boxScore.threePointPercentage}
        />
        <ShootingRow 
          label="Free Throws"
          made={game.boxScore.freeThrowMade}
          attempts={game.boxScore.freeThrowAttempts}
          percentage={game.boxScore.freeThrowPercentage}
        />
      </View>
    </View>
  );
}

// Simple stat row component
function StatRow({ label, value }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// Shooting stat row component with made/attempts/percentage
function ShootingRow({ label, made, attempts, percentage }) {
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
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {made}/{attempts} ({formatPercentage(percentage)})
      </Text>
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
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
