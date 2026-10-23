import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { CartItem } from '../components/CartItem';
import { PriceSummary } from '../components/PriceSummary';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { theme } from '../styles/theme';
import { formatCurrency } from '../utils/formatters';

export const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shippingFee,
    estimatedTax,
    grandTotal,
  } = useCart();
  const { totalWishlistItems } = useWishlist();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Remove confirmation
  const handleRemoveItem = (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  // Clear cart confirmation
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Clear Shopping Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  // Checkout flow
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setLastOrderDetails({
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        itemsCount: totalItems,
        totalPaid: grandTotal,
        date: new Date().toLocaleDateString(),
      });
      clearCart();
      setOrderSuccessModal(true);
    }, 1200);
  };

  // Navigate to item details
  const handleItemPress = (item) => {
    navigation.navigate('ProductDetail', { productId: item.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Header */}
      <Header
        title={`Cart (${totalItems})`}
        showBack
        onBack={() => navigation.goBack()}
        showCart={false}
        wishlistCount={totalWishlistItems}
        onPressWishlist={() => navigation.navigate('Wishlist')}
      />

      {cartItems.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="Your Cart is Empty"
          description="Looks like you haven't added any products yet. Discover top tech and daily deals now!"
          actionLabel="Start Shopping"
          onAction={() => navigation.navigate('ProductList')}
        />
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.reviewItemsText}>
                Review your items ({totalItems})
              </Text>
              <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7}>
                <Text style={styles.clearCartText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={handleRemoveItem}
              onPress={handleItemPress}
            />
          )}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <PriceSummary
                totalItems={totalItems}
                subtotal={subtotal}
                shippingFee={shippingFee}
                estimatedTax={estimatedTax}
                grandTotal={grandTotal}
                onCheckout={handleCheckout}
                isCheckoutLoading={isCheckingOut}
              />
            </View>
          }
        />
      )}

      {/* Order Success Modal */}
      <Modal visible={orderSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={42} color={theme.colors.success} />
            </View>

            <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              Thank you for shopping with ShopEase.
            </Text>

            {lastOrderDetails && (
              <View style={styles.receiptBox}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Order Code:</Text>
                  <Text style={styles.receiptValue}>{lastOrderDetails.orderId}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Items Purchased:</Text>
                  <Text style={styles.receiptValue}>
                    {lastOrderDetails.itemsCount} items
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Total Paid:</Text>
                  <Text style={[styles.receiptValue, styles.receiptTotal]}>
                    {formatCurrency(lastOrderDetails.totalPaid)}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Estimated Delivery:</Text>
                  <Text style={styles.receiptValue}>2 - 4 business days</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.continueShoppingBtn}
              onPress={() => {
                setOrderSuccessModal(false);
                navigation.navigate('ProductList');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  reviewItemsText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  clearCartText: {
    fontSize: 13,
    color: theme.colors.danger,
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    ...theme.shadows.large,
  },
  successIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  receiptBox: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '100%',
    marginBottom: theme.spacing.xl,
    gap: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  receiptTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  continueShoppingBtn: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  continueShoppingText: {
    color: theme.colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartScreen;
