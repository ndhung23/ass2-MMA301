import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CART: '@ecommerce_cart_v1',
  WISHLIST: '@ecommerce_wishlist_v1',
  PRODUCTS_CACHE: '@ecommerce_products_cache_v1',
};

/**
 * Save data to AsyncStorage
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

/**
 * Retrieve data from AsyncStorage
 */
export const getData = async (key, defaultValue = null) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error reading data for key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

export const StorageKeys = KEYS;
