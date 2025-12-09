// mobile/screens/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SummaryCard from '../components/SummaryCard';

export default function DashboardScreen() {
  // later: fetch real data from /transactions
  const month = 'December 2025';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>{month}</Text>

      <View style={styles.cardsRow}>
        <SummaryCard label="Income" value="$3,200" type="income" />
        <SummaryCard label="Expenses" value="$2,150" type="expense" />
      </View>
      <View style={styles.cardsRow}>
        <SummaryCard label="Net" value="+$1,050" type="net" />
      </View>

      {/* later: charts and quick add form */}
      <Text style={styles.sectionTitle}>Coming soon: charts + quick add</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '500',
  },
});
