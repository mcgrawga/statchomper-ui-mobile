import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, PanResponder, Modal, Pressable } from 'react-native';
import GameCard from './GameCard';
import { useTheme } from '../contexts/ThemeContext';

export default function PlayerCard({ player, games, isExpanded, onToggle, onEditGame, onDeleteGame, onDeletePlayer }) {
  const { colors } = useTheme();
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
        // 1. Movement is primarily horizontal (more dx than dy)
        // 2. Swiping to the right (positive dx)
        const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isSwipingRight = gestureState.dx > 5;
        return isHorizontal && isSwipingRight;
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

  // Reset swipe state when games change (e.g., after adding a new game)
  React.useEffect(() => {
    if (isSwipedOpen) {
      swipeAnim.setValue(0);
      setIsSwipedOpen(false);
    }
  }, [games.length]);

  // Animate chevron rotation and content height when expanded state changes
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(chevronRotation, {
        toValue: isExpanded ? 1 : 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(contentHeight, {
        toValue: isExpanded ? 1 : 0,
        duration: 0,
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

  const dynamicStyles = getStyles(colors);
  
  return (
    <Animated.View style={[
      dynamicStyles.outerContainer,
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
        <View style={dynamicStyles.container}>
          {/* Action Buttons Behind */}
          <View style={dynamicStyles.actionButtons}>
            <TouchableOpacity 
              style={dynamicStyles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={dynamicStyles.deleteButton}
              onPress={handleDeletePress}
            >
              <Text style={dynamicStyles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        
        {/* Swipeable Content */}
        <Animated.View 
          style={[
            dynamicStyles.swipeableContent,
            { transform: [{ translateX: swipeAnim }] }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Player Header Button */}
          <TouchableOpacity 
            style={dynamicStyles.headerButton}
            onPress={onToggle}
            activeOpacity={0.7}
            disabled={isSwipedOpen}
          >
        <View style={dynamicStyles.headerLeft}>
          <Text style={dynamicStyles.playerName}>{player}</Text>
          <View style={dynamicStyles.badge}>
            <Text style={dynamicStyles.badgeText}>{games.length}</Text>
          </View>
        </View>
        <Animated.Text 
          style={[
            dynamicStyles.chevron,
            { transform: [{ rotate: chevronRotate }] }
          ]}
        >
          ›
        </Animated.Text>
      </TouchableOpacity>

      {/* Expanded Games List */}
      <Animated.View style={[
        dynamicStyles.gamesContainer,
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
          <View style={dynamicStyles.filterContainer}>
            <Text style={dynamicStyles.searchIcon}>🔍</Text>
            <TextInput
              style={dynamicStyles.filterInput}
              placeholder="Filter by date or opponent..."
              placeholderTextColor={colors.textSecondary}
              value={filterText}
              onChangeText={setFilterText}
            />
            {filterText.length > 0 && (
              <TouchableOpacity onPress={() => setFilterText('')}>
                <Text style={dynamicStyles.clearIcon}>✕</Text>
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
            <View style={dynamicStyles.emptyState}>
              <Text style={dynamicStyles.emptyIcon}>🏀</Text>
              <Text style={dynamicStyles.emptyText}>No games found</Text>
              <Text style={dynamicStyles.emptySubtext}>Try adjusting your filter</Text>
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
        <View style={dynamicStyles.confirmOverlay}>
          <View style={dynamicStyles.confirmDialog}>
            <Text style={dynamicStyles.confirmTitle}>Delete {player}?</Text>
            <Text style={dynamicStyles.confirmMessage}>
              This will permanently delete {player} and all {games.length} {games.length === 1 ? 'game' : 'games'}. This action cannot be undone.
            </Text>
            
            <View style={dynamicStyles.confirmButtons}>
              <TouchableOpacity 
                style={dynamicStyles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={dynamicStyles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={dynamicStyles.modalDeleteButton}
                onPress={handleConfirmDelete}
              >
                <Text style={dynamicStyles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </Animated.View>
    </Animated.View>
  );
}

const getStyles = (colors) => StyleSheet.create({
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
    backgroundColor: colors.background,
  },
  headerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadowColor,
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
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'left',
    gap: 12,
  },
  badge: {
    backgroundColor: colors.border,
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
    color: colors.textSecondary,
    lineHeight: 36,
  },
  gamesContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  clearIcon: {
    fontSize: 18,
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmDialog: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  confirmMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelButtonText: {
    color: colors.textPrimary,
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
