import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  RefreshControl,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import FoodCard from '@/components/FoodCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { useCartStore } from '@/store/useCartStore';
import { FoodItem } from '@/types';
import Animated, { 
  FadeInUp, 
  Layout, 
  ZoomIn,
  SlideInRight,
  FadeInDown,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    let result = menuItems;
    
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(result);
  }, [selectedCategory, menuItems, searchQuery]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const categoriesData = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Street Food', 'Desserts', 'Beverages', 'Fast Food'];
      
      const menuData: FoodItem[] = [
        // North Indian
        {
          id: '1',
          name: 'Butter Chicken',
          description: 'Tender chicken in rich, creamy tomato gravy with butter and aromatic spices.',
          price: 349,
          category: 'North Indian',
          image: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.5,
          numReviews: 128
        },
        {
          id: '2',
          name: 'Paneer Tikka Masala',
          description: 'Grilled cottage cheese cubes in spicy tomato-based curry with bell peppers.',
          price: 299,
          category: 'North Indian',
          image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.3,
          numReviews: 95
        },
        {
          id: '3',
          name: 'Dal Makhani',
          description: 'Creamy black lentils slow-cooked with butter, cream, and aromatic spices.',
          price: 249,
          category: 'North Indian',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.6,
          numReviews: 156
        },
        
        // South Indian
        {
          id: '4',
          name: 'Masala Dosa',
          description: 'Crispy rice crepe filled with spiced potato mixture, served with coconut chutney.',
          price: 149,
          category: 'South Indian',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.8,
          numReviews: 256
        },
        {
          id: '5',
          name: 'Idli Sambar',
          description: 'Steamed rice cakes served with lentil curry and coconut chutney.',
          price: 99,
          category: 'South Indian',
          image: 'https://images.pexels.com/photos/5560052/pexels-photo-5560052.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.4,
          numReviews: 189
        },
        {
          id: '6',
          name: 'Chicken Biryani',
          description: 'Fragrant basmati rice layered with spiced chicken and aromatic herbs.',
          price: 399,
          category: 'South Indian',
          image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.7,
          numReviews: 312
        },
        
        // Chinese
        {
          id: '7',
          name: 'Hakka Noodles',
          description: 'Stir-fried noodles with vegetables and soy sauce in authentic Chinese style.',
          price: 199,
          category: 'Chinese',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.2,
          numReviews: 143
        },
        {
          id: '8',
          name: 'Manchurian',
          description: 'Deep-fried vegetable balls in tangy and spicy Indo-Chinese sauce.',
          price: 179,
          category: 'Chinese',
          image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.1,
          numReviews: 87
        },
        {
          id: '9',
          name: 'Sweet & Sour Chicken',
          description: 'Crispy chicken pieces tossed in sweet and tangy sauce with bell peppers.',
          price: 329,
          category: 'Chinese',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.4,
          numReviews: 201
        },
        
        // Italian
        {
          id: '10',
          name: 'Margherita Pizza',
          description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil leaves.',
          price: 449,
          category: 'Italian',
          image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.6,
          numReviews: 278
        },
        {
          id: '11',
          name: 'Chicken Alfredo Pasta',
          description: 'Creamy fettuccine pasta with grilled chicken in rich alfredo sauce.',
          price: 379,
          category: 'Italian',
          image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.5,
          numReviews: 165
        },
        {
          id: '12',
          name: 'Lasagna',
          description: 'Layered pasta with meat sauce, cheese, and béchamel, baked to perfection.',
          price: 429,
          category: 'Italian',
          image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.7,
          numReviews: 134
        },
        
        // Mexican
        {
          id: '13',
          name: 'Chicken Burrito',
          description: 'Flour tortilla filled with seasoned chicken, rice, beans, and fresh salsa.',
          price: 299,
          category: 'Mexican',
          image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.3,
          numReviews: 112
        },
        {
          id: '14',
          name: 'Beef Tacos',
          description: 'Soft corn tortillas with seasoned ground beef, lettuce, and cheese.',
          price: 249,
          category: 'Mexican',
          image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.4,
          numReviews: 98
        },
        {
          id: '15',
          name: 'Quesadilla',
          description: 'Grilled tortilla filled with cheese, chicken, and peppers, served with guacamole.',
          price: 279,
          category: 'Mexican',
          image: 'https://images.pexels.com/photos/7613568/pexels-photo-7613568.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.2,
          numReviews: 76
        },
        
        // Thai
        {
          id: '16',
          name: 'Pad Thai',
          description: 'Stir-fried rice noodles with shrimp, tofu, bean sprouts, and tamarind sauce.',
          price: 329,
          category: 'Thai',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.5,
          numReviews: 187
        },
        {
          id: '17',
          name: 'Green Curry',
          description: 'Spicy coconut curry with chicken, Thai basil, and vegetables.',
          price: 349,
          category: 'Thai',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.6,
          numReviews: 145
        },
        {
          id: '18',
          name: 'Tom Yum Soup',
          description: 'Hot and sour soup with shrimp, mushrooms, and aromatic Thai herbs.',
          price: 199,
          category: 'Thai',
          image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.3,
          numReviews: 92
        },
        
        // Street Food
        {
          id: '19',
          name: 'Pani Puri',
          description: 'Crispy hollow puris filled with spicy tangy water, chutneys, and potatoes.',
          price: 79,
          category: 'Street Food',
          image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.7,
          numReviews: 234
        },
        {
          id: '20',
          name: 'Vada Pav',
          description: 'Mumbai\'s favorite street food - spiced potato fritter in a bun with chutneys.',
          price: 49,
          category: 'Street Food',
          image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.5,
          numReviews: 198
        },
        {
          id: '21',
          name: 'Chole Bhature',
          description: 'Spicy chickpea curry served with deep-fried bread and pickles.',
          price: 149,
          category: 'Street Food',
          image: 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.6,
          numReviews: 167
        },
        
        // Fast Food
        {
          id: '22',
          name: 'Classic Burger',
          description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce in a sesame bun.',
          price: 199,
          category: 'Fast Food',
          image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.4,
          numReviews: 289
        },
        {
          id: '23',
          name: 'Chicken Wings',
          description: 'Crispy chicken wings tossed in buffalo sauce, served with ranch dip.',
          price: 249,
          category: 'Fast Food',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.3,
          numReviews: 156
        },
        {
          id: '24',
          name: 'French Fries',
          description: 'Golden crispy potato fries seasoned with salt and herbs.',
          price: 99,
          category: 'Fast Food',
          image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.2,
          numReviews: 203
        },
        
        // Desserts
        {
          id: '25',
          name: 'Chocolate Brownie',
          description: 'Rich, fudgy chocolate brownie served warm with vanilla ice cream.',
          price: 149,
          category: 'Desserts',
          image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.8,
          numReviews: 245
        },
        {
          id: '26',
          name: 'Gulab Jamun',
          description: 'Soft milk dumplings soaked in rose-flavored sugar syrup.',
          price: 99,
          category: 'Desserts',
          image: 'https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.7,
          numReviews: 178
        },
        {
          id: '27',
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
          price: 199,
          category: 'Desserts',
          image: 'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.6,
          numReviews: 134
        },
        
        // Beverages
        {
          id: '28',
          name: 'Mango Lassi',
          description: 'Refreshing yogurt-based drink blended with sweet mango pulp.',
          price: 79,
          category: 'Beverages',
          image: 'https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.5,
          numReviews: 167
        },
        {
          id: '29',
          name: 'Fresh Lime Soda',
          description: 'Sparkling water with fresh lime juice, mint, and a hint of salt.',
          price: 59,
          category: 'Beverages',
          image: 'https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.3,
          numReviews: 123
        },
        {
          id: '30',
          name: 'Masala Chai',
          description: 'Traditional Indian spiced tea brewed with milk and aromatic spices.',
          price: 39,
          category: 'Beverages',
          image: 'https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?auto=compress&cs=tinysrgb&w=600',
          rating: 4.6,
          numReviews: 298
        }
      ];
      
      setCategories(categoriesData);
      setMenuItems(menuData);
      setFilteredItems(menuData);
    } catch (err) {
      setError('Failed to load menu items. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  const handleAddToCart = (item: FoodItem) => {
    addItem(item);
  };
  
  const handleIncreaseQuantity = (itemId: string) => {
    const currentQuantity = getItemQuantity(itemId);
    updateQuantity(itemId, currentQuantity + 1);
  };
  
  const handleDecreaseQuantity = (itemId: string) => {
    const currentQuantity = getItemQuantity(itemId);
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleRatingSubmit = (itemId: string, rating: number) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? {
              ...item,
              rating: ((item.rating || 0) * (item.numReviews || 0) + rating) / ((item.numReviews || 0) + 1),
              numReviews: (item.numReviews || 0) + 1
            }
          : item
      )
    );
  };
  
  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading delicious menu..." />;
  }
  
  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={FadeInDown.duration(600)}
        style={styles.headerSection}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for dishes, cuisines..."
        />
      </Animated.View>
      
      <Animated.View entering={SlideInRight.duration(500).delay(200)}>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </Animated.View>
      
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={isTablet ? 2 : 1}
        renderItem={({ item, index }) => {
          const quantity = getItemQuantity(item.id);
          const isInCart = quantity > 0;
          
          return (
            <Animated.View 
              entering={FadeInUp.delay(100 * (index % 6)).springify()}
              layout={Layout.springify()}
              style={[
                styles.cardContainer,
                isTablet && styles.tabletCard
              ]}
            >
              <FoodCard
                item={item}
                onAddToCart={() => handleAddToCart(item)}
                isInCart={isInCart}
                quantity={quantity}
                onIncrement={() => handleIncreaseQuantity(item.id)}
                onDecrement={() => handleDecreaseQuantity(item.id)}
                onRatingSubmit={handleRatingSubmit}
              />
            </Animated.View>
          );
        }}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF8C00']}
            tintColor="#FF8C00"
          />
        }
        ListEmptyComponent={
          <Animated.View 
            entering={ZoomIn}
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory 
                ? "No items found. Try adjusting your search or category filter."
                : "No items found. Try refreshing the menu."
              }
            </Text>
          </Animated.View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
  },
  tabletCard: {
    maxWidth: '50%',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});