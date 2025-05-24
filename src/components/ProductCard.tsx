import type { Product } from "../context/ProductsContext";

import "../styles/ProductCard.css";

interface Props {
  product: Product;
  onAdd: () => void;
}

export const ProductCard = ({ product, onAdd }: Props) => {
  return (
    <div className="product-card">
      <img
        src={product?.urlImg}
        alt={product?.name}
        className="product-image"
      />
      <h3>{product?.name}</h3>
      <p className="price">COP ${product?.price.toLocaleString("es-CO")}</p>
      <p className="stock">Stock disponible: {product?.stock}</p>
      <button
        onClick={onAdd}
        disabled={product?.stock === 0}
        className={product?.stock === 0 ? "disabled-button" : ""}
      >
        {product?.stock === 0 ? "Agotado" : "Añadir al carrito"}
      </button>
    </div>
  );
};
