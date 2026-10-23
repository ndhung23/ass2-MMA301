import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook to access and manage shopping cart state
 * @returns {Object} Cart state and mutation methods
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default useCart;
