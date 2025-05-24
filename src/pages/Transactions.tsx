import { useEffect, useState } from "react";

import "../styles/Transactions.css";

interface Transaction {
  customer: {
    name: string;
    address: string;
    city: string;
    email: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  total: number;
  status: string;
  result: {
    payment_method: {
      installments: number;
      type: string;
    };
    status: string;
  };
}

export const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_URL_API}transactions/getAll`
        );
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error al cargar transacciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      COMPLETED: "Completado",
      PENDING: "Pendiente",
      FAILED: "Fallido",
    };

    return statusMap[status] || status;
  };

  const translatePaymentType = (type: string) => {
    const typeMap: Record<string, string> = {
      CARD: "Tarjeta",
    };

    return typeMap[type] || type;
  };

  return (
    <div className="transactions-container">
      <h2>Historial de Transacciones</h2>
      {loading ? (
        <p>Cargando transacciones...</p>
      ) : (
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Ciudad</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Tipo de pago</th>
                <th>Cuotas</th>
                <th>Estado</th>
                <th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{transaction?.customer?.name}</td>
                  <td>{transaction?.customer?.city}</td>
                  <td>
                    <ul>
                      {transaction?.items?.map((item, j) => (
                        <li key={j}>{item?.productName}</li>
                      ))}
                    </ul>
                  </td>
                  <td>COP ${transaction?.total.toLocaleString("es-CO")}</td>
                  <td>
                    {translatePaymentType(
                      transaction?.result?.payment_method?.type
                    )}
                  </td>
                  <td>{transaction?.result?.payment_method?.installments || 1}</td>
                  <td>{translateStatus(transaction?.status)}</td>
                  <td>{translateStatus(transaction?.result?.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
