import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Platform } from 'react-native';
import { Star, X } from 'lucide-react-native';
import Animated, { 
  ZoomIn, 
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  itemName: string;
}

export default function RatingModal({ isVisible, onClose, onSubmit, itemName }: RatingModalProps) {
  const [rating, setRating] = React.useState(0);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
  };

  const handleSubmit = () => {
    onSubmit(rating);
    setRating(0);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={ZoomIn}
          exiting={ZoomOut}
          style={[styles.modalContent, animatedStyle]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Rate your experience</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#666" />
            </Pressable>
          </View>

          <Text style={styles.itemName}>{itemName}</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => handleStarPress(star)}
                style={styles.starButton}
              >
                <Star
                  size={32}
                  color="#FFB800"
                  fill={star <= rating ? '#FFB800' : 'none'}
                />
              </Pressable>
            ))}
          </View>

          <Pressable 
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </Pressable>
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
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  itemName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  starButton: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#FFD0A1',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});