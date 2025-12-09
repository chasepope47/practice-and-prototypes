// mobile/components/TransactionForm.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApi } from '../api/client';

const DEFAULT_VALUES = {
  amount: '',
  type: 'expense',
  category: 'Food',
  date: '',
  note: '',
};

export default function TransactionForm({ visible, onClose, onSuccess }) {
  const { post } = useApi();
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      const today = new Date().toISOString().slice(0, 10);
      setValues({ ...DEFAULT_VALUES, date: today });
      setError('');
    }
  }, [visible]);

  const handleChange = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');

      const amountNum = parseFloat(values.amount);
      if (isNaN(amountNum)) {
        setError('Amount must be a number');
        setSaving(false);
        return;
      }

      const body = {
        amount: amountNum,
        type: values.type,
        category: values.category,
        date: values.date,
        note: values.note || undefined,
      };

      const created = await post('/transactions', body);
      onSuccess?.(created);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>New transaction</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={values.amount}
            onChangeText={(text) => handleChange('amount', text)}
          />

          <Picker
            selectedValue={values.type}
            onValueChange={(value) => handleChange('type', value)}
            style={styles.input}
          >
            <Picker.Item label="Expense" value="expense" />
            <Picker.Item label="Income" value="income" />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Category (e.g. Food, Rent)"
            value={values.category}
            onChangeText={(text) => handleChange('category', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={values.date}
            onChangeText={(text) => handleChange('date', text)}
          />

          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Note (optional)"
            value={values.note}
            onChangeText={(text) => handleChange('note', text)}
            multiline
          />

          <View style={styles.actions}>
            <Button title="Cancel" onPress={onClose} />
            <Button
              title={saving ? 'Saving...' : 'Save'}
              onPress={handleSubmit}
              disabled={saving}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
