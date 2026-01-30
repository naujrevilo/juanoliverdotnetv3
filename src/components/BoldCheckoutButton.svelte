<script lang="ts">
  import { onMount, untrack } from "svelte";

  interface Props {
    amount: number;
    description: string;
    currency?: string;
    class?: string;
    redirectionUrl?: string;
  }

  let {
    amount,
    description,
    currency = "COP",
    class: className = "",
    redirectionUrl,
  }: Props = $props();

  let isLoading = $state(false);
  let errorMessage = $state("");
  let integrityData = $state<{
    signature: string;
    apiKey: string;
    orderId: string;
  } | null>(null);

  async function loadIntegrity() {
    if (!amount) return;
    // Evitar recargas si ya estamos cargando
    if (isLoading) return;

    isLoading = true;
    errorMessage = "";
    integrityData = null;

    try {
      // Bold requiere monto entero
      const amountInteger = Math.round(amount).toString();
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const response = await fetch("/api/bold-integrity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: amountInteger,
          currency,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error obteniendo firma");
      }

      const { signature, apiKey } = await response.json();
      integrityData = { signature, apiKey, orderId };
    } catch (error: any) {
      console.error("Error cargando integridad Bold:", error);
      errorMessage = error.message || "No se pudo preparar el pago.";
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    // Recargar firma si cambia el monto
    if (amount > 0) {
      untrack(() => loadIntegrity());
    }
  });

  function handlePayment() {
    if (!integrityData) {
      // Intentar cargar de nuevo si falló o no cargó
      loadIntegrity().then(() => {
        if (integrityData) executeCheckout();
      });
      return;
    }
    executeCheckout();
  }

  function executeCheckout() {
    if (!integrityData) return;

    // @ts-ignore
    if (typeof window.BoldCheckout === "undefined") {
      errorMessage =
        "La librería de pagos no está cargada. Por favor recarga la página.";
      return;
    }

    const { signature, apiKey, orderId } = integrityData;
    const amountInteger = Math.round(amount).toString();

    // Validar URL de redirección
    let finalRedirectionUrl = redirectionUrl || window.location.href;

    // Bold exige HTTPS. Si estamos en localhost (HTTP), usamos una URL dummy HTTPS para evitar error BTN-001.
    if (!finalRedirectionUrl.startsWith("https://")) {
      console.warn(
        "Bold: La URL de redirección debe ser HTTPS. Usando URL de prueba para permitir abrir el modal en localhost.",
      );
      finalRedirectionUrl = "https://bold.co"; // URL segura existente (Home de Bold)
    }

    try {
      // @ts-ignore
      const checkout = new window.BoldCheckout({
        orderId,
        currency,
        amount: amountInteger,
        apiKey,
        integritySignature: signature,
        description,
        redirectionUrl: finalRedirectionUrl,
      });

      checkout.open();
    } catch (e: any) {
      console.error("Error abriendo Bold Checkout:", e);
      errorMessage = "Error al abrir la pasarela de pagos: " + e.message;
    }
  }
</script>

<div class={className}>
  {#if isLoading && !integrityData}
    <div class="flex justify-center py-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>
  {:else if errorMessage}
    <div
      class="text-red-500 text-xs p-2 bg-red-50 rounded border border-red-100 text-center mb-2"
    >
      {errorMessage}
      <button class="underline ml-2 font-bold" onclick={() => loadIntegrity()}
        >Reintentar</button
      >
    </div>
  {/if}

  <!-- Siempre mostramos el botón, deshabilitado si está cargando o error -->
  <button
    onclick={handlePayment}
    class="bold-payment-btn w-full transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
    disabled={isLoading && !integrityData}
  >
    <span>Pagar con</span>
    <svg
      width="59"
      height="20"
      viewBox="0 0 59 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0741 13.5664H32.349C32.0058 17.1701 28.9365 19.9994 25.2109 19.9994C21.4854 19.9994 18.4167 17.1701 18.0735 13.5664H18.0741ZM7.88967 5.8245V19.9674C11.5252 19.6273 14.3817 16.5859 14.3817 12.8957C14.3817 9.20543 11.5252 6.1652 7.88967 5.82509V5.8245ZM25.2115 5.7925C21.4866 5.7925 18.4173 8.62298 18.0741 12.2267H32.349C32.0058 8.62298 28.9365 5.7925 25.2109 5.7925H25.2115ZM0.679688 10.9546V20H6.49433V0H0.679688V10.9546ZM52.5057 0V19.9994H58.3203V0H52.5057ZM44.6599 12.8962C44.6599 13.3454 44.7041 13.7838 44.785 14.2099C45.3688 17.2851 47.9588 19.6682 51.1526 19.9668V5.8245C47.5171 6.1646 44.6605 9.20602 44.6605 12.8962H44.6599ZM35.2896 19.9994H41.1042V0H35.2896V19.9994Z"
        fill="white"
      />
    </svg>
  </button>
</div>

<style>
  .bold-payment-btn {
    background: linear-gradient(270deg, #ff2947 13.86%, #121e6c 83.33%);
    color: white;
    border: none;
    border-radius: 32px;
    padding: 12px 24px;
    font-family: Montserrat, sans-serif;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    min-height: 48px;
  }
</style>
