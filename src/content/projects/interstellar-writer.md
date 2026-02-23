---
title: "Interstellar Writer"
description: "Editor de escritorio nativo para contenido MDX/Astro con gestión de frontmatter YAML y sincronización con GitHub"
longDescription: "Editor de escritorio multiplataforma construido con Rust y egui para gestionar contenido MDX de proyectos Astro. Ofrece edición visual de frontmatter YAML, vista previa en tiempo real de Markdown, gestión de múltiples colecciones y sincronización directa con GitHub."
publishDate: 2024-01-15
technologies: 
  - Rust
  - egui
  - serde
  - Git
  - YAML
  - Markdown
  - MDX
category: "herramienta-escritorio"
status: "público"
repoUrl: "https://github.com/naujrevilo/interstellar-writer-astro"
image: "/projects/interstellar-writer.svg"
featured: true
---

## Descripción del Proyecto

**Interstellar Writer** es una aplicación de escritorio nativa desarrollada en Rust que facilita la gestión de contenido para proyectos Astro. Su objetivo principal es proporcionar una experiencia de edición similar a un CMS de escritorio, pero enfocada específicamente en archivos MDX con frontmatter YAML.

### Características Principales

- **Gestión de Colecciones**: Organiza contenido en carpetas (blog, docs, proyectos)
- **Editor Visual de Frontmatter**: Campos tipados (texto, fecha, booleano, lista, imagen)
- **Vista Previa en Tiempo Real**: Renderizado Markdown/CommonMark
- **Sincronización con GitHub**: Commit y push directamente desde la aplicación
- **Tema Oscuro/Claro**: Interfaz inspirada en VS Code
- **Dashboard de Publicaciones**: Vista de tarjetas estilo CMS
- **Multi-proyecto**: Soporte para múltiples repositorios Astro
- **Inserción de Componentes**: Helpers para componentes Astro comunes

### Stack Tecnológico

El proyecto utiliza tecnologías de alto rendimiento y multiplataforma:

- **Rust 1.70+**: Lenguaje principal con seguridad de memoria
- **eframe/egui 0.29**: Framework GUI inmediato para aplicaciones nativas
- **serde/serde_yaml**: Serialización y parsing de frontmatter YAML
- **git2 (libgit2)**: Integración nativa con Git para sincronización
- **anyhow**: Manejo idiomático de errores con contexto
- **rfd**: Diálogos nativos de archivos (open/save)
- **egui_commonmark**: Renderizado de v

ista previa Markdown

### Arquitectura

El proyecto sigue una arquitectura modular inspirada en MVC:

```text
src/
├── main.rs           # Punto de entrada y configuración
├── app.rs            # Estado global y ciclo de vida
├── models.rs         # Estructuras de datos
├── services/         # Lógica de negocio
│   ├── content.rs    # Parsing de frontmatter/body
│   ├── files.rs      # Operaciones de archivos
│   └── git.rs        # Sincronización con GitHub
└── ui/               # Componentes visuales
    ├── dashboard.rs  # Vista de tarjetas
    ├── editor.rs     # Editor de texto
    ├── preview.rs    # Vista previa MD
    └── dialogs.rs    # Modales y diálogos
```

### Casos de Uso

- **Bloggers**: Gestión de posts con frontmatter complejo
- **Documentadores**: Organización de documentación técnica
- **Desarrolladores**: Edición rápida de contenido Astro sin CLI
- **Creadores de Contenido**: Vista previa inmediata antes de publicar

### Estructura de Proyecto Esperada

La aplicación funciona con proyectos Astro que sigan esta estructura:

```text
mi-proyecto-astro/
├── src/
│   └── content/              # Directorio de contenido
│       ├── blog/             # Colección "blog"
│       └── docs/             # Colección "docs"
└── public/
    └── images/               # Directorio de assets
```

### Detalles Técnicos

#### Configuración Persistente

La aplicación utiliza `confy` para almacenar configuración multiplataforma:

- Ruta al repositorio actual
- Token de GitHub (opcional)
- Preferencias de tema
- Configuraciones de múltiples proyectos

#### Gestión de Metadatos

Cada colección puede definir campos personalizados con tipos específicos:

- **String**: Texto simple
- **Boolean**: Checkboxes
- **Date**: Selector de fecha
- **Image**: Diálogo de selección de imagen
- **List**: Array de strings
- **Categories**: Etiquetas predefinidas
- **Number**: Campos numéricos

#### Sincronización Git

El módulo `git.rs` ejecuta operaciones nativas de Git:

1. `git add .`
2. `git commit -m "mensaje"`
3. `git push origin main`

Soporta autenticación mediante token personal de GitHub.

### Testing

El proyecto incluye tests unitarios en el módulo `services::content::tests`:

- Parsing de frontmatter (YAML válido, vacío, malformado)
- Serialización (básico, eliminación de nulls)
- Extracción de atributos
- Limpieza de imports
- Reparación de rutas
- Cálculo de rutas relativas

### Instalación

#### Requisitos Previos

- Rust 1.70+ ([rustup.rs](https://rustup.rs/))
- Git instalado y configurado

**Windows**: Visual Studio Build Tools con C++ Desktop Development

**macOS**: Xcode Command Line Tools

**Linux**: Dependencias del sistema (libxcb, libxkbcommon, openssl)

#### Compilación

```bash
# Clonar el repositorio
git clone https://github.com/naujrevilo/interstellar-writer-astro.git
cd interstellar-writer-astro

# Compilar y ejecutar
cargo run

# Compilación optimizada para producción
cargo build --release
```

### Documentación

- [DEVELOPMENT.md](https://github.com/naujrevilo/interstellar-writer-astro/blob/main/DOCS/DEVELOPMENT.md): Arquitectura técnica completa
- [MANUAL_USUARIO.md](https://github.com/naujrevilo/interstellar-writer-astro/blob/main/DOCS/MANUAL_USUARIO.md): Guía de usuario ilustrada
- Diagramas de arquitectura (clases, flujo, módulos, secuencia)

### Estado del Proyecto

✅ **Versión 1.0.5** - Estable y listo para producción

### Licencia

AGPL-3.0

---

**Nota**: Este proyecto demuestra capacidades avanzadas de desarrollo en Rust, incluyendo GUI nativa, manejo de archivos, parsing de formatos complejos e integración con Git.
