import BarcodeGenerator from "./BarcodeGenerator";

export default function ProductList({ products }) {
  return (
    <>
      {products.map(p => (
        <BarcodeGenerator key={p.id} product={p} />
      ))}
    </>
  );
}

