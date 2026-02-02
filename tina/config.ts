import { defineConfig, LocalAuthProvider } from "tinacms";
import { TinaUserCollection } from "tinacms-authjs/dist/tinacms";

// Custom Clerk Auth Provider
class ClerkAuthProvider {
  clerk: any = null;

  async initialize() {
    if (this.clerk) return;

    // Check if Clerk is already loaded (e.g. from index.html)
    if ((window as any).Clerk) {
      this.clerk = (window as any).Clerk;
      if (!this.clerk.isReady()) {
        await this.clerk.load({
          publishableKey:
            process.env.PUBLIC_CLERK_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
            process.env.TINA_PUBLIC_CLERK_PUBLISHABLE_KEY,
        });
      }
      return;
    }

    // Load ClerkJS from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    await new Promise((resolve) => {
      script.onload = resolve;
    });

    if (!(window as any).Clerk) {
      throw new Error("Failed to load ClerkJS");
    }

    this.clerk = (window as any).Clerk;
    await this.clerk.load({
      publishableKey:
        process.env.PUBLIC_CLERK_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
        process.env.TINA_PUBLIC_CLERK_PUBLISHABLE_KEY,
    });
  }

  async isAuthorized() {
    await this.initialize();
    if (!this.clerk.user) return false;

    // Check for admin role in public metadata
    return this.clerk.user.publicMetadata?.role === "admin";
  }

  async authorize(context?: any) {
    await this.initialize();
    const token = await this.clerk.session?.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async login() {
    await this.initialize();
    await this.clerk.openSignIn();
  }

  async logout() {
    await this.initialize();
    await this.clerk.signOut();
  }

  async getUser() {
    await this.initialize();
    return this.clerk.user;
  }
}

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  branch,
  authProvider: isLocal ? new LocalAuthProvider() : new ClerkAuthProvider(),
  contentApiUrlOverride: "/.netlify/functions/tina",

  // Get this from tina.io
  clientId: null,
  // Get this from tina.io
  token: null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        ...TinaUserCollection,
        path: "src/content/users",
      },
      {
        name: "blog",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "mdx",
        ui: {
          filename: {
            // if disabled, the editor can not create new files
            readonly: false,
            // Example: "my-topic" => "my-topic"
            slugify: (values) => {
              return `${values.title?.toLowerCase().replace(/ /g, "-")}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "categories",
            label: "Categories",
            list: true,
            options: [
              "ciberseguridad",
              "pentesting",
              "automatización",
              "tutoriales",
              "hobbies",
              "informática",
              "seguridad",
            ],
            required: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image",
          },
          {
            type: "image",
            name: "socialImage",
            label: "Social Image",
          },
          {
            type: "boolean",
            name: "showToc",
            label: "Show Table of Contents",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "docs",
        label: "Documentation",
        path: "src/content/docs",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "categories",
            label: "Categories",
            list: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
