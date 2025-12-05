import { useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "./ProductsContext";
import { products as initialProducts } from "./mockData";
import { useState, useEffect } from "react";
import "./styles.css";

// Function to get products from localStorage (for direct URL access)
function getProductsFromStorage() {
  try {
    const stored = localStorage.getItem("store_products");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
  return initialProducts;
}

// Decode product data from URL
function getProductFromURL(searchParams) {
  try {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      // Decode URI component first, then base64
      const decoded = atob(decodeURIComponent(encodedData));
      return JSON.parse(decoded);
    }
  } catch (error) {
    console.error("Error decoding product data from URL:", error);
  }
  return null;
}

export default function ProductDetails() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  
  // Get products from context
  const { products: contextProducts = [] } = useProducts();

  useEffect(() => {
    // Priority 1: Try to get product data from URL (for mobile scan)
    const urlProduct = getProductFromURL(searchParams);
    if (urlProduct && urlProduct.id === productId) {
      setProduct(urlProduct);
      return;
    }

    // Priority 2: Try context products
    if (contextProducts && contextProducts.length > 0) {
      const foundProduct = contextProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        return;
      }
    }

    // Priority 3: Try localStorage
    const storedProducts = getProductsFromStorage();
    const foundProduct = storedProducts.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      return;
    }

    // Priority 4: Try initial products (mockData)
    const initialProduct = initialProducts.find(p => p.id === productId);
    if (initialProduct) {
      setProduct(initialProduct);
      return;
    }

    // Not found
    setProduct(null);
  }, [productId, searchParams, contextProducts]);

  if (!product) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <div className="hover-card" style={{ position: "relative", marginTop: 20 }}>
        <h3>{product.name}</h3>
        <img src={product.image} width="80" alt={product.name} />
        <p>Price: {product.price}</p>
        <p>ID: {product.id}</p>
      </div>
    </div>
  );
}

