import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CartItem } from '@/types';

interface OrderSummaryItemProps {
  item: CartItem;
}

export default function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.quantity}>{item.quantity}x</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});