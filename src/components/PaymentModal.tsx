import "../styles/PaymentModal.css";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  subtotal: number;
  baseFee: number;
  deliveryFee: number;
}

export const PaymentModal = ({
  visible,
  onClose,
  onConfirm,
  isProcessing,
  subtotal,
  baseFee,
  deliveryFee,
}: PaymentModalProps) => {
  if (!visible) return null;

  const total = subtotal + baseFee + deliveryFee;

  return (
    <div className="backdrop">
      <div className="modal">
        <h2>Resumen de Pago</h2>
        <ul>
          <li>Subtotal: COP ${subtotal.toLocaleString("es-CO")}</li>
          <li>Tarifa base: COP ${baseFee.toLocaleString("es-CO")}</li>
          <li>Envío: COP ${deliveryFee.toLocaleString("es-CO")}</li>
          <li className="total">
            Total: COP <strong>${total.toLocaleString("es-CO")}</strong>
          </li>
        </ul>
        <div className="modal-buttons">
          <button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? "Procesando..." : "Confirmar Pago"}
          </button>
          <button onClick={onClose} className="cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
