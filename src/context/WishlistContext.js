import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storeData, getData, StorageKeys } from '../utils/storage';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from storage on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const saved = await getData(StorageKeys.WISHLIST, []);
        if (Array.isArray(saved)) {
          setWishlistItems(saved);
        }
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWishlist();
  }, []);

  // Save wishlist on change
  useEffect(() => {
    if (isLoaded) {
      storeData(StorageKeys.WISHLIST, wishlistItems);
    }
  }, [wishlistItems, isLoaded]);

  /**
   * Check if a product is in wishlist
   */
  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  /**
   * Toggle product wishlist status
   */
  const toggleWishlist = useCallback((product) => {
    if (!product || !product.id) return;

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        const compactProduct = {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail || product.images?.[0] || '',
          category: product.category,
          rating: product.rating,
        };
        return [...prev, compactProduct];
      }
    });
  }, []);

  /**
   * Remove item from wishlist
   */
  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const totalWishlistItems = wishlistItems.length;

  const value = {
    wishlistItems,
    isLoaded,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    totalWishlistItems,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
