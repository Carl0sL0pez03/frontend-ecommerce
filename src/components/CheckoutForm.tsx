import "../styles/CheckoutForm.css";

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
      <fieldset className="form-section">
        <legend>Datos de Entrega</legend>

        {errors.general && <p className="input-error">{errors.general}</p>}

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
      </fieldset>

      <fieldset className="form-section">
        <legend>Datos de Tarjeta</legend>

        <input
          type="text"
          name="cardHolder"
          placeholder="Nombre en la tarjeta"
          value={formData.cardHolder}
          onChange={onInputChange}
          required
        />
        {errors.cardHolder && (
          <p className="input-error">{errors.cardHolder}</p>
        )}

        <div className="card-input-wrapper">
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
          {cardType && (
            <img
              src={cardType === "visa" ? "/Visa.svg" : "/Mastercard-logo.svg"}
              alt={cardType}
            />
          )}
        </div>
        {errors.cardNumber && (
          <p className="input-error">{errors.cardNumber}</p>
        )}

        <select
          name="installments"
          value={formData.installments}
          onChange={onInputChange}
          required
        >
          {[1, 2, 3, 6, 12].map((n) => (
            <option key={n} value={n}>
              {n} cuota{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>

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
        {errors.cvc && <p className="input-error">{errors.cvc}</p>}
      </fieldset>

      <button type="button" onClick={onOpenModal}>
        Pay with credit card
      </button>
    </form>
  );
};
