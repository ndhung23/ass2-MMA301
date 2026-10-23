import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storeData, getData, StorageKeys } from '../utils/storage';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from persistent storage on app startup
  useEffect(() => {
    const loadSavedCart = async () => {
      try {
        const saved = await getData(StorageKeys.CART, []);
        if (Array.isArray(saved)) {
          setCartItems(saved);
        }
      } catch (err) {
        console.error('Failed to load cart from storage:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSavedCart();
  }, []);

  // Sync cart changes to persistent storage
  useEffect(() => {
    if (isLoaded) {
      storeData(StorageKeys.CART, cartItems);
    }
  }, [cartItems, isLoaded]);

  /**
   * Add a product to the cart or increase its quantity if already present
   */
  const addToCart = useCallback((product, quantityToAdd = 1) => {
    if (!product || !product.id) return;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Product exists in cart: update quantity
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            const maxStock = product.stock || 999;
            const newQty = Math.min(item.quantity + quantityToAdd, maxStock);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      }

      // Product is new to cart
      const newItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || product.images?.[0] || '',
        category: product.category || '',
        brand: product.brand || '',
        stock: product.stock || 99,
        discountPercentage: product.discountPercentage || 0,
        quantity: Math.max(1, quantityToAdd),
      };

      return [...prevItems, newItem];
    });
  }, []);

  /**
   * Remove a product completely from the cart
   */
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  /**
   * Update the quantity of a specific cart item
   * If quantity <= 0, item is removed
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock || 999;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /**
   * Check if a product is already in the cart
   */
  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  );

  /**
   * Get the current quantity of a product in the cart
   */
  const getItemQuantity = useCallback(
    (productId) => {
      const found = cartItems.find((item) => item.id === productId);
      return found ? found.quantity : 0;
    },
    [cartItems]
  );

  // Real-time calculations
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Free shipping above $50, else $4.99 (or 0 if cart empty)
  const shippingFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal > 50 ? 0 : 4.99;
  }, [cartItems.length, subtotal]);

  // Standard 5% tax estimate
  const estimatedTax = useMemo(() => {
    return subtotal * 0.05;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal + shippingFee + estimatedTax;
  }, [cartItems.length, subtotal, shippingFee, estimatedTax]);

  const value = {
    cartItems,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    totalItems,
    subtotal,
    shippingFee,
    estimatedTax,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
