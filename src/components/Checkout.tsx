import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import "../styles/Checkout.css";
import { PaymentModal } from "./PaymentModal";
import { CheckoutForm } from "./CheckoutForm";

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  const baseFee = 5000;
  const deliveryFee = 9000;
  const storedForm = localStorage.getItem("checkoutForm");

  const [formData, setFormData] = useState(() => {
    const saved = storedForm ? JSON.parse(storedForm) : {};
    return {
      name: saved.name || user?.name || "",
      email: saved.email || user?.email || "",
      address: saved.address || "",
      city: saved.city || "",
      cardNumber: saved.cardNumber || "",
      expiry: saved.expiry || "",
      cvc: saved.cvc || "",
    };
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    address: "",
    city: "",
    general: "",
  });

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formData));
  }, [formData]);

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      email: "",
      city: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const detectCardType = (number: string) => {
    const clean = number.replace(/\s+/g, "");
    if (/^4[0-9]{0,}$/.test(clean)) return "visa";
    if (/^5[1-5]/.test(clean) || /^2(2[2-9]|[3-6]|7[01])/.test(clean))
      return "mastercard";
    return null;
  };

  const isValidExpiry = (expiry: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiry);
  };

  const isValidCardNumber = (card: string): boolean => {
    const cleanCard = card.replace(/\D/g, "");
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanCard.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanCard[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const validateFields = () => {
    const newErrors: typeof errors = {
      cardNumber: "",
      expiry: "",
      cvc: "",
      address: "",
      city: "",
      general: "",
    };

    if (!isValidCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }

    if (!isValidExpiry(formData.expiry)) {
      newErrors.expiry = "Formato inválido (MM/AA)";
    }

    if (!/^\d{3}$/.test(formData.cvc)) {
      newErrors.cvc = "CVC debe tener 3 dígitos";
    }

    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (cart.length === 0) {
      newErrors.general =
        "El carrito está vacío. Añade productos para continuar.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === "");
  };

  const handleSubmit = () => {
    setIsProcessing(true);

    const order = {
      customer: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
      },
      payment: {
        cardNumber: formData.cardNumber
          .replace(/\D/g, "")
          .replace(/.(?=.{4})/g, "*"),
        expiry: formData.expiry,
      },
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      total: subtotal + baseFee + deliveryFee,
    };

    console.log("Procesando pago con:", order);
    clearCart();
    resetForm();
    localStorage.removeItem("checkoutForm");
    alert("¡Compra realizada con éxito!");
    navigate("/home");
  };

  return (
    <div className="checkout-container">
      <h2>Resumen de compra</h2>
      <div className="checkout-grid">
        <CheckoutForm
          formData={formData}
          cardType={cardType}
          onInputChange={handleInputChange}
          errors={errors}
          onCardNumberChange={(number) => setCardType(detectCardType(number))}
          onOpenModal={() => {
            if (validateFields()) {
              setShowModal(true);
            }
          }}
        />

        <div className="cart-review">
          <h3>Tu carrito</h3>
          {cart.length === 0 ? (
            <p>No tienes productos.</p>
          ) : (
            <>
              <div className="cart-items-scroll">
                <ul>
                  {cart.map((item) => {
                    const product = products.find((p) => p.id === item.id);
                    if (!product) return null;

                    return (
                      <li key={item.id} className="cart-item">
                        <div className="item-info">
                          <strong>{product.name}</strong>
                          <br />
                          COP ${product.price.toLocaleString("es-CO")} x{" "}
                          <input
                            type="number"
                            min={1}
                            max={product.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                Math.min(Number(e.target.value), product.stock)
                              )
                            }
                          />
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-icon"
                          title="Eliminar producto"
                        >
                          ❌
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="cart-total-fixed">
                <strong>Total:</strong> COP $
                {cart
                  .reduce((acc, item) => {
                    const product = products.find((p) => p.id === item.id);
                    return acc + (product ? product.price * item.quantity : 0);
                  }, 0)
                  .toLocaleString("es-CO")}
              </div>
            </>
          )}
        </div>
      </div>

      <PaymentModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        isProcessing={isProcessing}
        subtotal={subtotal}
        baseFee={baseFee}
        deliveryFee={deliveryFee}
      />
    </div>
  );
};
