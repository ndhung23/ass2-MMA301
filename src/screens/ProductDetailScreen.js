import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductById } from '../api/dummyJsonApi';
import { Header } from '../components/Header';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';
import { AIAdvisorModal } from '../components/AIAdvisorModal';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { theme } from '../styles/theme';
import { formatCurrency, calculateOriginalPrice } from '../utils/formatters';

export const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params || {};
  const { addToCart, totalItems } = useCart();
  const { isInWishlist, toggleWishlist, totalWishlistItems } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProductById(productId);
        setProduct(data);
        setSelectedImage(data.thumbnail || data.images?.[0] || '');
      } catch (err) {
        setError(err.message || 'Unable to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadDetail();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    Alert.alert(
      'Added to Cart',
      `Added ${quantity} x "${product.title}" to your cart.`,
      [
        { text: 'Keep Browsing', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigation.navigate('Cart');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Product Details"
          showBack
          onBack={() => navigation.goBack()}
          cartCount={totalItems}
          onPressCart={() => navigation.navigate('Cart')}
        />
        <LoadingIndicator fullscreen message="Loading product information..." />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Product Details"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="alert-circle-outline"
          title="Product Not Found"
          description={error || 'Could not load details for this product.'}
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const originalPrice = calculateOriginalPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Top Header */}
      <Header
        title={product.brand || 'Product Details'}
        showBack
        onBack={() => navigation.goBack()}
        cartCount={totalItems}
        onPressCart={() => navigation.navigate('Cart')}
        wishlistCount={totalWishlistItems}
        onPressWishlist={() => navigation.navigate('Wishlist')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Product Image */}
        <View style={styles.imageGalleryContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {/* Discount Pill */}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                {Math.round(product.discountPercentage)}% OFF
              </Text>
            </View>
          )}

          {/* Floating Actions on Image: Wishlist & AI Advisor */}
          <View style={styles.imageActionButtons}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => toggleWishlist(product)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? theme.colors.danger : theme.colors.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleButton, styles.aiAdvisorCircle]}
              onPress={() => setShowAiAdvisor(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={20} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailRow}
          >
            {images.map((imgUri, index) => {
              const isSelected = selectedImage === imgUri;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.thumbnailWrap, isSelected && styles.thumbnailWrapSelected]}
                  onPress={() => setSelectedImage(imgUri)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: imgUri }} style={styles.thumbnailImg} resizeMode="cover" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Product Details Card */}
        <View style={styles.infoCard}>
          {/* Category & Rating */}
          <View style={styles.metaRow}>
            <Text style={styles.categoryTag}>{product.category}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={theme.colors.rating} />
              <Text style={styles.ratingScore}>{product.rating?.toFixed(1) || '4.5'}</Text>
              <Text style={styles.reviewsCount}>
                ({product.reviews?.length || 0} reviews)
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.productTitle}>{product.title}</Text>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatCurrency(product.price)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>{formatCurrency(originalPrice)}</Text>
            )}
            <View
              style={[
                styles.stockBadge,
                product.stock < 10 ? styles.stockLow : styles.stockNormal,
              ]}
            >
              <Text
                style={[
                  styles.stockText,
                  product.stock < 10 ? styles.stockLowText : styles.stockNormalText,
                ]}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Text>
            </View>
          </View>

          {/* AI Banner for quick advice */}
          <TouchableOpacity
            style={styles.aiBanner}
            onPress={() => setShowAiAdvisor(true)}
            activeOpacity={0.8}
          >
            <View style={styles.aiBannerLeft}>
              <Ionicons name="sparkles" size={18} color="#7C3AED" />
              <Text style={styles.aiBannerText}>
                Ask Gemini AI: Price check, pros/cons, reviews summary
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#7C3AED" />
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Specifications / Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.specGrid}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Brand</Text>
                <Text style={styles.specValue}>{product.brand || 'Generic'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Warranty</Text>
                <Text style={styles.specValue}>{product.warrantyInformation || '1 Year'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Shipping</Text>
                <Text style={styles.specValue}>{product.shippingInformation || 'Standard'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Return Policy</Text>
                <Text style={styles.specValue}>{product.returnPolicy || '30 days'}</Text>
              </View>
            </View>
          </View>

          {/* Customer Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {product.reviews.map((rev, idx) => (
                <View key={idx} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                    <View style={styles.starRow}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < rev.rating ? 'star' : 'star-outline'}
                          size={12}
                          color={theme.colors.rating}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(rev.date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Stepper */}
        <View style={styles.stepperWrap}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.stepValue}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons name="cart-outline" size={18} color={theme.colors.primary} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        {/* Buy Now Button */}
        <TouchableOpacity
          style={styles.buyNowBtn}
          onPress={handleBuyNow}
          activeOpacity={0.8}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Gemini AI Advisor Modal */}
      <AIAdvisorModal
        visible={showAiAdvisor}
        onClose={() => setShowAiAdvisor(false)}
        product={product}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  imageGalleryContainer: {
    height: 320,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '90%',
    height: '90%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  discountBadgeText: {
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  imageActionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  aiAdvisorCircle: {
    backgroundColor: '#F5F3FF',
  },
  thumbnailRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  thumbnailWrap: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceVariant,
  },
  thumbnailWrapSelected: {
    borderColor: theme.colors.primary,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  reviewsCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 26,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.xs,
  },
  stockNormal: {
    backgroundColor: theme.colors.successLight,
  },
  stockNormalText: {
    color: theme.colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  stockLow: {
    backgroundColor: theme.colors.dangerLight,
  },
  stockLowText: {
    color: theme.colors.danger,
    fontSize: 11,
    fontWeight: '600',
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    padding: 12,
    borderRadius: theme.borderRadius.md,
    marginBottom: 20,
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  aiBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specItem: {
    width: '48%',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
  },
  specLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  reviewItem: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  reviewDate: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...theme.shadows.large,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepValue: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  buyNowBtn: {
    flex: 1,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  buyNowText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textInverse,
  },
});

export default ProductDetailScreen;
