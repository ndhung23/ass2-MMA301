import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { formatCurrency } from '../utils/formatters';

export const CartItem = React.memo(({
  item,
  onUpdateQuantity,
  onRemove,
  onPress,
}) => {
  if (!item) return null;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <TouchableOpacity
        onPress={() => onPress && onPress(item)}
        activeOpacity={0.8}
        style={styles.imageWrapper}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Info & Quantity controls */}
      <View style={styles.details}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => onPress && onPress(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {item.category ? (
              <Text style={styles.category}>{item.category}</Text>
            ) : null}
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onRemove && onRemove(item.id)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>

        {/* Price & Stepper Row */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.unitPrice}>{formatCurrency(item.price)}</Text>
            {item.quantity > 1 && (
              <Text style={styles.subtotalText}>
                Total: {formatCurrency(item.price * item.quantity)}
              </Text>
            )}
          </View>

          {/* Quantity Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity - 1)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                size={16}
                color={item.quantity === 1 ? theme.colors.danger : theme.colors.text}
              />
            </TouchableOpacity>

            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.stepperButton,
                item.quantity >= (item.stock || 999) && styles.stepperButtonDisabled,
              ]}
              onPress={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= (item.stock || 999)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={16}
                color={
                  item.quantity >= (item.stock || 999)
                    ? theme.colors.textMuted
                    : theme.colors.text
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceVariant,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: 'space-between',
    minHeight: 80,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  category: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  unitPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  subtotalText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  stepperButtonDisabled: {
    backgroundColor: theme.colors.border,
    elevation: 0,
  },
  quantityDisplay: {
    paddingHorizontal: 12,
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
});

export default CartItem;
