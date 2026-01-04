import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import tailwind from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://juanoliver.net",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    starlight({
      title: "Juan Oliver Docs",
      favicon: "/favicon.svg",
      disable404Route: true,
      defaultLocale: "root",
      locales: {
        root: {
          label: "Español",
          lang: "es",
        },
      },
      sidebar: [
        {
          label: "Documentación",
          items: [
            {
              label: "Inicio Docs",
              link: "/docs",
              badge: { text: "Nuevo", variant: "tip" },
            },
            { label: "Guía de Hardening", link: "/docs/hardening" },
            {
              label: "Políticas de Seguridad",
              link: "/docs/politicas-seguridad",
            },
            { label: "Mejores Prácticas", link: "/docs/mejores-practicas" },
            {
              label: "Respuesta a Incidentes",
              link: "/docs/respuesta-incidentes",
            },
          ],
        },
      ],
      // Custom CSS if needed
      customCss: ["./src/styles/global.css"],
      components: {
        Header: "./src/components/docs/StarlightHeader.astro",
      },
    }),
    svelte(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes("/admin/") && !page.includes("/api/"),
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
