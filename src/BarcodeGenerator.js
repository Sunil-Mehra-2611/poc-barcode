import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function BarcodeGenerator({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  const qrRef = useRef(null);
  const hideTimeoutRef = useRef(null); 
  
  // Cleanup timeout on unmount - must be called before any early returns
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);
  
  // Safety check
  if (!product || !product.id) {
    return <div>Error: Product data is missing</div>;
  }

  // Create URL for product details page with encoded product data
  // Note: Image is excluded from QR code data as base64 images are too long for QR codes
  // The image will be fetched from localStorage/context when the product page loads
  let productUrl = '';
  try {
    // Limit description length to prevent QR code from being too long
    const maxDescriptionLength = 200;
    const truncatedDescription = product.description 
      ? product.description.substring(0, maxDescriptionLength)
      : '';
    
    const productData = btoa(JSON.stringify({
      id: product.id || '',
      name: product.name || '',
      price: product.price || '',
      description: truncatedDescription
      // Image excluded - too long for QR code, will be fetched from storage
    }));
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    productUrl = `${origin}/product/${product.id}?data=${encodeURIComponent(productData)}`;
  } catch (error) {
    console.error("Error generating product URL:", error);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    productUrl = `${origin}/product/${product.id}`;
  }

  // Handle mouse enter - show card immediately
  const handleMouseEnter = (e) => {
    e.preventDefault();
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowDetails(true);
  };

  // Handle mouse leave - hide card with delay
  const handleMouseLeave = (e) => {
    e.preventDefault();
    hideTimeoutRef.current = setTimeout(() => {
      setShowDetails(false);
    }, 300); // 300ms delay before hiding to allow mouse movement to card
  };

  // Download QR Code as PNG
  const downloadQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        canvas.width = 200;
        canvas.height = 200;
        
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${product.name}-QRCode.png`;
            link.click();
            URL.revokeObjectURL(url);
          });
        };
        
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
      }
    }
  };

  return (
    <div 
      className="barcode-container"
      style={{ marginBottom: 20, position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <h4>{product.name}</h4> */}
      <div className="barcode-wrapper" ref={qrRef}>
        <QRCodeSVG value={productUrl} size={200} />
      </div>
      {/* <p>{product.id}</p> */}
      
      <button 
        onClick={downloadQRCode}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px"
        }}
      >
        Download QR Code
      </button>
      
      {showDetails && (
        <div 
          className="hover-card"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image - if available */}
          {product.image && product.image !== 'https://via.placeholder.com/100' && (
            <img 
              src={product.image} 
              width="100" 
              alt={product.name}
              className="hover-card-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/100';
              }}
            />
          )}
          
          {/* Product ID */}
          <p className="hover-card-field">
            <span className="field-label">Product ID:</span> {product.id}
          </p>
          
          {/* Product Name */}
          <p className="hover-card-field">
            <span className="field-label">Product Name:</span> {product.name}
          </p>
          
          {/* Product Price */}
          <p className="hover-card-field">
            <span className="field-label">Product Price:</span> {product.price}
          </p>
          
          {/* Description */}
          {product.description && product.description.trim() && (
            <p className="hover-card-field description-text">
              <span className="field-label">Description:</span> {product.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

