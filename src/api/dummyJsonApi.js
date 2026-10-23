import { storeData, getData, StorageKeys } from '../utils/storage';

const BASE_URL = 'https://dummyjson.com';

/**
 * Fetch products with pagination, optional category, and search query
 * @param {Object} options
 * @param {number} options.limit - Number of products per page
 * @param {number} options.skip - Offset for pagination
 * @param {string} options.category - Optional category filter
 * @param {string} options.query - Optional search keyword
 */
export const fetchProducts = async ({ limit = 10, skip = 0, category = '', query = '' } = {}) => {
  try {
    let url = '';
    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 0) {
      // Search endpoint supports limit & skip
      url = `${BASE_URL}/products/search?q=${encodeURIComponent(trimmedQuery)}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== 'all') {
      // Category endpoint supports limit & skip
      url = `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`;
    } else {
      // Standard paginated products endpoint
      url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache first page for offline availability
    if (skip === 0 && !trimmedQuery && (!category || category === 'all')) {
      storeData(StorageKeys.PRODUCTS_CACHE, data);
    }

    return {
      products: data.products || [],
      total: data.total || 0,
      skip: data.skip || 0,
      limit: data.limit || limit,
      hasMore: (data.skip + (data.products?.length || 0)) < (data.total || 0),
    };
  } catch (error) {
    console.warn('fetchProducts network failed, attempting offline cache:', error.message);

    // If initial page, try offline cache
    if (skip === 0) {
      const cached = await getData(StorageKeys.PRODUCTS_CACHE, null);
      if (cached && cached.products && cached.products.length > 0) {
        return {
          products: cached.products,
          total: cached.total,
          skip: 0,
          limit: cached.limit,
          hasMore: false,
          isOffline: true,
        };
      }
    }

    throw error;
  }
};

/**
 * Fetch all available categories
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('fetchCategories error:', error);
    // Fallback list of top categories
    return [
      { slug: 'beauty', name: 'Beauty' },
      { slug: 'fragrances', name: 'Fragrances' },
      { slug: 'furniture', name: 'Furniture' },
      { slug: 'groceries', name: 'Groceries' },
      { slug: 'home-decoration', name: 'Home Decoration' },
      { slug: 'laptops', name: 'Laptops' },
      { slug: 'smartphones', name: 'Smartphones' },
    ];
  }
};

/**
 * Fetch single product details by id
 * @param {number|string} id
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error(`Product not found (ID: ${id})`);
    return await response.json();
  } catch (error) {
    console.error(`fetchProductById error for ${id}:`, error);
    throw error;
  }
};
