import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function GameCard({ game, onEdit, onDelete }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const marginAnim = useRef(new Animated.Value(12)).current;
  
  const handleDelete = () => {
    // Animate the card out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(marginAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // After animation completes, call parent's onDelete
      if (onDelete) {
        onDelete(game._id);
      }
    });
  };
  
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
    <Animated.View style={[
      {
        marginBottom: marginAnim,
        overflow: 'hidden',
      },
    ]}>
      <Animated.View style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}>
        <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.playerName}>{game.player}</Text>
          <Text style={styles.date}>{formatDate(game.datePlayed)}</Text>
          <Text style={styles.opponent}>vs. {game.opponent}</Text>
        </View>
        <MenuButton game={game} onDelete={handleDelete} />
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
      </Animated.View>
    </Animated.View>
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

// Menu button component
function MenuButton({ game, onDelete }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = React.useRef(null);
  
  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setMenuVisible(true);
      });
    }
  };
  
  const handleDeletePress = () => {
    setMenuVisible(false);
    setDeleteConfirmVisible(true);
  };
  
  const handleConfirmDelete = () => {
    setDeleteConfirmVisible(false);
    if (onDelete) {
      onDelete();
    }
  };
  
  return (
    <>
      <TouchableOpacity 
        ref={buttonRef}
        style={styles.menuButton}
        onPress={handlePress}
      >
        <Text style={styles.menuIcon}>⋯</Text>
      </TouchableOpacity>
      
      {/* Menu Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.menuOverlay} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, { 
            top: buttonLayout.y + buttonLayout.height,
            right: 16
          }]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                // Edit action will go here
              }}
            >
              <Feather name="edit-2" size={16} color="#666" />
              <Text style={styles.menuItemText}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDeletePress}
            >
              <Feather name="trash-2" size={16} color="#d32f2f" />
              <Text style={[styles.menuItemText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={deleteConfirmVisible}
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>Delete {game.player}'s game?</Text>
            <Text style={styles.confirmMessage}>Are you sure? This can NOT be undone.</Text>
            
            <View style={styles.confirmButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setDeleteConfirmVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleConfirmDelete}
              >
                <Feather name="trash-2" size={16} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  deleteText: {
    color: '#d32f2f',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmDialog: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#d32f2f',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
