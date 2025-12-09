// mobile/screens/TransactionsScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import TransactionItem from '../components/TransactionItem';

const dummyData = [
  { id: '1', date: '2025-12-08', type: 'expense', category: 'Food', note: 'Taco Bell', amount: -12.5 },
  { id: '2', date: '2025-12-07', type: 'income', category: 'Salary', note: 'Paycheck', amount: 1500 },
];

export default function TransactionsScreen() {
  const handleAdd = () => {
    // later: open modal with TransactionForm
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Transactions</Text>
        <Button title="+ Add" onPress={handleAdd} />
      </View>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '600' },
  separator: { height: 1, backgroundColor: '#e5e7eb' },
});
