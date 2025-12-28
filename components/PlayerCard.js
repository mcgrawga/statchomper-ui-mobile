import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, PanResponder, Modal, Pressable } from 'react-native';
import GameCard from './GameCard';
import Colors from '../constants/Colors';

export default function PlayerCard({ player, games, isExpanded, onToggle, onEditGame, onDeleteGame, onDeletePlayer }) {
  const [chevronRotation] = useState(new Animated.Value(0));
  const [contentHeight] = useState(new Animated.Value(0));
  const [filterText, setFilterText] = useState('');
  
  // Swipe animation state
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const [isSwipedOpen, setIsSwipedOpen] = useState(false);
  
  // Delete animation state
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const marginAnim = useRef(new Animated.Value(16)).current;
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // PanResponder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond if:
        // 1. Player is not expanded
        // 2. Movement is primarily horizontal (more dx than dy)
        // 3. Swiping to the right (positive dx)
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isSwipingRight = gestureState.dx > 5;
        return !isExpanded && isHorizontal && isSwipingRight;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx < 176) {
          swipeAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Card width threshold is 50%
        if (gestureState.dx > 80) {
          // Swipe open - 176px total (8 + 76 + 8 + 76 + 8)
          Animated.spring(swipeAnim, {
            toValue: 176,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          setIsSwipedOpen(true);
        } else {
          // Swipe back closed
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          setIsSwipedOpen(false);
        }
      },
    })
  ).current;
  
  const handleCancel = () => {
    Animated.spring(swipeAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
    setIsSwipedOpen(false);
  };
  
  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    
    // Animate out
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
      if (onDeletePlayer) {
        onDeletePlayer(player);
      }
    });
  };

  // Animate chevron rotation and content height when expanded state changes
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(chevronRotation, {
        toValue: isExpanded ? 1 : 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentHeight, {
        toValue: isExpanded ? 1 : 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
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
    <Animated.View style={[
      styles.outerContainer,
      {
        marginBottom: marginAnim,
      },
    ]}>
      <Animated.View style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}>
        <View style={styles.container}>
          {/* Action Buttons Behind */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeletePress}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        
        {/* Swipeable Content */}
        <Animated.View 
          style={[
            styles.swipeableContent,
            { transform: [{ translateX: swipeAnim }] }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Player Header Button */}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onToggle}
            activeOpacity={0.7}
            disabled={isSwipedOpen}
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
      <Animated.View style={[
        styles.gamesContainer,
        {
          maxHeight: contentHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2000],
          }),
          opacity: contentHeight.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0, 0, 1],
          }),
          overflow: 'hidden',
        },
      ]}>
        <View>
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
            <View>
              {filteredGames.map((game) => (
                <GameCard 
                  key={game._id}
                  game={game} 
                  onEdit={onEditGame}
                  onDelete={onDeleteGame}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏀</Text>
              <Text style={styles.emptyText}>No games found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filter</Text>
            </View>
          )}
        </View>
      </Animated.View>
        </Animated.View>
      </View>
      
      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>Delete {player}?</Text>
            <Text style={styles.confirmMessage}>
              This will permanently delete {player} and all {games.length} {games.length === 1 ? 'game' : 'games'}. This action cannot be undone.
            </Text>
            
            <View style={styles.confirmButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalDeleteButton}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
  },
  actionButtons: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 68,
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  cancelButton: {
    width: 76,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    width: 76,
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  swipeableContent: {
    backgroundColor: Colors.background,
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
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDialog: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
