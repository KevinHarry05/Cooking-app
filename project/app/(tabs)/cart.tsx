import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import CartItem from '@/components/CartItem';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Trash2 } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { createOrder } from '@/services/orderService';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart first.');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, this would create the order in Firebase
      // const orderId = await createOrder(items, getTotal());
      
      // For demo purposes, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearCart();
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const confirmClearCart = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };
  
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={64} color="#CCCCCC" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add some delicious food from the menu to get started.
        </Text>
        <Pressable 
          style={styles.browseButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.browseButtonText}>Browse Menu</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cartTitle}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
        <Pressable 
          style={styles.clearButton}
          onPress={confirmClearCart}
        >
          <Trash2 size={18} color="#FF3B30" />
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Animated.View 
            entering={FadeInUp.delay(50 * index)}
            exiting={FadeOutDown}
          >
            <CartItem
              item={item}
              onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
              onDecrement={() => {
                if (item.quantity > 1) {
                  updateQuantity(item.id, item.quantity - 1);
                }
              }}
              onRemove={() => removeItem(item.id)}
            />
          </Animated.View>
        )}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${getTotal().toFixed(2)}</Text>
        </View>
        
        <Pressable 
          style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          <Text style={styles.checkoutText}>
            {loading ? 'Processing...' : 'Checkout'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFF',
  },
  cartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    marginLeft: 4,
    color: '#FF3B30',
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#FFC182',
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});