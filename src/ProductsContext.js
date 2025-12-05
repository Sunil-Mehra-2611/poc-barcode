import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "./mockData";

const ProductsContext = createContext();
const STORAGE_KEY = "store_products";

// Load products from localStorage on initial load
function loadProductsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return null;
}

// Save products to localStorage
function saveProductsToStorage(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function ProductsProvider({ children }) {
  // Load from localStorage first, if not available use initialProducts
  const [products, setProducts] = useState(() => {
    const stored = loadProductsFromStorage();
    return stored || initialProducts;
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => {
      const updated = [...prevProducts, newProduct];
      return updated;
    });
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}

