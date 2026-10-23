import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { formatCurrency } from '../utils/formatters';

export const PriceSummary = React.memo(({
  totalItems = 0,
  subtotal = 0,
  shippingFee = 0,
  estimatedTax = 0,
  grandTotal = 0,
  onCheckout,
  isCheckoutLoading = false,
}) => {
  const isFreeShipping = shippingFee === 0 && subtotal > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order Summary</Text>

      {/* Subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>
          Items Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      {/* Shipping Fee */}
      <View style={styles.row}>
        <View style={styles.shippingLabelRow}>
          <Text style={styles.label}>Shipping Fee</Text>
          {isFreeShipping && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          )}
        </View>
        <Text style={[styles.value, isFreeShipping && styles.freeText]}>
          {isFreeShipping ? '$0.00' : formatCurrency(shippingFee)}
        </Text>
      </View>

      {/* Free shipping threshold progress/tip */}
      {subtotal > 0 && subtotal < 50 && (
        <View style={styles.shippingNotice}>
          <Ionicons name="information-circle-outline" size={14} color={theme.colors.accent} />
          <Text style={styles.shippingNoticeText}>
            Add {formatCurrency(50 - subtotal)} more to qualify for Free Shipping!
          </Text>
        </View>
      )}

      {/* Estimated Tax */}
      <View style={styles.row}>
        <Text style={styles.label}>Estimated Tax (5%)</Text>
        <Text style={styles.value}>{formatCurrency(estimatedTax)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Grand Total */}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
      </View>

      {/* Checkout Button */}
      {onCheckout && (
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            totalItems === 0 && styles.checkoutButtonDisabled,
          ]}
          onPress={onCheckout}
          disabled={totalItems === 0 || isCheckoutLoading}
          activeOpacity={0.8}
        >
          <Ionicons name="lock-closed" size={18} color={theme.colors.textInverse} />
          <Text style={styles.checkoutButtonText}>
            {isCheckoutLoading
              ? 'Processing...'
              : `Proceed to Checkout (${formatCurrency(grandTotal)})`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  shippingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freeBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.success,
  },
  freeText: {
    color: theme.colors.success,
    fontWeight: '700',
  },
  shippingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accentLight,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 10,
    gap: 6,
  },
  shippingNoticeText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.sm,
  },
  totalRow: {
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    gap: 8,
    ...theme.shadows.small,
  },
  checkoutButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
    elevation: 0,
  },
  checkoutButtonText: {
    color: theme.colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PriceSummary;
