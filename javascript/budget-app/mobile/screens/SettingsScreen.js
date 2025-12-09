// mobile/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function SettingsScreen() {
  const handleLogout = () => {
    // later: clear token via context or props
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Button title="Log out" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
});
