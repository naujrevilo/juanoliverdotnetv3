<script lang="ts">
  /**
   * @fileoverview Lista de proyectos con filtrado por categoría y tecnología.
   */
  import type { ProjectCategory, ProjectStatus } from "../types/project";
  import { CategoryLabels } from "../types/project";

  type ProjectItem = {
    slug: string;
    data: {
      title: string;
      description: string;
      technologies: string[];
      category: ProjectCategory;
      status?: ProjectStatus;
      image?: string;
    };
  };

  interface Props {
    projects: ProjectItem[];
  }

  let { projects }: Props = $props();

  // Estado de filtros
  let selectedCategory = $state<string>("all");
  let selectedTech = $state<string>("all");

  // Extraer categorías únicas
  const categories = $derived.by(() => {
    const cats = new Set(projects.map((p) => p.data.category));
    return Array.from(cats).sort();
  });

  // Extraer tecnologías únicas
  const technologies = $derived.by(() => {
    const techs = new Set<string>();
    projects.forEach((p) => p.data.technologies.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  });

  // Proyectos filtrados
  const filteredProjects = $derived.by(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" ||
        project.data.category === selectedCategory;
      const matchesTech =
        selectedTech === "all" ||
        project.data.technologies.includes(selectedTech);
      return matchesCategory && matchesTech;
    });
  });

  // Colores por categoría (basados en los colores de seguridad del sitio)
  const categoryColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    "herramienta-escritorio": {
      bg: "bg-security-blue/10 dark:bg-security-blue/20",
      text: "text-security-blue dark:text-security-blue-light",
      border: "border-security-blue/30",
    },
    "sitio-web": {
      bg: "bg-security-green/10 dark:bg-security-green/20",
      text: "text-security-green dark:text-security-green-light",
      border: "border-security-green/30",
    },
    "cms-blog": {
      bg: "bg-security-purple/10 dark:bg-security-purple/20",
      text: "text-security-purple dark:text-security-purple-light",
      border: "border-security-purple/30",
    },
    api: {
      bg: "bg-security-orange/10 dark:bg-security-orange/20",
      text: "text-security-orange dark:text-security-orange-light",
      border: "border-security-orange/30",
    },
    utilidad: {
      bg: "bg-security-red/10 dark:bg-security-red/20",
      text: "text-security-red dark:text-security-red-light",
      border: "border-security-red/30",
    },
  };

  function getCategoryColor(category: string) {
    return categoryColors[category] || categoryColors["sitio-web"];
  }
</script>

<!-- Filtros -->
<div class="mb-12 space-y-6">
  <!-- Filtro de categorías -->
  <div class="space-y-3">
    <h3
      class="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
    >
      Filtrar por categoría
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        onclick={() => (selectedCategory = "all")}
        class={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          selectedCategory === "all"
            ? "bg-security-blue text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Todos
      </button>
      {#each categories as category}
        {@const colors = getCategoryColor(category)}
        <button
          onclick={() => (selectedCategory = category)}
          class={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedCategory === category
              ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-md`
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {CategoryLabels[category] || category}
        </button>
      {/each}
    </div>
  </div>

  <!-- Filtro de tecnologías -->
  <div class="space-y-3">
    <h3
      class="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
    >
      Filtrar por tecnología
    </h3>
    <div class="flex flex-wrap gap-2">
      <button
        onclick={() => (selectedTech = "all")}
        class={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          selectedTech === "all"
            ? "bg-security-green text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Todas
      </button>
      {#each technologies as tech}
        <button
          onclick={() => (selectedTech = tech)}
          class={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedTech === tech
              ? "bg-security-green text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {tech}
        </button>
      {/each}
    </div>
  </div>

  <!-- Indicador de resultados -->
  <div
    class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
  >
    <p class="text-sm text-gray-600 dark:text-gray-400">
      {#if selectedCategory !== "all" || selectedTech !== "all"}
        Mostrando <span
          class="font-semibold text-security-blue dark:text-security-blue-light"
          >{filteredProjects.length}</span
        >
        {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
        {#if selectedCategory !== "all"}
          en <span class="font-semibold"
            >{CategoryLabels[selectedCategory] || selectedCategory}</span
          >
        {/if}
        {#if selectedTech !== "all"}
          usando <span class="font-semibold">{selectedTech}</span>
        {/if}
      {:else}
        Mostrando todos los <span
          class="font-semibold text-security-blue dark:text-security-blue-light"
          >{filteredProjects.length}</span
        > proyectos
      {/if}
    </p>
  </div>
</div>

<!-- Grid de proyectos -->
{#if filteredProjects.length > 0}
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each filteredProjects as project, index}
      {@const colors = getCategoryColor(project.data.category)}
      <div>
        <a
          href={`/proyectos/${project.slug}`}
          class="group block h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Imagen o gradiente -->
          {#if project.data.image}
            <div class="mb-4 overflow-hidden rounded-lg">
              <img
                src={project.data.image}
                alt={project.data.title}
                class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          {:else}
            <div
              class={`mb-4 flex h-48 items-center justify-center rounded-lg ${colors.bg} transition-all duration-300 group-hover:shadow-inner`}
            >
              <span
                class={`text-6xl font-bold ${colors.text} opacity-20 transition-opacity duration-300 group-hover:opacity-30`}
              >
                {project.data.title.charAt(0)}
              </span>
            </div>
          {/if}

          <!-- Badge de categoría -->
          <div class="mb-3">
            <span
              class={`inline-block rounded-full ${colors.bg} ${colors.text} px-3 py-1 text-xs font-semibold uppercase tracking-wider`}
            >
              {CategoryLabels[project.data.category] || project.data.category}
            </span>
          </div>

          <!-- Título -->
          <h3
            class="mb-2 text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-security-blue dark:text-white dark:group-hover:text-security-blue-light"
          >
            {project.data.title}
          </h3>

          <!-- Descripción -->
          <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {project.data.description}
          </p>

          <!-- Tecnologías -->
          <div class="mt-auto flex flex-wrap gap-2">
            {#each project.data.technologies.slice(0, 4) as tech}
              <span
                class="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            {/each}
            {#if project.data.technologies.length > 4}
              <span
                class="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              >
                +{project.data.technologies.length - 4}
              </span>
            {/if}
          </div>
        </a>
      </div>
    {/each}
  </div>
{:else}
  <!-- Sin resultados -->
  <div
    class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-800/50"
  >
    <svg
      class="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
      No se encontraron proyectos
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Intenta ajustar los filtros para ver más resultados
    </p>
    <button
      onclick={() => {
        selectedCategory = "all";
        selectedTech = "all";
      }}
      class="mt-6 rounded-lg bg-security-blue px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-security-blue/90"
    >
      Limpiar filtros
    </button>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
