import "../styles/CheckoutForm.css";

interface CheckoutFormProps {
  formData: any;
  cardType: "visa" | "mastercard" | null;
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNumberChange: (value: string) => void;
  onOpenModal: () => void;
}

const InputError = ({ message }: { message?: string }) =>
  message ? <p className="input-error">{message}</p> : null;

export const CheckoutForm = ({
  formData,
  cardType,
  errors,
  onInputChange,
  onCardNumberChange,
  onOpenModal,
}: CheckoutFormProps) => {
  const installmentOptions = [1, 2, 3, 6, 12, 24, 32];
  return (
    <form className="checkout-form">
      <fieldset className="form-section">
        <legend>Datos de Entrega</legend>

        <InputError message={errors?.general} />

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
        <InputError message={errors?.address} />

        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={formData.city}
          onChange={onInputChange}
          required
        />

        <InputError message={errors?.city} />
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

        <InputError message={errors?.cardHolder} />

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
        <InputError message={errors?.cardNumber} />

        <select
          name="installments"
          value={formData.installments}
          onChange={onInputChange}
          required
        >
          {installmentOptions.map((n) => (
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

        <InputError message={errors?.expiry} />

        <input
          type="password"
          name="cvc"
          placeholder="CVC"
          value={formData.cvc}
          onChange={onInputChange}
          required
          maxLength={3}
        />
        <InputError message={errors?.cvc} />
      </fieldset>

      <button type="button" onClick={onOpenModal}>
        Pay with credit card
      </button>
    </form>
  );
};
