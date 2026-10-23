import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';

export const CategorySelector = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const items = [{ slug: 'all', name: 'All Products' }, ...categories];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <TouchableOpacity
              key={cat.slug}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectCategory && onSelectCategory(cat.slug)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: theme.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  chipTextSelected: {
    color: theme.colors.textInverse,
    fontWeight: '700',
  },
});

export default CategorySelector;
