import { useEffect, useState } from "react";

import "../styles/Deliveries.css";

interface Delivery {
  deliveryId: string;
  deliveredAt: string;
  orderId: string;
  productId: string;
  quantity: number;
  productName: string;
}

export const Deliveries = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL_API}deliveries/getAll`
        );
        const data = await res.json();
        setDeliveries(data);
      } catch (err) {
        console.error("Error cargando entregas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="deliveries-container">
      <h2>Entregas recientes</h2>
      {loading ? (
        <p>Cargando entregas...</p>
      ) : (
        <div className="table-wrapper">
          <table className="deliveries-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Pedido ID</th>
                <th>Cantidad</th>
                <th>Fecha de entrega</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery, index) => (
                <tr key={delivery.deliveryId}>
                  <td>{index + 1}</td>
                  <td>{delivery.productName}</td>
                  <td>{delivery.orderId}</td>
                  <td>{delivery.quantity}</td>
                  <td>
                    {new Date(delivery.deliveredAt).toLocaleString("es-CO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
