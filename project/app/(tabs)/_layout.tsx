import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, ShoppingCart, Clock, User } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import { useCartStore } from '@/store/useCartStore';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate
} from 'react-native-reanimated';

function AnimatedTabIcon({ 
  IconComponent, 
  color, 
  size, 
  focused 
}: { 
  IconComponent: any; 
  color: string; 
  size: number; 
  focused: boolean;
}) {
  const scale = useSharedValue(focused ? 1 : 0.8);
  
  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
  }, [focused]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <IconComponent size={size} color={color} />
    </Animated.View>
  );
}

function CartIcon({ color, size, focused }: { color: string; size: number; focused: boolean }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const badgeScale = useSharedValue(totalItems > 0 ? 1 : 0);
  
  React.useEffect(() => {
    badgeScale.value = withSpring(totalItems > 0 ? 1 : 0);
  }, [totalItems]);
  
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: interpolate(badgeScale.value, [0, 1], [0, 1]),
  }));
  
  return (
    <View>
      <AnimatedTabIcon 
        IconComponent={ShoppingCart} 
        color={color} 
        size={size} 
        focused={focused}
      />
      {totalItems > 0 && (
        <Animated.View style={[styles.badge, badgeAnimatedStyle]}>
          <View style={styles.badgeContent} />
        </Animated.View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { 
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Foodie Express',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon 
              IconComponent={Home} 
              color={color} 
              size={size} 
              focused={focused}
            />
          ),
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Your Cart',
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <CartIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Your Orders',
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon 
              IconComponent={Clock} 
              color={color} 
              size={size} 
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon 
              IconComponent={User} 
              color={color} 
              size={size} 
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FF8C00',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(255, 140, 0, 0.2)',
      },
      default: {
        shadowColor: '#FF8C00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'Arial'
    }),
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeContent: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
});