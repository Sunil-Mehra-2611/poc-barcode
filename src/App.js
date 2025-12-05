import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ProductsProvider, useProducts } from "./ProductsContext";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import CreateProductForm from "./CreateProductForm";
import "./styles.css";

function HomePage() {
  const { products, addProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ padding: 20, position: "relative" }}>
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "12px 24px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        + Create Store Product
      </button>

      <h2>POC: QR Code Hover & Mobile Scan Detection</h2>
      <p>Hover over any QR code to see product details, or scan with mobile to open product page</p>
      
      <h3 style={{ marginTop: 30, marginBottom: 20, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Generated Barcodes</h3>
      
      <div className="products-wrapper">
        <ProductList products={products} />
      </div>

      {showForm && (
        <CreateProductForm
          onAddProduct={addProduct}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
    </ProductsProvider>
  );
}
