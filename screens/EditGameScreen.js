import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  FlatList,
  Platform,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/Colors';
import { getPlayers, updateGame } from '../services/database';

export default function EditGameScreen({ navigation, route }) {
  const { game } = route.params;

  // Form state - Initialize with game data
  const [player, setPlayer] = useState(game.player);
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [date, setDate] = useState(new Date(game.datePlayed));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [opponent, setOpponent] = useState(game.opponent);
  const [players, setPlayers] = useState([]);
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const toastAnim = useRef(new Animated.Value(-100)).current;
  
  // Load players from database
  useEffect(() => {
    const loadPlayers = () => {
      const dbPlayers = getPlayers();
      setPlayers(dbPlayers);
    };
    loadPlayers();
  }, []);
  
  // Get unique player names from database
  const ADD_NEW_PLAYER = '+ Add New Player';
  const playerList = useMemo(() => {
    return [ADD_NEW_PLAYER, ...players.sort()];
  }, [players]);
  
  // Shooting stats - Initialize with game data
  const [twoPointMade, setTwoPointMade] = useState(game.boxScore.twoPointMade);
  const [twoPointAttempts, setTwoPointAttempts] = useState(game.boxScore.twoPointAttempts);
  const [threePointMade, setThreePointMade] = useState(game.boxScore.threePointMade);
  const [threePointAttempts, setThreePointAttempts] = useState(game.boxScore.threePointAttempts);
  const [freeThrowMade, setFreeThrowMade] = useState(game.boxScore.freeThrowMade);
  const [freeThrowAttempts, setFreeThrowAttempts] = useState(game.boxScore.freeThrowAttempts);
  
  // Other stats - Initialize with game data
  const [rebounds, setRebounds] = useState(game.boxScore.rebounds);
  const [assists, setAssists] = useState(game.boxScore.assists);
  const [steals, setSteals] = useState(game.boxScore.steals);
  const [blocks, setBlocks] = useState(game.boxScore.blocks);
  const [turnovers, setTurnovers] = useState(game.boxScore.turnovers);
  const [fouls, setFouls] = useState(game.boxScore.fouls);

  // Calculate points
  const calculatePoints = () => {
    return (twoPointMade * 2) + (threePointMade * 3) + freeThrowMade;
  };

  // Calculate percentage
  const calculatePercentage = (made, attempts) => {
    if (attempts === 0) return 'n/a';
    return ((made / attempts) * 100).toFixed(1) + '%';
  };

  // Quick-entry functions
  const handleMake = (type) => {
    if (type === '2pt') {
      setTwoPointMade(twoPointMade + 1);
      setTwoPointAttempts(twoPointAttempts + 1);
    } else if (type === '3pt') {
      setThreePointMade(threePointMade + 1);
      setThreePointAttempts(threePointAttempts + 1);
    } else if (type === 'ft') {
      setFreeThrowMade(freeThrowMade + 1);
      setFreeThrowAttempts(freeThrowAttempts + 1);
    }
  };

  const handleMiss = (type) => {
    if (type === '2pt') {
      setTwoPointAttempts(twoPointAttempts + 1);
    } else if (type === '3pt') {
      setThreePointAttempts(threePointAttempts + 1);
    } else if (type === 'ft') {
      setFreeThrowAttempts(freeThrowAttempts + 1);
    }
  };

  const handleIncrement = (setter, value) => {
    setter(value + 1);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const showSuccessToast = (playerName) => {
    setShowToast(true);
    
    // Slide in
    Animated.timing(toastAnim, {
      toValue: 20,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Wait 2 seconds, then slide out
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowToast(false);
          navigation.navigate('Home', { 
            expandPlayer: playerName
          });
        });
      }, 2000);
    });
  };

  const handleSubmit = () => {
    // Validation
    const playerName = player === ADD_NEW_PLAYER ? newPlayerName : player;
    if (!playerName.trim()) {
      Alert.alert('Error', player === ADD_NEW_PLAYER ? 'New player name is required' : 'Player name is required');
      return;
    }
    if (!opponent.trim()) {
      Alert.alert('Error', 'Opponent name is required');
      return;
    }

    // Create game object
    const updatedGame = {
      player: playerName.trim(),
      datePlayed: date.toISOString().split('T')[0],
      opponent: opponent.trim(),
      boxScore: {
        points: calculatePoints(),
        twoPointMade,
        twoPointAttempts,
        twoPointPercentage: twoPointAttempts === 0 ? 'n/a' : ((twoPointMade / twoPointAttempts) * 100).toFixed(1),
        threePointMade,
        threePointAttempts,
        threePointPercentage: threePointAttempts === 0 ? 'n/a' : ((threePointMade / threePointAttempts) * 100).toFixed(1),
        freeThrowMade,
        freeThrowAttempts,
        freeThrowPercentage: freeThrowAttempts === 0 ? 'n/a' : ((freeThrowMade / freeThrowAttempts) * 100).toFixed(1),
        rebounds,
        assists,
        steals,
        blocks,
        turnovers,
        fouls,
      }
    };

    try {
      // Update in database
      updateGame(game._id, updatedGame);
      
      // Show success toast and navigate
      showSuccessToast(playerName.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to save game. Please try again.');
      console.error('Error saving game:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Success Toast */}
      {showToast && (
        <Animated.View 
          style={[
            styles.toast,
            { transform: [{ translateY: toastAnim }] }
          ]}
        >
          <Text style={styles.toastIcon}>✓</Text>
          <Text style={styles.toastText}>Game saved successfully!</Text>
        </Animated.View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Game</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Player & Game Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Game Information</Text>
          
          <Text style={styles.label}>Player Name *</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowPlayerPicker(true)}
          >
            <Text style={[styles.dropdownButtonText, !player && styles.dropdownPlaceholder]}>
              {player || 'Select player'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {player === ADD_NEW_PLAYER && (
            <>
              <Text style={styles.label}>New Player Name *</Text>
              <TextInput
                style={styles.input}
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                placeholder="Enter new player name"
                placeholderTextColor={Colors.textLight}
              />
            </>
          )}

          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
            <Text style={styles.dateIcon}>📅</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Opponent *</Text>
          <TextInput
            style={styles.input}
            value={opponent}
            onChangeText={setOpponent}
            placeholder="Enter opponent name"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Shooting Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shooting Statistics</Text>
          
          {/* 2-Pointers */}
          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>2-Pointers</Text>
            <View style={styles.shootingInputRow}>
              <View style={styles.shootingInputGroup}>
                <Text style={styles.shootingInputLabel}>Made</Text>
                <TextInput
                  style={styles.shootingInput}
                  value={String(twoPointMade)}
                  onChangeText={(text) => setTwoPointMade(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.shootingInputGroup}>
                <Text style={styles.shootingInputLabel}>Attempts</Text>
                <TextInput
                  style={styles.shootingInput}
                  value={String(twoPointAttempts)}
                  onChangeText={(text) => setTwoPointAttempts(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.quickEntryRow}>
              <TouchableOpacity 
                style={[styles.button, styles.makeButton]}
                onPress={() => handleMake('2pt')}
              >
                <Text style={styles.buttonText}>+ Make</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.missButton]}
                onPress={() => handleMiss('2pt')}
              >
                <Text style={styles.buttonText}>- Miss</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3-Pointers */}
          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>3-Pointers</Text>
            <View style={styles.shootingInputRow}>
              <View style={styles.shootingInputGroup}>
                <Text style={styles.shootingInputLabel}>Made</Text>
                <TextInput
                  style={styles.shootingInput}
                  value={String(threePointMade)}
                  onChangeText={(text) => setThreePointMade(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.shootingInputGroup}>
                <Text style={styles.shootingInputLabel}>Attempts</Text>
                <TextInput
                  style={styles.shootingInput}
                  value={String(threePointAttempts)}
                  onChangeText={(text) => setThreePointAttempts(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.quickEntryRow}>
              <TouchableOpacity 
                style={[styles.button, styles.makeButton]}
                onPress={() => handleMake('3pt')}
              >
                <Text style={styles.buttonText}>+ Make</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.missButton]}
                onPress={() => handleMiss('3pt')}
              >
                <Text style={styles.buttonText}>- Miss</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Free Throws */}
          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>Free Throws</Text>
            <View style={styles.shootingInputRow}>
              <View style={styles.shootingInputGroup}>
                <Text style={styles.shootingInputLabel}>Made</Text>
                <TextInput
                  style={styles.shootingInput}
                  value={String(freeThrowMade)}
                  onChangeText={(text) => setFreeThrowMade(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.shootingInputGroup}>
                <Text style={styles.shootingInputLabel}>Attempts</Text>
                <TextInput
                  style={styles.shootingInput}
                  value={String(freeThrowAttempts)}
                  onChangeText={(text) => setFreeThrowAttempts(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.quickEntryRow}>
              <TouchableOpacity 
                style={[styles.button, styles.makeButton]}
                onPress={() => handleMake('ft')}
              >
                <Text style={styles.buttonText}>+ Make</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.missButton]}
                onPress={() => handleMiss('ft')}
              >
                <Text style={styles.buttonText}>- Miss</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Points Summary */}
          <View style={styles.pointsSummary}>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>{calculatePoints()}</Text>
          </View>
        </View>

        {/* Other Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Game Statistics</Text>
          
          <SimpleStat label="Rebounds" value={rebounds} onChange={setRebounds} onIncrement={() => handleIncrement(setRebounds, rebounds)} />
          <SimpleStat label="Assists" value={assists} onChange={setAssists} onIncrement={() => handleIncrement(setAssists, assists)} />
          <SimpleStat label="Steals" value={steals} onChange={setSteals} onIncrement={() => handleIncrement(setSteals, steals)} />
          <SimpleStat label="Blocks" value={blocks} onChange={setBlocks} onIncrement={() => handleIncrement(setBlocks, blocks)} />
          <SimpleStat label="Turnovers" value={turnovers} onChange={setTurnovers} onIncrement={() => handleIncrement(setTurnovers, turnovers)} />
          <SimpleStat label="Fouls" value={fouls} onChange={setFouls} onIncrement={() => handleIncrement(setFouls, fouls)} />
        </View>

        {/* Shooting Summary */}
        <View style={styles.card}>
          <Text style={styles.shootingSummaryTitle}>Shooting Summary</Text>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>POINTS SCORED</Text>
            <Text style={styles.summaryCardValue}>{calculatePoints()}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>2-POINTERS</Text>
            <Text style={styles.summaryCardValue}>
              {twoPointMade} for {twoPointAttempts}, {calculatePercentage(twoPointMade, twoPointAttempts)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>3-POINTERS</Text>
            <Text style={styles.summaryCardValue}>
              {threePointMade} for {threePointAttempts}, {calculatePercentage(threePointMade, threePointAttempts)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardLabel}>FREE THROWS</Text>
            <Text style={styles.summaryCardValue}>
              {freeThrowMade} for {freeThrowAttempts}, {calculatePercentage(freeThrowMade, freeThrowAttempts)}
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Game</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Player Picker Modal */}
      <Modal
        visible={showPlayerPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlayerPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Player</Text>
              <TouchableOpacity
                onPress={() => setShowPlayerPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={playerList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playerOption}
                  onPress={() => {
                    setPlayer(item);
                    setShowPlayerPicker(false);
                  }}
                >
                  <Text style={styles.playerOptionText}>{item}</Text>
                  {player === item && (
                    <Text style={styles.playerOptionCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Simple stat component with input and + button
function SimpleStat({ label, value, onChange, onIncrement }) {
  return (
    <View style={styles.simpleStatRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.simpleStatControl}>
        <TextInput
          style={styles.simpleStatInput}
          value={String(value)}
          onChangeText={(text) => onChange(parseInt(text) || 0)}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[styles.button, styles.incrementButton]}
          onPress={onIncrement}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 44,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dropdownButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: Colors.textLight,
  },
  dropdownIcon: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dateButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dateIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  playerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playerOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  playerOptionCheck: {
    fontSize: 20,
    color: Colors.success,
    fontWeight: '700',
  },
  statGroup: {
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  shootingInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  shootingInputGroup: {
    flex: 1,
  },
  shootingInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  shootingInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  quickEntryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeButton: {
    backgroundColor: Colors.success,
  },
  missButton: {
    backgroundColor: Colors.error,
  },
  incrementButton: {
    backgroundColor: Colors.success,
    flex: 0,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  statSummary: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pointsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  pointsLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  shootingSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  summaryCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  simpleStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  simpleStatControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  simpleStatInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    minWidth: 60,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    marginRight: 12,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
