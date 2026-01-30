<script lang="ts">
  interface Props {
    category: string;
    icon: string;
  }

  let { category, icon } = $props();

  // Mapeo de gradientes por categoría
  const categoryGradients: Record<string, string> = {
    security: "from-blue-600 to-blue-800",
    infrastructure: "from-slate-700 to-slate-900",
    development: "from-orange-500 to-orange-700",
    consulting: "from-red-600 to-red-800",
  };

  const gradient = categoryGradients[category] || categoryGradients.security;
</script>

<div class="relative w-full h-40 flex items-center justify-center bg-gradient-to-br {gradient}">
  <svg
    class="w-16 h-16 text-white/90 drop-shadow-lg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {@html icon}
  </svg>
</div>
