import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const Header = ({
  title = 'ShopEase',
  subtitle,
  showBack = false,
  onBack,
  showCart = true,
  cartCount = 0,
  onPressCart,
  showWishlist = true,
  wishlistCount = 0,
  onPressWishlist,
  onPressStore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : null}

        <View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Action Icons */}
      <View style={styles.rightRow}>
        {onPressStore && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPressStore}
            activeOpacity={0.7}
          >
            <Ionicons name="location-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        )}

        {showWishlist && onPressWishlist && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPressWishlist}
            activeOpacity={0.7}
          >
            <Ionicons name="heart-outline" size={22} color={theme.colors.text} />
            {wishlistCount > 0 && (
              <View style={[styles.badge, styles.wishlistBadge]}>
                <Text style={styles.badgeText}>
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showCart && onPressCart && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPressCart}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={22} color={theme.colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.badge,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },
  wishlistBadge: {
    backgroundColor: theme.colors.danger,
  },
  badgeText: {
    color: theme.colors.textInverse,
    fontSize: 9,
    fontWeight: '800',
  },
});

export default Header;
