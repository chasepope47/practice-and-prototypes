// mobile/screens/TransactionsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, RefreshControl } from 'react-native';
import TransactionItem from '../components/TransactionItem';
import TransactionForm from '../components/TransactionForm';
import { useApi } from '../api/client';

export default function TransactionsScreen() {
  const { get } = useApi();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await get('/transactions');
      setTransactions(data);
    } catch (e) {
      console.log('Transactions load error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddSuccess = (created) => {
    // Prepend the new transaction
    setTransactions((prev) => [created, ...prev]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Transactions</Text>
        <Button title="+ Add" onPress={() => setShowForm(true)} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      />

      <TransactionForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleAddSuccess}
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
