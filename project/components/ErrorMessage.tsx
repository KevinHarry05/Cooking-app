import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <AlertTriangle size={40} color="#FF3B30" />
      <Text style={styles.message}>{message}</Text>
      
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: '#FFDDDD',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});