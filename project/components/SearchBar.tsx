import React from 'react';
import { StyleSheet, TextInput, View, Platform } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolateColor
} from 'react-native-reanimated';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search..." 
}: SearchBarProps) {
  const focusProgress = useSharedValue(0);
  
  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      ['#E5E5E5', '#FF8C00']
    );
    
    return {
      borderColor,
      transform: [{ scale: withSpring(1 + focusProgress.value * 0.02) }],
    };
  });
  
  const animatedIconStyle = useAnimatedStyle(() => {
    const iconColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      ['#999', '#FF8C00']
    );
    
    return {
      tintColor: iconColor,
    };
  });
  
  const handleFocus = () => {
    focusProgress.value = withSpring(1);
  };
  
  const handleBlur = () => {
    focusProgress.value = withSpring(0);
  };
  
  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={[styles.container, animatedContainerStyle]}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <Search size={20} color="#999" />
      </Animated.View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
});