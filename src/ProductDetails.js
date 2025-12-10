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

  // Function to find product from all sources
  const findProductFromAllSources = (id) => {
    // Check context first
    if (contextProducts && contextProducts.length > 0) {
      const found = contextProducts.find(p => p.id === id);
      if (found) return found;
    }
    
    // Check localStorage
    const storedProducts = getProductsFromStorage();
    if (storedProducts && Array.isArray(storedProducts)) {
      const found = storedProducts.find(p => p.id === id);
      if (found) return found;
    }
    
    // Check initial products
    const found = initialProducts.find(p => p.id === id);
    if (found) return found;
    
    return null;
  };

  useEffect(() => {
    // Hide body overflow and ensure full page - only show product details
    const root = document.getElementById('root');
    if (root) {
      root.style.margin = '0';
      root.style.padding = '0';
      root.style.width = '100%';
      root.style.height = '100%';
    }
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Priority 1: Try to get product data from URL (for mobile scan)
    // Note: URL data may not include image (too long for QR code), so we merge with stored data
    const urlProduct = getProductFromURL(searchParams);
    if (urlProduct && urlProduct.id === productId) {
      // Try to find full product data from all sources to get image
      const fullProduct = findProductFromAllSources(productId);
      
      // Merge URL data with full product data (URL data takes precedence for name/price/description)
      // But always preserve image from fullProduct if available
      if (fullProduct) {
        // Use full product image if it exists and is valid, otherwise use placeholder
        const productImage = (fullProduct.image && fullProduct.image.trim() && fullProduct.image !== 'https://via.placeholder.com/100') 
          ? fullProduct.image 
          : 'https://via.placeholder.com/100';
        
        setProduct({
          ...fullProduct,
          ...urlProduct, // URL data overrides name/price/description
          image: productImage, // Always use image from fullProduct (or placeholder)
          description: urlProduct.description || fullProduct.description || '' // Use URL description if available, else full product description
        });
      } else {
        // No full product found, use URL data with default image
        setProduct({
          ...urlProduct,
          image: 'https://via.placeholder.com/100',
          description: urlProduct.description || ''
        });
      }
      return;
    }

    // Priority 2: Try to find product from all sources (when no URL data)
    const foundProduct = findProductFromAllSources(productId);
    if (foundProduct) {
      setProduct(foundProduct);
      return;
    }

    // Not found
    setProduct(null);
    
    return () => {
      if (root) {
        root.style.margin = '';
        root.style.padding = '';
        root.style.width = '';
        root.style.height = '';
      }
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [productId, searchParams, contextProducts]);

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-details-simple">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Handle image error - fallback to placeholder
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/100';
  };

  return (
    <div className="product-details-page">
      <div className="product-details-simple">
        <h1>{product.name}</h1>
        <img 
          src={product.image || 'https://via.placeholder.com/100'} 
          alt={product.name}
          onError={handleImageError}
        />
        <p className="price">{product.price}</p>
        {product.description && product.description.trim() && (
          <p className="description">{product.description}</p>
        )}
        <p className="id">Product ID: {product.id}</p>
      </div>
    </div>
  );
}

