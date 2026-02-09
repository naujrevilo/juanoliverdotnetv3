<script lang="ts">
  // Mapeo de iconos SVG igual que en ServiceCard.astro
  const icons: Record<string, string> = {
    shield: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`,
    search: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />`,
    refresh: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />`,
    "cloud-backup": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />`,
    "lock-network": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />`,
    "clipboard-check": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />`,
    server: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />`,
    network: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />`,
    database: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />`,
    "hard-drive": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />`,
    code: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />`,
    puzzle: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />`,
    "database-design": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />`,
    globe: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />`,
    chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
    headset: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />`,
    "file-text": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
    terminal: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 17l6-6-6-6M12 19h8" />`,
    "server-cog": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />`,
    "phone-call": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />`,
    activity: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
    "shield-check": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`,
    "cloud-search": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />`,
    "clipboard-list": `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />`,
  };
  /**
   * @component StoreList
   * Lista de productos de la tienda con integración al carrito A/B testing.
   *
   * @description Muestra productos en grid y permite añadirlos al carrito.
   * El carrito usa sistema A/B para experimentos de conversión.
   */
  import { cart, formatCurrency } from "../stores/cart";

  interface Product {
    id: number | string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    brand?: string | null;
    model?: string | null;
    category?: string;
    externalProductId?: string; // ID de Syscom para cotizaciones
    source?: "local" | "external";
    stock?: number;
    icon?: string; // icono SVG personalizado para servicios
  }

  interface Props {
    products: Product[];
  }

  let { products = [] }: Props = $props();

  // Estado para feedback visual
  let addedProductId = $state<string | number | null>(null);
  // Estado para manejo de errores de imágenes
  let failedImages = $state<Record<string | number, boolean>>({});

  /**
   * Maneja el error de carga de imagen
   */
  function handleImageError(id: string | number) {
    failedImages[id] = true;
  }

  /**
   * Añade un producto al carrito con feedback visual
   */
  function handleAddToCart(product: Product) {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      brand: product.brand,
      model: product.model,
      category: product.category,
      source: product.source || "external",
      externalProductId: product.externalProductId || String(product.id),
    });

    // Feedback visual
    addedProductId = product.id;
    setTimeout(() => {
      addedProductId = null;
    }, 1000);
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {#each products as product}
    <div
      class="glass-card card-hover-lift rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-security-blue/60 dark:hover:border-blue-400/60 transition-all duration-500 flex flex-col group relative overflow-hidden"
    >
      <!-- Hover Glow Effect -->
      <div
        class="absolute inset-0 bg-linear-to-br from-security-blue/5 dark:from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
      ></div>

      <!-- Image Container -->
      <div
        class="h-56 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-slate-400 overflow-hidden relative"
      >
        {#if product.imageUrl && !failedImages[product.id]}
          <img
            src={product.imageUrl}
            alt={product.name}
            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onerror={() => handleImageError(product.id)}
          />
        {:else if product.category === "Servicios"}
          <!-- Icono SVG personalizado para cada servicio -->
          <div class="text-center">
            <div
              class="w-20 h-20 mx-auto mb-3 bg-security-blue/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            >
              <svg
                class="w-10 h-10 text-security-blue dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {@html icons[String(product.icon ?? "shield")]}
              </svg>
            </div>
            <span
              class="text-xs font-bold text-security-blue dark:text-blue-400 uppercase tracking-wider"
              >Servicio Profesional</span
            >
          </div>
        {:else}
          <div class="text-center">
            <svg
              class="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span class="text-xs font-medium">Sin Imagen</span>
          </div>
        {/if}

        <!-- Badges -->
        <div class="absolute top-3 left-3 flex flex-col gap-2">
          {#if product.category}
            <div
              class="inline-flex px-3 py-1 rounded-full backdrop-blur-sm text-xs font-bold uppercase tracking-wider shadow-lg {product.category ===
              'Servicios'
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                : 'bg-security-blue dark:bg-blue-500 text-white'}"
            >
              {product.category === "Servicios"
                ? "🛡️ Servicio"
                : product.category}
            </div>
          {/if}
          {#if product.stock && product.stock < 10 && product.stock > 0}
            <div
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-security-yellow dark:bg-yellow-500 backdrop-blur-sm text-slate-900 dark:text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Stock Bajo
            </div>
          {/if}
        </div>

        {#if product.brand && product.brand !== "Syscom"}
          <div
            class="absolute top-3 right-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600"
          >
            {product.brand}
          </div>
        {/if}
      </div>

      <div class="p-6 flex flex-col grow">
        <!-- Content -->
        <div class="flex items-start justify-between mb-2 relative z-10">
          <div class="grow">
            {#if product.model}
              <span
                class="inline-block px-2 py-0.5 text-xs text-security-blue dark:text-blue-400 font-mono bg-security-blue/10 dark:bg-blue-400/10 rounded mb-2 font-semibold"
                >{product.model}</span
              >
            {/if}
            <h3
              class="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-security-blue dark:group-hover:text-blue-400 transition-colors"
            >
              {product.name}
            </h3>
          </div>
        </div>

        <p
          class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 grow leading-relaxed relative z-10"
        >
          {product.description}
        </p>

        <!-- Price & Action -->
        <div
          class="flex justify-between items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 relative z-10"
        >
          <div>
            <div
              class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1"
            >
              {product.category === "Servicios" ? "Desde" : "Precio"}
            </div>
            <span class="font-black text-2xl gradient-text"
              >{formatCurrency(product.price)}</span
            >
          </div>
          <button
            onclick={() => handleAddToCart(product)}
            class="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 group/btn {product.category ===
            'Servicios'
              ? 'bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
              : 'bg-linear-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-700 hover:from-security-blue hover:to-blue-600 dark:hover:from-blue-500 dark:hover:to-blue-600'}"
            class:!from-green-500={addedProductId === product.id}
            class:!to-green-600={addedProductId === product.id}
            aria-label="Agregar {product.name} al carrito"
          >
            {#if addedProductId === product.id}
              <svg
                class="w-4 h-4"
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
              ¡Añadido!
            {:else}
              <svg
                class="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                />
              </svg>
              Agregar
            {/if}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div
      class="col-span-full text-center py-20 glass-card rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600"
    >
      <div class="max-w-md mx-auto">
        <div
          class="w-20 h-20 mx-auto mb-6 bg-linear-to-br from-security-blue/20 dark:from-blue-400/20 to-blue-500/20 rounded-2xl flex items-center justify-center"
        >
          <svg
            class="w-10 h-10 text-security-blue dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Catálogo en actualización
        </h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          Estamos actualizando nuestro inventario de hardware y software de
          seguridad. Vuelve pronto para ver las últimas novedades.
        </p>
      </div>
    </div>
  {/each}
</div>
