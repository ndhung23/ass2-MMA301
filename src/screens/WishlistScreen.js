import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { theme } from '../styles/theme';

export const WishlistScreen = ({ navigation }) => {
  const { wishlistItems, toggleWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, totalItems } = useCart();

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    Alert.alert(
      'Added to Cart',
      `"${product.title}" has been added to your shopping cart.`,
      [
        { text: 'Keep Browsing', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      <Header
        title={`My Wishlist (${wishlistItems.length})`}
        showBack
        onBack={() => navigation.goBack()}
        showWishlist={false}
        cartCount={totalItems}
        onPressCart={() => navigation.navigate('Cart')}
      />

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Wishlist is Empty"
          description="Save items you love by tapping the heart icon on any product."
          actionLabel="Discover Products"
          onAction={() => navigation.navigate('ProductList')}
        />
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onAddToCart={handleAddToCart}
              isFavorite={true}
              onToggleFavorite={() => removeFromWishlist(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default WishlistScreen;
