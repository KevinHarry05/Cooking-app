import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform, Modal, Image } from 'react-native';
import Animated, { 
  FadeInRight, 
  FadeOutLeft,
  ZoomIn,
  ZoomOut,
  withSequence,
  withTiming,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { Clock, X } from 'lucide-react-native';

interface Deal {
  id: string;
  title: string;
  discount: number;
  timeLeft: string;
  image: string;
  description: string;
}

const deals: Deal[] = [
  {
    id: '1',
    title: 'Lunch Special',
    discount: 30,
    timeLeft: '2h 30m',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Get 30% off on all lunch combos between 1 PM to 4 PM'
  },
  {
    id: '2',
    title: 'Happy Hours',
    discount: 20,
    timeLeft: '5h 45m',
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Special dinner deals with 20% off on family packs'
  },
  {
    id: '3',
    title: 'Weekend Special',
    discount: 25,
    timeLeft: '1d 12h',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Enjoy weekend special offers on our signature dishes'
  },
];

interface DailyDealsProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function DailyDeals({ isVisible, onClose }: DailyDealsProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleClose = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(0, { duration: 200 })
    );
    setTimeout(onClose, 400);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={ZoomIn.springify()}
          exiting={ZoomOut}
          style={[styles.modalContent, animatedStyle]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Today's Special Offers</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {deals.map((deal, index) => (
              <Animated.View
                key={deal.id}
                entering={FadeInRight.delay(index * 100)}
                exiting={FadeOutLeft}
                style={styles.dealCard}
              >
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={styles.dealContent}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{deal.discount}% OFF</Text>
                  </View>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.dealDescription}>{deal.description}</Text>
                  <View style={styles.timeContainer}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.timeText}>Ends in {deal.timeLeft}</Text>
                  </View>
                  <Pressable style={styles.claimButton}>
                    <Text style={styles.claimButtonText}>Claim Offer</Text>
                  </Pressable>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 600,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    paddingVertical: 12,
  },
  dealCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 8,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  dealImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  dealContent: {
    padding: 16,
  },
  discountBadge: {
    position: 'absolute',
    top: -30,
    right: 16,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  dealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  claimButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});