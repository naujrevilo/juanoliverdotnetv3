<script lang="ts">
  /**
   * @fileoverview Lista de servicios con lazy loading.
   * Muestra 4 servicios inicialmente y carga el resto cuando el usuario hace scroll.
   */
  import ServiceImageSvelte from "./ServiceImageSvelte.svelte";

  interface Pricing {
    type: "project" | "hourly" | "monthly";
    basePrice: number;
    unit: string;
    hourlyRate?: number;
    estimatedHours?: string;
    minimumHours?: number;
    note?: string;
  }

  interface Service {
    id: string;
    code?: string;
    unspsc?: string;
    title: string;
    shortDescription: string;
    description: string;
    benefits: string[];
    forWhom: string;
    icon: string;
    category: string;
    featured?: boolean;
    pricing?: Pricing;
  }

  interface Category {
    title: string;
    description: string;
  }

  interface Props {
    services: Service[];
    categories: Record<string, Category>;
    initialCount?: number;
  }

  let { services, categories, initialCount = 4 }: Props = $props();

  // Estado: cuántos servicios mostrar
  let visibleCount = $state(initialCount);
  let showAll = $state(false);
  let loadMoreRef: HTMLDivElement | null = $state(null);

  // Función para formatear precios en COP
  function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  // Colores por categoría (basados en los 4 colores del logo)
  // Logo: Navy #262262, Blue #1C75BC, Red #B52733, Orange #E68E27
  const categoryColors: Record<
    string,
    { bg: string; text: string; badge: string; border: string; hex: string }
  > = {
    security: {
      // Azul (Blue) #1C75BC
      hex: "#1C75BC",
      bg: "bg-[#1C75BC]/10 dark:bg-[#1C75BC]/20",
      text: "text-[#1C75BC] dark:text-[#4A9FD9]",
      badge:
        "bg-[#1C75BC]/10 dark:bg-[#1C75BC]/30 text-[#1C75BC] dark:text-[#4A9FD9]",
      border: "border-[#1C75BC]/20 dark:border-[#1C75BC]/30",
    },
    infrastructure: {
      // Azul oscuro (Navy) #262262
      hex: "#262262",
      bg: "bg-[#262262]/10 dark:bg-[#262262]/30",
      text: "text-[#262262] dark:text-[#6B68B8]",
      badge:
        "bg-[#262262]/10 dark:bg-[#262262]/40 text-[#262262] dark:text-[#8B88D0]",
      border: "border-[#262262]/20 dark:border-[#262262]/30",
    },
    development: {
      // Naranja (Orange) #E68E27
      hex: "#E68E27",
      bg: "bg-[#E68E27]/10 dark:bg-[#E68E27]/20",
      text: "text-[#E68E27] dark:text-[#F5A84D]",
      badge:
        "bg-[#E68E27]/10 dark:bg-[#E68E27]/30 text-[#E68E27] dark:text-[#F5A84D]",
      border: "border-[#E68E27]/20 dark:border-[#E68E27]/30",
    },
    consulting: {
      // Rojo (Red) #B52733
      hex: "#B52733",
      bg: "bg-[#B52733]/10 dark:bg-[#B52733]/20",
      text: "text-[#B52733] dark:text-[#E05A66]",
      badge:
        "bg-[#B52733]/10 dark:bg-[#B52733]/30 text-[#B52733] dark:text-[#E05A66]",
      border: "border-[#B52733]/20 dark:border-[#B52733]/30",
    },
  };

  // Helper para obtener colores
  function getColors(category: string) {
    return categoryColors[category] || categoryColors.security;
  }

  // Iconos SVG
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
  };

  // Agrupar servicios por categoría
  const servicesByCategory = $derived.by(() => {
    const grouped: Record<string, Service[]> = {};
    for (const service of services) {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    }
    return grouped;
  });

  // Servicios destacados para mostrar inicialmente
  const featuredServices = $derived(
    services.filter((s) => s.featured).slice(0, initialCount)
  );

  // Servicios visibles (featured + resto según scroll)
  const visibleServices = $derived(showAll ? services : featuredServices);

  // Conteo restante
  const remainingCount = $derived(services.length - featuredServices.length);

  function loadAll() {
    showAll = true;
  }

  // Intersection Observer para lazy loading automático
  $effect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }
    if (!loadMoreRef || showAll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          showAll = true;
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef);

    return () => observer.disconnect();
  });
</script>

<div class="services-list">
  <!-- Servicios destacados -->
  <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
    {#each featuredServices as service, index (service.id)}
      <article
        class="service-card bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        style="animation-delay: {index * 100}ms; --border-color: {getColors(
          service.category
        ).hex}"
      >
        <!-- Imagen blob -->
        <ServiceImageSvelte category={service.category} code={service.code || ''} />
        
        <div class="p-6">
          <div class="flex items-start gap-4 mb-4">
            <div class="p-3 {getColors(service.category).bg} rounded-xl shrink-0">
              <svg
                class="w-6 h-6 {getColors(service.category).text}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {@html icons[service.icon] || icons.shield}
              </svg>
            </div>
            <div>
              <span
                class="inline-block px-2 py-0.5 text-xs font-medium {getColors(
                  service.category
                ).badge} rounded-full mb-2"
              >
                {categories[service.category]?.title || service.category}
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                {service.title}
              </h3>
              {#if service.code || service.unspsc}
                <p
                  class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono"
                >
                  {#if service.code}<span class="mr-2">{service.code}</span>{/if}
                  {#if service.unspsc}<span>UNSPSC: {service.unspsc}</span>{/if}
                </p>
              {/if}
            </div>
          </div>

          <p
            class="text-slate-600 dark:text-gray-300 text-sm mb-4 leading-relaxed"
          >
            {service.shortDescription}
          </p>

          <!-- Precio -->
          {#if service.pricing}
            <div class="bg-slate-50 dark:bg-neutral-800 rounded-lg p-3 mb-4">
              <div class="flex items-baseline justify-between">
                <div>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(service.pricing.basePrice)}
                  </span>
                  <span class="text-sm text-slate-500 dark:text-slate-400">
                    / {service.pricing.unit}
                  </span>
                </div>
                {#if service.pricing.hourlyRate}
                  <div class="text-right">
                    <span class="text-xs text-slate-500 dark:text-slate-400">
                      o {formatPrice(service.pricing.hourlyRate)}/hora
                    </span>
                  </div>
                {/if}
              </div>
              {#if service.pricing.note}
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {service.pricing.note}
                </p>
              {/if}
            </div>
          {/if}

        <details class="group">
          <summary
            class="cursor-pointer {getColors(service.category)
              .text} font-medium text-sm hover:underline flex items-center gap-2"
          >
            <span>Ver detalles</span>
            <svg
              class="w-4 h-4 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div
            class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4"
          >
            <p class="text-sm text-slate-600 dark:text-gray-400">
              {service.description}
            </p>

            <div>
              <h4
                class="text-sm font-semibold text-slate-900 dark:text-white mb-2"
              >
                Beneficios:
              </h4>
              <ul class="space-y-1">
                {#each service.benefits as benefit}
                  <li
                    class="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-400"
                  >
                    <svg
                      class="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {benefit}
                  </li>
                {/each}
              </ul>
            </div>

            <div class="bg-slate-50 dark:bg-neutral-800 rounded-lg p-3">
              <h4
                class="text-sm font-semibold text-slate-900 dark:text-white mb-1"
              >
                ¿Para quién es?
              </h4>
              <p class="text-sm text-slate-600 dark:text-gray-400">
                {service.forWhom}
              </p>
            </div>
          </div>
        </details>
        </div>
      </article>
    {/each}
  </div>

  <!-- Botón para cargar más o trigger de Intersection Observer -->
  {#if !showAll && remainingCount > 0}
    <div bind:this={loadMoreRef} class="text-center py-8">
      <button
        onclick={loadAll}
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
      >
        <span>Ver todos los servicios</span>
        <span class="bg-blue-500 px-2 py-0.5 rounded-full text-sm"
          >+{remainingCount}</span
        >
      </button>
    </div>
  {/if}

  <!-- Servicios adicionales (lazy loaded) -->
  {#if showAll}
    {#each Object.entries(servicesByCategory) as [categoryKey, categoryServices]}
      <section class="mb-16">
        <div class="mb-8">
          <span
            class="inline-block px-3 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full mb-3"
          >
            {categories[categoryKey]?.title || categoryKey}
          </span>
          <h2
            class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
          >
            {categories[categoryKey]?.title || categoryKey}
          </h2>
          <p class="text-slate-600 dark:text-gray-400 mt-2">
            {categories[categoryKey]?.description || ""}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each categoryServices as service, index (service.id)}
            <article
              class="service-card bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-md border-l-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
              style="animation-delay: {index *
                50}ms; border-left-color: {getColors(service.category).hex}"
            >
              <div class="flex items-start gap-3 mb-3">
                <div
                  class="p-2 {getColors(service.category)
                    .bg} rounded-lg shrink-0"
                >
                  <svg
                    class="w-5 h-5 {getColors(service.category).text}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {@html icons[service.icon] || icons.shield}
                  </svg>
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h3>
                {#if service.code || service.unspsc}
                  <p
                    class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono"
                  >
                    {#if service.code}<span class="mr-2">{service.code}</span
                      >{/if}
                    {#if service.unspsc}<span>UNSPSC: {service.unspsc}</span
                      >{/if}
                  </p>
                {/if}
              </div>

              <p
                class="text-slate-600 dark:text-gray-300 text-sm mb-3 leading-relaxed"
              >
                {service.shortDescription}
              </p>

              <!-- Precio -->
              {#if service.pricing}
                <div
                  class="bg-slate-50 dark:bg-neutral-800 rounded-lg p-2 mb-3"
                >
                  <div class="flex items-baseline justify-between">
                    <div>
                      <span
                        class="text-base font-bold text-slate-900 dark:text-white"
                      >
                        {formatPrice(service.pricing.basePrice)}
                      </span>
                      <span class="text-xs text-slate-500 dark:text-slate-400">
                        / {service.pricing.unit}
                      </span>
                    </div>
                  </div>
                  {#if service.pricing.note}
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {service.pricing.note}
                    </p>
                  {/if}
                </div>
              {/if}

              <details class="group">
                <summary
                  class="cursor-pointer {getColors(service.category)
                    .text} font-medium text-sm hover:underline flex items-center gap-2"
                >
                  <span>Más información</span>
                  <svg
                    class="w-4 h-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <div
                  class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <p class="text-sm text-slate-600 dark:text-gray-400">
                    {service.description}
                  </p>

                  <ul class="space-y-1">
                    {#each service.benefits.slice(0, 3) as benefit}
                      <li
                        class="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-400"
                      >
                        <svg
                          class="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {benefit}
                      </li>
                    {/each}
                  </ul>
                </div>
              </details>
            </article>
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</div>

<style>
  .service-card {
    opacity: 0;
    animation: fadeInUp 0.4s ease-out forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
