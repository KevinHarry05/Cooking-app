import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { FoodItem } from '@/types';

export const getMenuItems = async (): Promise<FoodItem[]> => {
  try {
    const menuCollection = collection(db, 'menuItems');
    const menuSnapshot = await getDocs(menuCollection);
    const menuItems: FoodItem[] = [];
    
    menuSnapshot.forEach((doc) => {
      const data = doc.data() as Omit<FoodItem, 'id'>;
      menuItems.push({
        id: doc.id,
        ...data
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

export const getMenuItemsByCategory = async (category: string): Promise<FoodItem[]> => {
  try {
    const menuCollection = collection(db, 'menuItems');
    const menuQuery = query(menuCollection, where('category', '==', category));
    const menuSnapshot = await getDocs(menuQuery);
    const menuItems: FoodItem[] = [];
    
    menuSnapshot.forEach((doc) => {
      const data = doc.data() as Omit<FoodItem, 'id'>;
      menuItems.push({
        id: doc.id,
        ...data
      });
    });
    
    return menuItems;
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const menuCollection = collection(db, 'categories');
    const categorySnapshot = await getDocs(menuCollection);
    const categories: string[] = [];
    
    categorySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        categories.push(data.name);
      }
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};