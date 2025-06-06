import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSequence, 
  withTiming,
  Easing,
  FadeInDown
} from 'react-native-reanimated';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  
  const scale = useSharedValue(0);
  
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
    );
  }, []);
  
  const checkmarkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.iconContainer, checkmarkAnimatedStyle]}>
          <CheckCircle2 size={80} color="#4CAF50" />
        </Animated.View>
        
        <Animated.Text 
          style={[styles.title]}
          entering={FadeInDown.delay(200).duration(300)}
        >
          Order Confirmed!
        </Animated.Text>
        
        <Animated.Text 
          style={[styles.message]}
          entering={FadeInDown.delay(300).duration(300)}
        >
          Your order has been placed successfully. You'll receive a confirmation email shortly.
        </Animated.Text>
        
        <Animated.View 
          style={[styles.detailsContainer]}
          entering={FadeInDown.delay(400).duration(300)}
        >
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order #:</Text>
            <Text style={styles.detailValue}>ORD-2023-7890</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimated Delivery:</Text>
            <Text style={styles.detailValue}>30-45 minutes</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>Cash on Delivery</Text>
          </View>
        </Animated.View>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.trackOrderButton}
            onPress={() => router.push('/orders')}
          >
            <Text style={styles.trackOrderText}>Track Order</Text>
          </Pressable>
          
          <Pressable 
            style={styles.backButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.backButtonText}>Back to Menu</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginTop: 32,
    marginBottom: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 32,
    lineHeight: 24,
  },
  detailsContainer: {
    width: '100%',
    marginTop: 32,
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },
  trackOrderButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  trackOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});