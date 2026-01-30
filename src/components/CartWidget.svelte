<script lang="ts">
  /**
   * CartWidget - Botón flotante del carrito de compras
   * Muestra contador de items y abre el modal del carrito
   */
  import { onMount } from "svelte";
  import {
    cart,
    cartItemCount,
    cartTotal,
    formatCurrency,
  } from "../stores/cart";

  let itemCount = $state(0);
  let total = $state(0);
  let isAnimating = $state(false);

  onMount(() => {
    // Backup: Verificar si volvemos de un pago exitoso y limpiar carrito
    // Esto asegura que el carrito se limpie incluso si el Modal no se ha abierto
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get("payment");
    const boldStatus = urlParams.get("payment_status");
    
    // Bold puede retornar "APPROVED", "REJECTED", etc.
    const isBoldSuccess = boldStatus && ["APPROVED", "approved", "PAID", "paid", "SUCCEEDED", "succeeded"].includes(boldStatus);
    const isManualSuccess = paymentParam === "success";

    if (isBoldSuccess || isManualSuccess) {
      console.log("Payment success detected in CartWidget. Clearing cart...", { boldStatus, paymentParam });
      // Forzar limpieza de localStorage directamente para evitar condiciones de carrera
      localStorage.removeItem("juanoliver_cart");
      
      // Limpiar store y estado local inmediatamente
      cart.clear();
      itemCount = 0;
      total = 0;
      
      // Eliminar el query param para limpiar la URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      console.log("Cart cleared.");
    }
  });

  // Suscribirse a los stores
  $effect(() => {
    const unsubCount = cartItemCount.subscribe((value) => {
      if (value > itemCount) {
        // Animar cuando se añade un item
        isAnimating = true;
        setTimeout(() => (isAnimating = false), 300);
      }
      itemCount = value;
    });
    const unsubTotal = cartTotal.subscribe((value) => {
      total = value;
    });

    return () => {
      unsubCount();
      unsubTotal();
    };
  });

  function handleClick() {
    cart.open();
  }
</script>

{#if itemCount > 0}
  <button
    onclick={handleClick}
    class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-linear-to-r from-security-blue to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 group"
    class:animate-bounce={isAnimating}
    aria-label="Abrir carrito de compras"
  >
    <!-- Icono del carrito -->
    <div class="relative">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        />
      </svg>
      <!-- Badge con contador -->
      <span
        class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold bg-security-yellow text-slate-900 rounded-full shadow-lg"
      >
        {itemCount}
      </span>
    </div>

    <!-- Total -->
    <div class="hidden sm:block">
      <div class="text-xs opacity-80">Tu carrito</div>
      <div class="font-bold text-sm">{formatCurrency(total)}</div>
    </div>

    <!-- Flecha -->
    <svg
      class="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5l7 7-7 7"
      />
    </svg>
  </button>
{/if}

<style>
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce {
    animation: bounce 0.3s ease-in-out;
  }
</style>
