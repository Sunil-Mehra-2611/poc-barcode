import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function BarcodeGenerator({ product }) {
  const [showDetails, setShowDetails] = useState(false);
  const qrRef = useRef(null); 
  
  // Safety check
  if (!product || !product.id) {
    return <div>Error: Product data is missing</div>;
  }

  // Create URL for product details page with encoded product data
  // This ensures product data is available even on different devices
  let productUrl = '';
  try {
    const productData = btoa(JSON.stringify({
      id: product.id || '',
      name: product.name || '',
      price: product.price || '',
      image: product.image || 'https://via.placeholder.com/100'
    }));
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    productUrl = `${origin}/product/${product.id}?data=${encodeURIComponent(productData)}`;
  } catch (error) {
    console.error("Error generating product URL:", error);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    productUrl = `${origin}/product/${product.id}`;
  }

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
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
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
        <div className="hover-card">
          <h3>{product.name}</h3>
          <img src={product.image} width="80" alt={product.name} />
          <p>Price: {product.price}</p>
          <p>ID: {product.id}</p>
        </div>
      )}
    </div>
  );
}

