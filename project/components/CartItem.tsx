import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItem({ 
  item, 
  onIncrement, 
  onDecrement, 
  onRemove 
}: CartItemProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Pressable 
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Trash2 size={18} color="#FF3B30" />
          </Pressable>
        </View>
        
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <Pressable 
            style={styles.quantityButton}
            onPress={onDecrement}
            disabled={item.quantity <= 1}
          >
            <Minus size={18} color={item.quantity <= 1 ? '#CCC' : '#FF8C00'} />
          </Pressable>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <Pressable 
            style={styles.quantityButton}
            onPress={onIncrement}
          >
            <Plus size={18} color="#FF8C00" />
          </Pressable>
          
          <Text style={styles.itemTotal}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  price: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotal: {
    marginLeft: 'auto',
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
  },
});