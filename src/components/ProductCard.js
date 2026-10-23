import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { formatCurrency, calculateOriginalPrice } from '../utils/formatters';

const { width } = Dimensions.get('window');
// Responsive 2-column card calculation
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - theme.spacing.lg * 2 - CARD_MARGIN * 2) / 2;

export const ProductCard = React.memo(({
  product,
  onPress,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
}) => {
  if (!product) return null;

  const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.8}
    >
      {/* Product Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail || product.images?.[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        )}

        {/* Wishlist Heart Button */}
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(product)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? theme.colors.danger : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        {/* Category & Rating */}
        <View style={styles.metaRow}>
          <Text style={styles.category} numberOfLines={1}>
            {product.category || 'Product'}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={theme.colors.rating} />
            <Text style={styles.ratingText}>
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Price & Add to Cart Action */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                {formatCurrency(originalPrice)}
              </Text>
            )}
          </View>

          {onAddToCart && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => onAddToCart(product)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={theme.colors.textInverse} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    margin: CARD_MARGIN,
    overflow: 'hidden',
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    backgroundColor: theme.colors.surfaceVariant,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
  },
  discountText: {
    color: theme.colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  content: {
    padding: theme.spacing.sm,
    justifyContent: 'space-between',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    maxWidth: '65%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 18,
    minHeight: 36,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;
