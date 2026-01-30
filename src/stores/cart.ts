/**
 * @fileoverview Store del carrito de compras con persistencia en localStorage.
 * Implementa sistema A/B testing para experimentos de conversión.
 *
 * @module stores/cart
 *
 * Variante A: Carrito local + notificación manual (email/WhatsApp)
 * Variante B: Cotización automática vía Syscom API
 */

import { writable, derived, get } from "svelte/store";

/**
 * Item del carrito
 */
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  brand?: string | null;
  model?: string | null;
  category?: string;
  source: "local" | "external";
  externalProductId?: string; // ID de Syscom para cotizaciones
}

/**
 * Datos del cliente para cotización/pedido
 */
export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
}

/**
 * Variantes del experimento A/B
 */
export type ABVariant = "A" | "B";

/**
 * Estado del carrito
 */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  variant: ABVariant;
  customerId?: string;
}

// Clave para localStorage
const CART_STORAGE_KEY = "juanoliver_cart";
const VARIANT_STORAGE_KEY = "juanoliver_ab_variant";

/**
 * Obtiene el estado inicial del carrito desde localStorage
 */
function getInitialState(): CartState {
  if (typeof window === "undefined") {
    return { items: [], isOpen: false, variant: "A" };
  }

  try {
    // Verificar si estamos regresando de un pago exitoso
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get("payment");
    const boldStatus = urlParams.get("payment_status");
    
    // Bold puede retornar "APPROVED", "REJECTED", etc.
    const isBoldSuccess = boldStatus && ["APPROVED", "approved", "PAID", "paid", "SUCCEEDED", "succeeded"].includes(boldStatus);
    const isManualSuccess = paymentParam === "success";

    if (isBoldSuccess || isManualSuccess) {
      // Limpiar URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Limpiar storage
      localStorage.removeItem(CART_STORAGE_KEY);
      return { items: [], isOpen: false, variant: "A" };
    }

    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const storedVariant = localStorage.getItem(
      VARIANT_STORAGE_KEY
    ) as ABVariant | null;

    // Asignar variante A/B aleatoria si no existe
    const variant = storedVariant || (Math.random() < 0.5 ? "A" : "B");
    if (!storedVariant) {
      localStorage.setItem(VARIANT_STORAGE_KEY, variant);
    }

    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...parsed, isOpen: false, variant };
    }

    return { items: [], isOpen: false, variant };
  } catch {
    return { items: [], isOpen: false, variant: "A" };
  }
}

/**
 * Persiste el carrito en localStorage
 */
function persistCart(state: CartState): void {
  if (typeof window === "undefined") return;

  try {
    const { isOpen, ...toStore } = state;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error("Error persisting cart:", error);
  }
}

// Crear store principal
function createCartStore() {
  const { subscribe, set, update } = writable<CartState>(getInitialState());

  // Inicializar en el cliente
  if (typeof window !== "undefined") {
    // Rehidratar después del mount
    setTimeout(() => {
      set(getInitialState());
    }, 0);
  }

  return {
    subscribe,

    /**
     * Añade un producto al carrito
     */
    addItem: (product: Omit<CartItem, "quantity">) => {
      update((state) => {
        const existingIndex = state.items.findIndex(
          (item) => item.id === product.id
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          // Incrementar cantidad si ya existe
          newItems = state.items.map((item, index) =>
            index === existingIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Añadir nuevo item
          newItems = [...state.items, { ...product, quantity: 1 }];
        }

        const newState = { ...state, items: newItems };
        persistCart(newState);
        return newState;
      });
    },

    /**
     * Elimina un producto del carrito
     */
    removeItem: (productId: string | number) => {
      update((state) => {
        const newItems = state.items.filter((item) => item.id !== productId);
        const newState = { ...state, items: newItems };
        persistCart(newState);
        return newState;
      });
    },

    /**
     * Actualiza la cantidad de un producto
     */
    updateQuantity: (productId: string | number, quantity: number) => {
      update((state) => {
        if (quantity <= 0) {
          const newItems = state.items.filter((item) => item.id !== productId);
          const newState = { ...state, items: newItems };
          persistCart(newState);
          return newState;
        }

        const newItems = state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        const newState = { ...state, items: newItems };
        persistCart(newState);
        return newState;
      });
    },

    /**
     * Vacía el carrito
     */
    clear: () => {
      update((state) => {
        const newState = { ...state, items: [] };
        persistCart(newState);
        return newState;
      });
    },

    /**
     * Abre/cierra el modal del carrito
     */
    toggleOpen: () => {
      update((state) => ({ ...state, isOpen: !state.isOpen }));
    },

    /**
     * Cierra el modal del carrito
     */
    close: () => {
      update((state) => ({ ...state, isOpen: false }));
    },

    /**
     * Abre el modal del carrito
     */
    open: () => {
      update((state) => ({ ...state, isOpen: true }));
    },

    /**
     * Fuerza una variante específica (para testing)
     */
    setVariant: (variant: ABVariant) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(VARIANT_STORAGE_KEY, variant);
      }
      update((state) => ({ ...state, variant }));
    },

    /**
     * Obtiene el estado actual (útil para enviar al servidor)
     */
    getState: () => get({ subscribe }),
  };
}

// Store singleton
export const cart = createCartStore();

// Stores derivados para conveniencia
export const cartItems = derived(cart, ($cart) => $cart.items);
export const cartItemCount = derived(cart, ($cart) =>
  $cart.items.reduce((sum, item) => sum + item.quantity, 0)
);
export const cartTotal = derived(cart, ($cart) =>
  $cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
export const cartIsOpen = derived(cart, ($cart) => $cart.isOpen);
export const cartVariant = derived(cart, ($cart) => $cart.variant);

/**
 * Formatea precio en COP
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
