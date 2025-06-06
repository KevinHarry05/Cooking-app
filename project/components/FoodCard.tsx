import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Pressable, 
  Platform,
  Dimensions
} from 'react-native';
import { ShoppingBag, Plus, Minus, Star, Heart } from 'lucide-react-native';
import { FoodItem } from '@/types';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
  FadeIn
} from 'react-native-reanimated';
import RatingModal from './RatingModal';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: () => void;
  isInCart?: boolean;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onToggleFavorite?: () => void;
  onRatingSubmit: (itemId: string, rating: number) => void;
}

export default function FoodCard({ 
  item, 
  onAddToCart, 
  isInCart = false, 
  quantity = 0,
  onIncrement,
  onDecrement,
  onToggleFavorite,
  onRatingSubmit
}: FoodCardProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const heartScale = useSharedValue(1);
  const addButtonScale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value, { damping: 15 }) },
      { rotateZ: `${rotation.value}deg` }
    ],
  }));
  
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(heartScale.value) }],
  }));
  
  const addButtonAnimatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(addButtonScale.value, [0, 1], [0.8, 1]);
    return {
      transform: [{ scale: withSpring(scaleValue) }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = 0.98;
  };
  
  const handlePressOut = () => {
    scale.value = 1;
  };

  const handleAdd = () => {
    addButtonScale.value = withSequence(
      withTiming(0, { duration: 100 }),
      withTiming(1.2, { duration: 200, easing: Easing.out(Easing.back(1.7)) }),
      withTiming(1, { duration: 100 })
    );
    
    rotation.value = withSequence(
      withTiming(-3, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(3, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(0, { duration: 100, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );
    
    runOnJS(onAddToCart)();
  };

  const handleHeartPress = () => {
    heartScale.value = withSequence(
      withSpring(1.3),
      withSpring(1)
    );
    onToggleFavorite?.();
  };

  const handleRatingSubmit = (rating: number) => {
    onRatingSubmit(item.id, rating);
  };

  const handleIncrement = () => {
    if (onIncrement) {
      onIncrement();
    }
  };

  const handleDecrement = () => {
    if (onDecrement) {
      onDecrement();
    }
  };

  const fallbackImage = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Pressable 
          style={styles.card}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{ color: 'rgba(255, 140, 0, 0.1)' }}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageError ? fallbackImage : item.image }} 
              style={styles.image}
              onError={() => setImageError(true)}
              defaultSource={{ uri: fallbackImage }}
            />
            {item.isOnSale && (
              <Animated.View 
                entering={FadeIn.delay(200)}
                style={styles.saleTag}
              >
                <Text style={styles.saleText}>20% OFF</Text>
              </Animated.View>
            )}
            <Animated.View style={[styles.favoriteButton, heartAnimatedStyle]}>
              <Pressable onPress={handleHeartPress}>
                <Heart 
                  size={20} 
                  color={item.isFavorite ? '#FF4B4B' : '#FFF'} 
                  fill={item.isFavorite ? '#FF4B4B' : 'none'}
                />
              </Pressable>
            </Animated.View>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            
            <Pressable 
              style={styles.ratingContainer}
              onPress={() => setShowRatingModal(true)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  color="#FFB800"
                  fill={star <= Math.floor(item.rating || 0) ? '#FFB800' : 'none'}
                />
              ))}
              <Text style={styles.ratingText}>
                {item.rating ? item.rating.toFixed(1) : '0.0'} ({item.numReviews || 0})
              </Text>
            </Pressable>
            
            <View style={styles.footer}>
              <View>
                {item.isOnSale ? (
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>₹{item.price}</Text>
                    <Text style={styles.salePrice}>₹{Math.round(item.price * 0.8)}</Text>
                  </View>
                ) : (
                  <Text style={styles.price}>₹{item.price}</Text>
                )}
              </View>
              
              {!isInCart ? (
                <Animated.View style={addButtonAnimatedStyle}>
                  <Pressable 
                    style={styles.addButton} 
                    onPress={handleAdd}
                    android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <ShoppingBag size={16} color="#FFF" />
                    <Text style={styles.addButtonText}>Add</Text>
                  </Pressable>
                </Animated.View>
              ) : (
                <Animated.View 
                  entering={FadeIn.springify()}
                  style={styles.quantityControls}
                >
                  <Pressable 
                    style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                    onPress={handleDecrement}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} color={quantity <= 1 ? '#CCC' : '#FF8C00'} />
                  </Pressable>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <Pressable 
                    style={styles.quantityButton}
                    onPress={handleIncrement}
                  >
                    <Plus size={16} color="#FF8C00" />
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <RatingModal
        isVisible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        itemName={item.name}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
      },
    }),
  },
  card: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: isTablet ? 220 : 200,
    resizeMode: 'cover',
    backgroundColor: '#F5F5F5',
  },
  saleTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
    borderRadius: 25,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  salePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF4B4B',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF8C00',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(255, 140, 0, 0.3)',
      },
      default: {
        shadowColor: '#FF8C00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    borderRadius: 25,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  quantityButtonDisabled: {
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    minWidth: 24,
    textAlign: 'center',
  },
});