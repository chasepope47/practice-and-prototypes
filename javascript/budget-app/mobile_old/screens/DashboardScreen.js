// mobile/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import SummaryCard from '../components/SummaryCard';
import { useApi } from '../api/client';

export default function DashboardScreen() {
  const { get } = useApi();
  const [monthString] = useState(() => {
    const d = new Date();
    return d.toLocaleString('default', { month: 'long', year: 'numeric' });
  });
  const [monthParam] = useState(() => {
    const d = new Date();
    // YYYY-MM
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const transactions = await get(`/transactions?month=${monthParam}`);
      let inc = 0;
      let exp = 0;
      for (const t of transactions) {
        if (t.type === 'income') inc += t.amount;
        if (t.type === 'expense') exp += t.amount;
      }
      setIncome(inc);
      setExpenses(exp);
    } catch (e) {
      console.log('Dashboard load error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const net = income - expenses;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>{monthString}</Text>

      <View style={styles.cardsRow}>
        <SummaryCard label="Income" value={`$${income.toFixed(2)}`} type="income" />
        <SummaryCard label="Expenses" value={`$${expenses.toFixed(2)}`} type="expense" />
      </View>
      <View style={styles.cardsRow}>
        <SummaryCard
          label="Net"
          value={`${net >= 0 ? '+' : '-'}$${Math.abs(net).toFixed(2)}`}
          type="net"
        />
      </View>

      <Text style={styles.sectionTitle}>Charts (later)</Text>
      <Text style={styles.body}>
        You can plug in a chart library to visualize this data (pie chart by category, bar chart
        income vs expenses, etc.).
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sectionTitle: { marginTop: 24, fontSize: 16, fontWeight: '500' },
  body: { marginTop: 8, fontSize: 14, color: '#4b5563' },
});
