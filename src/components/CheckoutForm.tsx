interface CheckoutFormProps {
  formData: any;
  cardType: "visa" | "mastercard" | null;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNumberChange: (value: string) => void;
  onOpenModal: () => void;
}

export const CheckoutForm = ({
  formData,
  cardType,
  errors,
  onInputChange,
  onCardNumberChange,
  onOpenModal,
}: CheckoutFormProps) => {
  return (
    <form className="checkout-form">
      <h3>Datos de Entrega</h3>

      {errors.general && (
        <p className="input-error" style={{ marginTop: "1rem" }}>
          {errors.general}
        </p>
      )}

      <input
        type="text"
        name="name"
        placeholder="Nombre completo"
        value={formData.name}
        onChange={onInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        disabled
      />

      <input
        type="text"
        name="address"
        placeholder="Dirección"
        value={formData.address}
        onChange={onInputChange}
        required
      />
      {errors.address && <p className="input-error">{errors.address}</p>}
      <input
        type="text"
        name="city"
        placeholder="Ciudad"
        value={formData.city}
        onChange={onInputChange}
        required
      />
      {errors.city && <p className="input-error">{errors.city}</p>}

      <h3>Datos de Tarjeta</h3>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          name="cardNumber"
          placeholder="Número de tarjeta"
          value={formData.cardNumber}
          onChange={(e) => {
            onInputChange(e);
            onCardNumberChange(e.target.value);
          }}
          required
        />
        {errors.cardNumber && (
          <p className="input-error">{errors.cardNumber}</p>
        )}
        {cardType && (
          <img
            src={cardType === "visa" ? "/Visa.svg" : "/Mastercard-logo.svg"}
            alt={cardType}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              height: "20px",
            }}
          />
        )}
      </div>
      <input
        type="text"
        name="expiry"
        placeholder="MM/AA"
        value={formData.expiry}
        onChange={onInputChange}
        required
      />
      {errors.expiry && <p className="input-error">{errors.expiry}</p>}
      <input
        type="password"
        name="cvc"
        placeholder="CVC"
        value={formData.cvc}
        onChange={onInputChange}
        required
        maxLength={3}
      />

      <button type="button" onClick={onOpenModal}>
        Pay with credit card
      </button>
    </form>
  );
};
