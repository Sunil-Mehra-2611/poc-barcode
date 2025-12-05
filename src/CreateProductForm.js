import { useState } from "react";

export default function CreateProductForm({ onAddProduct, onClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !price.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Auto-generate ID
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const newId = `PROD-${timestamp}-${randomNum}`;

    const newProduct = {
      id: newId,
      name: name.trim(),
      price: price.trim(),
      image: "https://via.placeholder.com/100"
    };

    onAddProduct(newProduct);
    
    // Reset form
    setName("");
    setPrice("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Store Product</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

