import { addDoc, collection, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CartItem, Order } from '@/types';

export const createOrder = async (items: CartItem[], totalAmount: number): Promise<string> => {
  try {
    const orderData = {
      items,
      totalAmount,
      status: 'pending',
      createdAt: Timestamp.now()
    };
    
    const orderRef = await addDoc(collection(db, 'orders'), orderData);
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderHistory = async (userId: string): Promise<Order[]> => {
  try {
    const orderCollection = collection(db, 'orders');
    const orderQuery = query(
      orderCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const orderSnapshot = await getDocs(orderQuery);
    const orders: Order[] = [];
    
    orderSnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        items: data.items,
        totalAmount: data.totalAmount,
        status: data.status,
        createdAt: data.createdAt.toDate()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};