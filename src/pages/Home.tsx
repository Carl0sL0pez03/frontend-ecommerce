import "../styles/Home.css";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

export const Home = () => {
  const { addToCart } = useCart();

  return (
    <div className="home-container">
      <header className="hero">
        <h2>Productos destacados</h2>
        <p>Explora los artículos más buscados del momento</p>
      </header>

      <section className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
        ))}
      </section>
    </div>
  );
};
