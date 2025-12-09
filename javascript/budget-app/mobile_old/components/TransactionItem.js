// mobile/components/TransactionItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TransactionItem({ transaction }) {
  const { date, type, category, note, amount } = transaction;
  const isExpense = type === 'expense';
  const color = isExpense ? '#ef4444' : '#16a34a';

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.category}>{category}</Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
      <Text style={[styles.amount, { color }]}>
        {isExpense ? '-' : '+'}${Math.abs(amount).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: { fontSize: 12, color: '#6b7280' },
  category: { fontSize: 14, fontWeight: '500' },
  note: { fontSize: 12, color: '#6b7280' },
  amount: { fontSize: 16, fontWeight: '600' },
});
