// mobile/components/SummaryCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCard({ label, value, type }) {
  const color =
    type === 'income' ? '#16a34a' : type === 'expense' ? '#ef4444' : '#4f46e5';

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
});
