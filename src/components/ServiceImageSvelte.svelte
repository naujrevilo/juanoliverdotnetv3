<script lang="ts">
  interface Props {
    category: string;
    code: string;
  }

  let { category, code } = $props();

  // Mapeo de gradientes por categoría
  const categoryGradients: Record<string, string> = {
    security: "from-blue-500 via-blue-600 to-blue-700",
    infrastructure: "from-slate-600 via-slate-700 to-slate-900",
    development: "from-orange-500 via-orange-600 to-orange-700",
    consulting: "from-red-500 via-red-600 to-red-700",
  };

  const gradient = categoryGradients[category] || categoryGradients.consulting;
  const blobId = `blob-${code}`;
</script>

<div class="relative w-full h-40 overflow-hidden rounded-t-lg bg-gradient-to-br {gradient}">
  <!-- SVG Blob animado -->
  <svg 
    viewBox="0 0 400 300" 
    class="absolute inset-0 w-full h-full"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <style>
        {`
          @keyframes float-${blobId} {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(-25px, -50px) scale(1.05); }
            50% { transform: translate(25px, 20px) scale(0.95); }
            75% { transform: translate(-10px, 40px) scale(1.02); }
          }
          
          .blob-${blobId} {
            animation: float-${blobId} 6s ease-in-out infinite;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
          }
        `}
      </style>
    </defs>
    
    <!-- Blob principal -->
    <path
      class={`blob-${blobId}`}
      d="M320,100Q400,160,360,240Q320,320,200,340Q80,360,40,260Q0,160,40,80Q80,0,200,20Q320,40,320,100Z"
      fill="rgba(255,255,255,0.1)"
      stroke="rgba(255,255,255,0.2)"
      stroke-width="2"
    />
    
    <!-- Blobs secundarios para profundidad -->
    <circle
      cx="100"
      cy="80"
      r="60"
      fill="rgba(255,255,255,0.08)"
    />
    <circle
      cx="320"
      cy="200"
      r="80"
      fill="rgba(255,255,255,0.06)"
    />
  </svg>
  
  <!-- Overlay con gradiente para mejor contraste -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
</div>

<style>
  /* Respeta preferencias de movimiento reducido */
  @media (prefers-reduced-motion: reduce) {
    :global([class*="blob-"]) {
      animation: none !important;
    }
  }
</style>
