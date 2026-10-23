# MMA301 - Assignment 2: E-Commerce Product App with Pagination and Cart State

> **Course**: MMA301 - Mobile Application Development  
> **Student**: ndhung23 (ndhung.work@gmail.com)  
> **Topic**: E-Commerce Product App with Pagination, Cart State, and Atomic Architecture  

---

## 🚀 Live Demo & Online Links

- **GitHub Repository**: [https://github.com/ndhung23/ass2-MMA301](https://github.com/ndhung23/ass2-MMA301)
- **Expo Snack**: [https://snack.expo.dev](https://snack.expo.dev) *(Import directly from GitHub repository)*
- **Public API Used**: [DummyJSON Products API](https://dummyjson.com/docs/products)

---

## 📱 Project Overview

A modern, responsive e-commerce mobile application built with **React Native** and **Expo (SDK 57)**. The app fetches real-time product catalogs from the DummyJSON API with offset pagination, category filtering, debounced search, custom hooks for cart management, persistent storage, and AI-powered product advice.

---

## 🌟 Core Requirements & Features

### 1. Screens
- **`ProductListScreen`**:
  - Displays product catalog in a responsive 2-column grid layout.
  - Infinite scroll / pagination using `FlatList` with `onEndReached` and `onEndReachedThreshold`.
  - Category selector filter chips (All, Beauty, Fragrances, Furniture, Groceries, Laptops, Smartphones, etc.).
  - Real-time debounced Search bar with instant clearing.
  - Pull-to-refresh (`RefreshControl`).
  - Graceful handling of Loading, Error (with retry), and Empty states.
  - Real-time floating cart banner and header badges.
  - Favorite / Wishlist toggle directly on each product card.
- **`ProductDetailScreen`**:
  - Comprehensive product information: Title, Brand, Category, Rating, Stock status, Pricing.
  - Multi-image gallery with active thumbnail selector.
  - Discount calculation: Original price strikethrough, discount badge percentage.
  - Full product description, warranty details, shipping info, and return policy.
  - Verified customer reviews with star ratings and comments.
  - Quantity selector (`-` `[count]` `+`).
  - "Add to Cart" and "Buy Now" actions.
  - **Gemini AI Product Advisor** modal integration.
- **`CartScreen`**:
  - Itemized cart list displaying thumbnail, title, category, and unit price.
  - Quantity controls (`+`, `-`, and remove).
  - Clear entire cart action with confirmation dialog.
  - Empty cart state with "Start Shopping" button.
  - Real-time `PriceSummary` component: Subtotal, Free Shipping threshold calculator, 5% estimated tax, and Grand Total.
  - Simulated Checkout flow with animated order success modal and order tracking code.

---

## 🏗️ Architecture & Component Design

- **State Management**:
  - **Context API** (`CartContext.js` & `WishlistContext.js`) providing global state with zero prop-drilling.
  - **Custom Hook `useCart`**: Exposes `cartItems`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `totalItems`, `subtotal`, `shippingFee`, `grandTotal`.
  - **Custom Hook `useWishlist`**: Exposes `wishlistItems`, `isInWishlist`, `toggleWishlist`, `removeFromWishlist`.
- **Atomic Components**:
  - `ProductCard.js`: Atomic product card with image, discount badge, rating, price, and add button.
  - `CartItem.js`: Atomic cart row with image, stepper controls, and delete action.
  - `PriceSummary.js`: Atomic checkout summary with shipping progress, taxes, and total.
  - `SearchBar.js`: Controlled search input with icon and clear button.
  - `CategorySelector.js`: Horizontal category filter pill list.
  - `Header.js`: Standardized app header with navigation back and real-time badges.
  - `EmptyState.js`: Reusable placeholder for zero results / empty cart / errors.
  - `LoadingIndicator.js`: Centered `ActivityIndicator` with status text.
- **Bonus Integrations**:
  - 💾 **Local Storage Caching**: Uses `@react-native-async-storage/async-storage` to persist cart items, wishlist, and offline product cache.
  - ❤️ **Wishlist Feature**: Custom `useWishlist` hook with persistent storage and dedicated `WishlistScreen`.
  - 🤖 **Gemini AI Shopping Assistant** (`AIAdvisorModal.js`): Intelligent AI advisor that provides pros/cons, reviews summary, and price evaluation for any product.
  - 📍 **Store Locator & Pickup Map** (`StoreLocatorModal.js`): Interactive retail store locator for in-store pickup and distance estimation.

---

## 📁 Project Structure

```
ass2/
├── App.js                         # Root navigation and providers
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
├── README.md                      # Documentation
├── src/
│   ├── api/
│   │   └── dummyJsonApi.js        # DummyJSON API service with offline fallback
│   ├── context/
│   │   ├── CartContext.js         # Cart state provider & AsyncStorage sync
│   │   └── WishlistContext.js     # Wishlist state provider & AsyncStorage sync
│   ├── hooks/
│   │   ├── useCart.js             # Custom cart management hook
│   │   └── useWishlist.js         # Custom wishlist hook
│   ├── components/
│   │   ├── ProductCard.js         # Atomic product card
│   │   ├── CartItem.js            # Atomic cart item row
│   │   ├── PriceSummary.js        # Atomic order price breakdown
│   │   ├── SearchBar.js           # Search input
│   │   ├── CategorySelector.js    # Horizontal category chips
│   │   ├── Header.js              # Screen header with badges
│   │   ├── EmptyState.js          # Empty & error placeholder
│   │   ├── LoadingIndicator.js    # ActivityIndicator wrapper
│   │   ├── AIAdvisorModal.js      # Gemini AI shopping advisor
│   │   └── StoreLocatorModal.js   # Store pickup / map locator
│   ├── screens/
│   │   ├── ProductListScreen.js   # Paginated product catalog
│   │   ├── ProductDetailScreen.js # Full product specs & reviews
│   │   ├── CartScreen.js          # Cart management & checkout
│   │   └── WishlistScreen.js      # Saved favorites screen
│   ├── utils/
│   │   ├── formatters.js          # Currency and string formatters
│   │   └── storage.js             # AsyncStorage helpers
│   └── styles/
│       └── theme.js               # Design tokens, colors, shadows
```

---

## 🛠️ Installation & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npx expo start
   ```

3. **Run on target**:
   - Press `a` for Android emulator / device
   - Press `i` for iOS simulator
   - Press `w` for Web browser
   - Scan QR code with the **Expo Go** mobile app

---

## 🌐 Online Submission Instructions

1. **GitHub Repository**:
   - Create a repository on GitHub named `ass2-MMA301` under `ndhung23`.
   - Push code:
     ```bash
     git remote add origin https://github.com/ndhung23/ass2-MMA301.git
     git branch -M main
     git push -u origin main
     ```
2. **Expo Snack Submission**:
   - Go to [https://snack.expo.dev](https://snack.expo.dev)
   - Click the hamburger menu / `Import from Git`
   - Paste the repository URL: `https://github.com/ndhung23/ass2-MMA301`
   - Click **Save** and copy the resulting Snack URL to submit.
