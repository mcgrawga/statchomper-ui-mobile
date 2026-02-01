import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Privacy Policy for HoopTrack</Text>
        <Text style={styles.lastUpdated}>Last updated: January 18, 2026</Text>
        
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.paragraph}>
          HoopTrack ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our mobile application collects, uses, and safeguards your information.
        </Text>
        
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          HoopTrack stores basketball game statistics and player information <Text style={styles.bold}>locally on your device only</Text>. We do not collect, transmit, or store any personal information on external servers.
        </Text>
        
        <Text style={styles.subsectionTitle}>Data Stored Locally:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Player names (first names only, as you choose to enter them)</Text>
          <Text style={styles.bulletItem}>• Game statistics (shots made/missed, points, dates)</Text>
          <Text style={styles.bulletItem}>• Your Pro version purchase status (managed by Google Play)</Text>
        </View>
        
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>All data is stored locally on your device to:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Display your game statistics and player performance</Text>
          <Text style={styles.bulletItem}>• Track shooting percentages and improvement over time</Text>
          <Text style={styles.bulletItem}>• Provide personalized insights based on your recorded games</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Data Storage and Security</Text>
        <Text style={styles.paragraph}>All game data is stored in a local SQLite database on your device. This data:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Remains on your device and is not transmitted to any servers</Text>
          <Text style={styles.bulletItem}>• Is protected by your device's security measures</Text>
          <Text style={styles.bulletItem}>• Will be deleted if you uninstall the app</Text>
        </View>
        
        <Text style={styles.sectionTitle}>In-App Purchases</Text>
        <Text style={styles.paragraph}>
          HoopTrack offers a Pro version as a one-time in-app purchase. All payment processing is handled securely by Google Play. We do not have access to your payment information. Purchase records are managed by Google Play according to their privacy policy.
        </Text>
        
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>HoopTrack uses the following third-party services:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            <Text style={styles.bold}>Google Play Billing:</Text> For processing in-app purchases. Subject to Google's Privacy Policy
          </Text>
          <Text style={styles.bulletItem}>
            <Text style={styles.bold}>Expo/React Native:</Text> Development framework. No data is sent to Expo servers in production builds
          </Text>
        </View>
        
        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.paragraph}>
          HoopTrack is safe for users of all ages. We do not knowingly collect personal information from anyone. All data remains local to the device.
        </Text>
        
        <Text style={styles.sectionTitle}>Data Deletion</Text>
        <Text style={styles.paragraph}>You can delete your data at any time by:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Deleting individual players or games within the app</Text>
          <Text style={styles.bulletItem}>• Uninstalling the app, which removes all local data</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
        </Text>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>If you have questions about this Privacy Policy, please contact us at:</Text>
        <Text style={styles.paragraph}>
          Email: support@hooptrackapp.com
        </Text>
        
        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>Since all data is stored locally on your device:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• You have complete control over your data</Text>
          <Text style={styles.bulletItem}>• You can export or delete data at any time</Text>
          <Text style={styles.bulletItem}>• No data is shared with third parties</Text>
          <Text style={styles.bulletItem}>• No data is used for advertising or analytics</Text>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    minWidth: 60,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bulletList: {
    marginLeft: 16,
    marginBottom: 16,
  },
  bulletItem: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
});
