import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export const LoadingIndicator = ({
  message = 'Loading products...',
  size = 'large',
  color = theme.colors.primary,
  fullscreen = false,
}) => {
  return (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    flex: 1,
  },
  message: {
    marginTop: theme.spacing.md,
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});

export default LoadingIndicator;
