import "../styles/ProductCard.css";

interface Props {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onAdd: () => void;
}

export const ProductCard = ({ product, onAdd }: Props) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p className="price">COP ${product.price.toLocaleString("es-CO")}</p>
      <button onClick={onAdd}>Añadir al carrito</button>
    </div>
  );
};
