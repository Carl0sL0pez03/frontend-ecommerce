import { createContext, useContext, useEffect, useState } from "react";

export interface Product {
  _id: string;
  name: string;
  price: number;
  urlImg: string;
  stock: number;
}

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => void;
  triggerRefresh: () => void;
  refreshKey: number;
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  isLoading: false,
  error: null,
  refreshProducts: () => {},
  triggerRefresh: () => {},
  refreshKey: 0,
});

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}products/getAll`
      );
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar productos.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerRefresh = () => setRefreshKey(Date.now());

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        refreshProducts: fetchProducts,
        triggerRefresh,
        refreshKey,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
