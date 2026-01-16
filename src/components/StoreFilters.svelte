<script lang="ts">
  interface Props {
    search: string;
    category: string;
  }

  let { search = "", category = "" }: Props = $props();

  let searchQuery = $state(search);
  let selectedCategory = $state(category);
  let isSubmitting = $state(false);

  function handleSubmit() {
    // Mostrar indicador de carga
    isSubmitting = true;
    // El formulario se envía nativamente (GET request)
  }
</script>

<form
  action="/tienda"
  method="GET"
  class="glass-card p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl relative"
  onsubmit={handleSubmit}
>
  <!-- Loading Overlay -->
  {#if isSubmitting}
    <div
      class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-2xl flex items-center justify-center z-10"
    >
      <div
        class="flex items-center gap-3 text-security-blue dark:text-blue-400"
      >
        <svg
          class="animate-spin h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
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
        <span class="font-bold">Cargando...</span>
      </div>
    </div>
  {/if}

  <div class="flex flex-col md:flex-row gap-5">
    <div class="grow">
      <label
        for="search"
        class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide"
        >Buscar Producto</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-security-blue dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          bind:value={searchQuery}
          class="block w-full pl-12 pr-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-security-blue focus:border-security-blue transition-all sm:text-sm"
          placeholder="Buscar por nombre, modelo, marca..."
        />
      </div>
    </div>

    <div class="w-full md:w-56">
      <label
        for="category"
        class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide"
        >Categoría</label
      >
      <div class="relative">
        <select
          id="category"
          name="category"
          class="block w-full pl-4 pr-10 py-3 text-base border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-security-blue focus:border-security-blue sm:text-sm rounded-xl transition-all cursor-pointer appearance-none"
          bind:value={selectedCategory}
        >
          <option value="">Todas las categorías</option>
          <option value="Servicios">🛡️ Servicios Profesionales</option>
          <option value="Videovigilancia">📹 Videovigilancia</option>
          <option value="Redes">🌐 Redes</option>
          <option value="Control de Acceso">🔐 Control de Acceso</option>
          <option value="Energía">⚡ Energía</option>
          <option value="Automatización e Intrusión"
            >🏠 Automatización e Intrusión</option
          >
        </select>
        <!-- Dropdown Arrow Icon -->
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-slate-500 dark:text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex items-end">
      <button
        type="submit"
        class="w-full md:w-auto px-8 py-3 border-2 border-transparent text-base font-bold rounded-xl text-white bg-linear-to-r from-security-blue to-blue-600 dark:from-blue-500 dark:to-blue-600 hover:from-security-blue/90 hover:to-blue-700 dark:hover:from-blue-400 dark:hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-security-blue dark:focus:ring-blue-400 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        <svg
          class="inline-block w-5 h-5 mr-2 -mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filtrar
      </button>
    </div>
  </div>
</form>
