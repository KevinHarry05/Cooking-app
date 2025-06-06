import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Clock, Package, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { Order } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch orders from Firebase
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data
      const mockOrders: Order[] = [
        {
          id: '1',
          items: [
            {
              id: '1',
              name: 'Classic Burger',
              description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce.',
              price: 9.99,
              category: 'Burgers',
              image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
              quantity: 2,
            },
            {
              id: '5',
              name: 'Iced Coffee',
              description: 'Cold-brewed coffee served over ice with cream and sugar.',
              price: 3.99,
              category: 'Drinks',
              image: 'https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?auto=compress&cs=tinysrgb&w=600',
              quantity: 1,
            },
          ],
          totalAmount: 23.97,
          status: 'delivered',
          createdAt: new Date('2023-06-15T14:30:00'),
        },
        {
          id: '2',
          items: [
            {
              id: '3',
              name: 'California Roll',
              description: 'Crab, avocado, and cucumber rolled in seaweed and rice.',
              price: 8.99,
              category: 'Sushi',
              image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=600',
              quantity: 2,
            },
          ],
          totalAmount: 17.98,
          status: 'processing',
          createdAt: new Date(),
        },
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color="#F5A623" />;
      case 'processing':
        return <Package size={20} color="#007AFF" />;
      case 'delivered':
        return <CheckCircle2 size={20} color="#4CAF50" />;
      case 'cancelled':
        return <Clock size={20} color="#FF3B30" />;
      default:
        return <Clock size={20} color="#999" />;
    }
  };
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#F5A623';
      case 'processing': return '#007AFF';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#FF3B30';
      default: return '#999';
    }
  };
  
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading your orders..." />;
  }
  
  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package size={64} color="#CCCCCC" />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>
          Your order history will appear here once you've placed an order.
        </Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                {getStatusIcon(item.status)}
                <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderItems}>
              {item.items.map((orderItem) => (
                <View key={orderItem.id} style={styles.orderItem}>
                  <Text style={styles.itemQuantity}>{orderItem.quantity}x</Text>
                  <Text style={styles.itemName}>{orderItem.name}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${item.totalAmount.toFixed(2)}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  list: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
    marginRight: 8,
    width: 24,
  },
  itemName: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
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
  },
});