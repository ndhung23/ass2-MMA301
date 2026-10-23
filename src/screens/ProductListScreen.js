import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchProducts, fetchCategories } from '../api/dummyJsonApi';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { CategorySelector } from '../components/CategorySelector';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { StoreLocatorModal } from '../components/StoreLocatorModal';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { theme } from '../styles/theme';
import { formatCurrency } from '../utils/formatters';

const PAGE_SIZE = 10;

export const ProductListScreen = ({ navigation }) => {
  const { addToCart, totalItems, grandTotal } = useCart();
  const { isInWishlist, toggleWishlist, totalWishlistItems } = useWishlist();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);

  // Modals
  const [showStoreLocator, setShowStoreLocator] = useState(false);

  const flatListRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Debounce search input
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(text);
    }, 450);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catList = await fetchCategories();
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch initial products when category or debouncedQuery changes
  const loadInitialProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchProducts({
        limit: PAGE_SIZE,
        skip: 0,
        category: selectedCategory,
        query: debouncedQuery,
      });

      setProducts(result.products);
      setTotalProducts(result.total);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, debouncedQuery]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInitialProducts();
  };

  // Pagination handler via FlatList onEndReached
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || isLoading || isRefreshing) return;

    try {
      setIsLoadingMore(true);
      const nextSkip = products.length;

      const result = await fetchProducts({
        limit: PAGE_SIZE,
        skip: nextSkip,
        category: selectedCategory,
        query: debouncedQuery,
      });

      setProducts((prev) => [...prev, ...result.products]);
      setHasMore(result.hasMore);
    } catch (err) {
      console.warn('Failed to load more products:', err.message);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Switch category
  const handleSelectCategory = (categorySlug) => {
    if (categorySlug === selectedCategory) return;
    setSelectedCategory(categorySlug);
    setSearchQuery('');
    setDebouncedQuery('');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Add to cart with feedback
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    Alert.alert(
      'Added to Cart',
      `"${product.title}" has been added to your shopping cart.`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  // Navigation handlers
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleOpenCart = () => {
    navigation.navigate('Cart');
  };

  const handleOpenWishlist = () => {
    navigation.navigate('Wishlist');
  };

  // Render product card item
  const renderProductItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      onAddToCart={handleAddToCart}
      isFavorite={isInWishlist(item.id)}
      onToggleFavorite={toggleWishlist}
    />
  );

  // List footer loading indicator for pagination
  const renderFooter = () => {
    if (!isLoadingMore) {
      if (!hasMore && products.length > 0) {
        return (
          <View style={styles.footerEnd}>
            <Text style={styles.footerEndText}>
              Showing all {totalProducts} products
            </Text>
          </View>
        );
      }
      return <View style={{ height: 80 }} />;
    }

    return (
      <View style={styles.footerLoader}>
        <LoadingIndicator message="Loading more items..." size="small" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Header */}
      <Header
        title="ShopEase"
        subtitle="Explore Top Deals & Gadgets"
        cartCount={totalItems}
        onPressCart={handleOpenCart}
        wishlistCount={totalWishlistItems}
        onPressWishlist={handleOpenWishlist}
        onPressStore={() => setShowStoreLocator(true)}
      />

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="Search products, brands, tech..."
        />
      </View>

      {/* Category Horizontal Filter Chips */}
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Product List Content */}
      {isLoading ? (
        <LoadingIndicator fullscreen message="Fetching amazing products..." />
      ) : error ? (
        <EmptyState
          icon="alert-circle-outline"
          title="Something Went Wrong"
          description={error}
          actionLabel="Try Again"
          onAction={loadInitialProducts}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Products Found"
          description={
            searchQuery
              ? `No matching results for "${searchQuery}". Try a different keyword.`
              : 'There are no items available in this category.'
          }
          actionLabel="Reset Search"
          onAction={handleClearSearch}
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {/* Floating Cart Indicator Bar if items exist */}
      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={handleOpenCart}
          activeOpacity={0.9}
        >
          <View style={styles.floatingCartLeft}>
            <View style={styles.floatingBadge}>
              <Text style={styles.floatingBadgeText}>{totalItems}</Text>
            </View>
            <Text style={styles.floatingCartText}>
              View Cart • {formatCurrency(grandTotal)}
            </Text>
          </View>
          <View style={styles.floatingCartRight}>
            <Text style={styles.floatingCheckoutText}>Checkout</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.colors.textInverse} />
          </View>
        </TouchableOpacity>
      )}

      {/* Store Locator Modal */}
      <StoreLocatorModal
        visible={showStoreLocator}
        onClose={() => setShowStoreLocator(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchWrapper: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: 2,
    backgroundColor: theme.colors.surface,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: 60,
  },
  footerEnd: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: 70,
  },
  footerEndText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.large,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingBadge: {
    backgroundColor: theme.colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingBadgeText: {
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  floatingCartText: {
    color: theme.colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  floatingCheckoutText: {
    color: theme.colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProductListScreen;
