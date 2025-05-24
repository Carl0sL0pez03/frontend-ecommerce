import "../styles/Home.css";
import { ProductCard } from "../components/ProductCard";
import { useCart, useProducts } from "../context";

export const Home = () => {
  const { products, isLoading, error } = useProducts();
  const { addToCart } = useCart();

  return (
    <div className="home-container">
      <header className="hero">
        <h2>Productos destacados</h2>
        <p>Explora los artículos más buscados del momento</p>
      </header>

      {isLoading ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <section className="products-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />
          ))}
        </section>
      )}
    </div>
  );
};
