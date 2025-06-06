import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolateColor,
  Layout
} from 'react-native-reanimated';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CategoryButton({ 
  category, 
  isSelected, 
  onPress, 
  index 
}: { 
  category: string; 
  isSelected: boolean; 
  onPress: () => void;
  index: number;
}) {
  const scale = useSharedValue(1);
  const progress = useSharedValue(isSelected ? 1 : 0);
  
  React.useEffect(() => {
    progress.value = withSpring(isSelected ? 1 : 0);
  }, [isSelected]);
  
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#F5F5F5', '#FF8C00']
    );
    
    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });
  
  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ['#666', '#FFF']
    );
    
    return { color };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
    onPress();
  };
  
  return (
    <AnimatedPressable
      entering={FadeIn.delay(100 * index).springify()}
      layout={Layout.springify()}
      style={[styles.categoryButton, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.Text style={[styles.categoryText, animatedTextStyle]}>
        {category}
      </Animated.Text>
    </AnimatedPressable>
  );
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryButton
          category="All"
          isSelected={selectedCategory === null}
          onPress={() => onSelectCategory(null)}
          index={0}
        />
        
        {categories.map((category, index) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onPress={() => onSelectCategory(category)}
            index={index + 1}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});