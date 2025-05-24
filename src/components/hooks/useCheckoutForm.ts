import { useState, useEffect } from "react";
import {
  isValidCardNumber,
  isValidExpiry,
} from "../function/AuxComponents.function";

export interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardHolder: string;
  installments: number;
}

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

export const useCheckoutForm = (initialUser: {
  name?: string;
  email?: string;
}) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem("checkoutForm");
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      name: parsed.name || initialUser?.name || "",
      email: parsed.email || initialUser?.email || "",
      address: parsed.address || "",
      city: parsed.city || "",
      cardNumber: parsed.cardNumber || "",
      expiry: parsed.expiry || "",
      cvc: parsed.cvc || "",
      cardHolder: parsed.cardHolder || initialUser?.name || "",
      installments: parsed.installments || 1,
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      city: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      cardHolder: "",
      installments: 1,
    });
  };

  const validateFields = (cartLength: number): boolean => {
    const newErrors: FormErrors = {};
    if (!isValidCardNumber(formData.cardNumber))
      newErrors.cardNumber = "Número de tarjeta inválido";

    if (!isValidExpiry(formData.expiry))
      newErrors.expiry = "Formato inválido (MM/AA)";

    if (!/^\d{3}$/.test(formData.cvc))
      newErrors.cvc = "CVC debe tener 3 dígitos";

    if (!formData.address.trim())
      newErrors.address = "La dirección es requerida";

    if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";

    if (cartLength === 0) newErrors.general = "El carrito está vacío.";

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  return {
    formData,
    errors,
    setFormData,
    handleInputChange,
    resetForm,
    validateFields,
  };
};
