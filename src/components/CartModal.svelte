<script lang="ts">
  /**
   * @component CartModal
   * Modal del carrito de compras con sistema A/B testing.
   *
   * - Variante A: Carrito local + envío de cotización manual (email/WhatsApp)
   * - Variante B: Cotización automática vía Syscom API
   */
  import {
    cart,
    cartItems,
    cartIsOpen,
    cartTotal,
    cartVariant,
    formatCurrency,
    type CartItem,
    type CustomerData,
  } from "../stores/cart";

  // Estado reactivo
  let isOpen = $state(false);
  let items = $state<CartItem[]>([]);
  let total = $state(0);
  let variant = $state<"A" | "B">("A");
  let isSubmitting = $state(false);
  let submitSuccess = $state(false);
  let submitError = $state<string | null>(null);

  // Datos del formulario
  let customerName = $state("");
  let customerEmail = $state("");
  let customerPhone = $state("");
  let customerCompany = $state("");
  let customerMessage = $state("");
  let formErrors = $state<Record<string, string>>({});

  // Suscribirse a los stores
  $effect(() => {
    const unsubIsOpen = cartIsOpen.subscribe((value) => (isOpen = value));
    const unsubItems = cartItems.subscribe((value) => (items = value));
    const unsubTotal = cartTotal.subscribe((value) => (total = value));
    const unsubVariant = cartVariant.subscribe((value) => (variant = value));

    return () => {
      unsubIsOpen();
      unsubItems();
      unsubTotal();
      unsubVariant();
    };
  });

  // Cerrar con Escape
  $effect(() => {
    if (!isOpen) return;

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        cart.close();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    };
  });

  /**
   * Valida el formulario
   */
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!customerEmail.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = "Email inválido";
    }

    if (!customerPhone.trim()) {
      errors.phone = "El teléfono es requerido";
    } else if (!/^[0-9+\-\s()]{7,}$/.test(customerPhone)) {
      errors.phone = "Teléfono inválido";
    }

    formErrors = errors;
    return Object.keys(errors).length === 0;
  }

  /**
   * Envía la solicitud de cotización
   */
  async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;
    submitError = null;
    submitSuccess = false;

    const customerData: CustomerData = {
      name: customerName.trim(),
      email: customerEmail.trim(),
      phone: customerPhone.trim(),
      company: customerCompany.trim() || undefined,
      message: customerMessage.trim() || undefined,
    };

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer: customerData,
          variant,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al enviar la solicitud");
      }

      submitSuccess = true;
      cart.clear();

      // Cerrar modal después de mostrar éxito
      setTimeout(() => {
        cart.close();
        submitSuccess = false;
        resetForm();
      }, 3000);
    } catch (error) {
      submitError =
        error instanceof Error ? error.message : "Error desconocido";
    } finally {
      isSubmitting = false;
    }
  }

  /**
   * Abre WhatsApp con los datos del carrito
   */
  function handleWhatsApp() {
    const message = generateWhatsAppMessage();
    const phone = "573150646626"; // WhatsApp de Juan Oliver
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  /**
   * Genera el mensaje para WhatsApp
   */
  function generateWhatsAppMessage(): string {
    let message = "🛒 *Solicitud de Cotización*\n\n";
    message += "*Productos:*\n";

    for (const item of items) {
      message += `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}\n`;
    }

    message += `\n*Total Estimado:* ${formatCurrency(total)}\n\n`;
    message += `*Datos de contacto:*\n`;
    message += `Nombre: ${customerName}\n`;
    message += `Email: ${customerEmail}\n`;
    message += `Teléfono: ${customerPhone}\n`;

    if (customerCompany) {
      message += `Empresa: ${customerCompany}\n`;
    }

    if (customerMessage) {
      message += `\n*Mensaje:*\n${customerMessage}\n`;
    }

    return message;
  }

  /**
   * Resetea el formulario
   */
  function resetForm() {
    customerName = "";
    customerEmail = "";
    customerPhone = "";
    customerCompany = "";
    customerMessage = "";
    formErrors = {};
  }

  /**
   * Maneja clic en el overlay
   */
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      cart.close();
    }
  }
</script>

{#if isOpen}
  <!-- Overlay -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    onclick={handleOverlayClick}
  >
    <!-- Modal -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-modal-title"
    >
      <!-- Header -->
      <header
        class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700"
      >
        <div>
          <h2
            id="cart-modal-title"
            class="text-xl font-bold text-slate-900 dark:text-white"
          >
            Tu Carrito
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {#if variant === "A"}
              Solicita cotización por email o WhatsApp
            {:else}
              Cotización automática vía Syscom
            {/if}
          </p>
        </div>
        <button
          onclick={() => cart.close()}
          class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label="Cerrar carrito"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        {#if submitSuccess}
          <!-- Éxito -->
          <div class="text-center py-12">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
              ¡Solicitud Enviada!
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              {#if variant === "A"}
                Te contactaremos pronto para darte la cotización.
              {:else}
                Recibirás la cotización en tu email.
              {/if}
            </p>
          </div>
        {:else if items.length === 0}
          <!-- Carrito vacío -->
          <div class="text-center py-12">
            <svg
              class="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              />
            </svg>
            <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h3>
            <p class="text-slate-500 dark:text-slate-400">
              Añade productos desde la tienda
            </p>
          </div>
        {:else}
          <div class="space-y-6">
            <!-- Lista de productos -->
            <div class="space-y-4">
              <h3 class="font-semibold text-slate-900 dark:text-white">
                Productos ({items.length})
              </h3>
              <ul class="divide-y divide-slate-200 dark:divide-slate-700">
                {#each items as item (item.id)}
                  <li class="py-4 flex gap-4">
                    <!-- Imagen -->
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0"
                    >
                      {#if item.imageUrl}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          class="w-full h-full object-cover"
                        />
                      {:else}
                        <div
                          class="w-full h-full flex items-center justify-center text-slate-400"
                        >
                          <svg
                            class="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </div>
                      {/if}
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <h4
                        class="font-medium text-slate-900 dark:text-white truncate"
                      >
                        {item.name}
                      </h4>
                      {#if item.brand}
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                          {item.brand}
                        </p>
                      {/if}
                      <p
                        class="text-sm font-semibold text-security-blue dark:text-blue-400"
                      >
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <!-- Cantidad -->
                    <div class="flex items-center gap-2">
                      <button
                        onclick={() =>
                          cart.updateQuantity(item.id, item.quantity - 1)}
                        class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span
                        class="w-8 text-center font-medium text-slate-900 dark:text-white"
                      >
                        {item.quantity}
                      </span>
                      <button
                        onclick={() =>
                          cart.updateQuantity(item.id, item.quantity + 1)}
                        class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                      <button
                        onclick={() => cart.removeItem(item.id)}
                        class="ml-2 p-1 text-red-500 hover:text-red-600 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Total -->
            <div
              class="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-700"
            >
              <span class="text-lg font-medium text-slate-900 dark:text-white">
                Total Estimado
              </span>
              <span
                class="text-2xl font-bold text-security-blue dark:text-blue-400"
              >
                {formatCurrency(total)}
              </span>
            </div>

            <!-- Formulario -->
            <form
              onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              class="space-y-4"
            >
              <h3 class="font-semibold text-slate-900 dark:text-white">
                Datos de Contacto
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Nombre -->
                <div>
                  <label
                    for="customer-name"
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Nombre *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    bind:value={customerName}
                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-security-blue focus:border-transparent transition-colors"
                    class:border-red-500={formErrors.name}
                    placeholder="Tu nombre completo"
                  />
                  {#if formErrors.name}
                    <p class="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  {/if}
                </div>

                <!-- Email -->
                <div>
                  <label
                    for="customer-email"
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    bind:value={customerEmail}
                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-security-blue focus:border-transparent transition-colors"
                    class:border-red-500={formErrors.email}
                    placeholder="tu@email.com"
                  />
                  {#if formErrors.email}
                    <p class="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  {/if}
                </div>

                <!-- Teléfono -->
                <div>
                  <label
                    for="customer-phone"
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Teléfono *
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    bind:value={customerPhone}
                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-security-blue focus:border-transparent transition-colors"
                    class:border-red-500={formErrors.phone}
                    placeholder="+57 300 000 0000"
                  />
                  {#if formErrors.phone}
                    <p class="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  {/if}
                </div>

                <!-- Empresa -->
                <div>
                  <label
                    for="customer-company"
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Empresa (opcional)
                  </label>
                  <input
                    id="customer-company"
                    type="text"
                    bind:value={customerCompany}
                    class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-security-blue focus:border-transparent transition-colors"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <!-- Mensaje -->
              <div>
                <label
                  for="customer-message"
                  class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Mensaje (opcional)
                </label>
                <textarea
                  id="customer-message"
                  bind:value={customerMessage}
                  rows="3"
                  class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-security-blue focus:border-transparent transition-colors resize-none"
                  placeholder="Cuéntanos más sobre tu proyecto o necesidades..."
                ></textarea>
              </div>

              <!-- Error -->
              {#if submitError}
                <div
                  class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <p class="text-sm text-red-600 dark:text-red-400">
                    {submitError}
                  </p>
                </div>
              {/if}

              <!-- Botones según variante -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                {#if variant === "A"}
                  <!-- Variante A: Manual -->
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    class="flex-1 px-6 py-3 bg-security-blue hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {#if isSubmitting}
                      <svg
                        class="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Enviando...
                    {:else}
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Solicitar Cotización
                    {/if}
                  </button>
                  <button
                    type="button"
                    onclick={handleWhatsApp}
                    disabled={!customerName || !customerEmail || !customerPhone}
                    class="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      />
                    </svg>
                    WhatsApp
                  </button>
                {:else}
                  <!-- Variante B: Automático -->
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    class="flex-1 px-6 py-3 bg-linear-to-r from-security-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {#if isSubmitting}
                      <svg
                        class="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generando cotización...
                    {:else}
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Generar Cotización Automática
                    {/if}
                  </button>
                {/if}
              </div>
            </form>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Colores personalizados */
  :global(.text-security-blue) {
    color: #2563eb;
  }
  :global(.bg-security-blue) {
    background-color: #2563eb;
  }
  :global(.focus\:ring-security-blue:focus) {
    --tw-ring-color: #2563eb;
  }
</style>
