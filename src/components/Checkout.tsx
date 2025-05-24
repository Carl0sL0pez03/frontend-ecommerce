import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "../styles/Checkout.css";
import { PaymentModal } from "./PaymentModal";
import { CheckoutForm } from "./CheckoutForm";
import { useCart, useProducts } from "../context";
import {
  calculateSubtotal,
  detectCardType,
} from "./function/AuxComponents.function";
import { useCheckoutForm } from "./hooks/useCheckoutForm";

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { products, triggerRefresh } = useProducts();
  const { formData, errors, handleInputChange, resetForm, validateFields } =
    useCheckoutForm(user || {});

  const [showModal, setShowModal] = useState(false);
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = calculateSubtotal(cart, products);

  const baseFee = 5000;
  const deliveryFee = 9000;

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formData));
  }, [formData]);

  const handleSubmit = async () => {
    setIsProcessing(true);

    const order = {
      customer: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        email: formData.email,
      },
      payment: {
        cardNumber: formData.cardNumber.replace(/\s/g, ""),
        expiry: formData.expiry,
        cvc: formData.cvc,
        cardHolder: formData.cardHolder,
        installments: Number(formData?.installments) || 1,
      },
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      total: subtotal + baseFee + deliveryFee,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL_API}transactions/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );

      const result = await res.json();

      if (result?.error) {
        alert(
          result?.error?.error?.messages?.number?.[0] || "Error en el pago"
        );
        return;
      }

      clearCart();
      resetForm();
      localStorage.removeItem("checkoutForm");
      alert("¡Compra realizada con éxito!");
      triggerRefresh();
      navigate("/home");
    } catch (err) {
      alert("Ocurrió un error al procesar el pago.");
    } finally {
      setIsProcessing(false);
    }
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
            if (validateFields(cart.length)) {
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
                    const product = products.find(
                      (prod) => prod._id === item._id
                    );
                    if (!product) return null;

                    return (
                      <li key={item._id} className="cart-item">
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
                                item._id,
                                Math.min(Number(e.target.value), product.stock)
                              )
                            }
                          />
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
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
                    const product = products.find((p) => p._id === item._id);
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
