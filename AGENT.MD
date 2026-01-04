Contexto y Misión del Agente

Objetivo del Proyecto

El sitio juanoliver.net es la plataforma profesional de Juan Oliver. El sitio debe reflejar autoridad en Seguridad de la Información y Seguridad Informática, además de servir como punto de venta de tecnología y gestión de alianzas.

Perfil de Juan Oliver

Rol Principal: Experto en Seguridad de la Información y Ciberseguridad.

Enfoque: Protección de datos, arquitectura segura, infraestructura resiliente.

Tono de Voz: Seguro, preciso, confiable y educativo.

Estructura del Sitio

Home (/): Portada profesional enfocada en servicios de seguridad y consultoría.

Docs (/docs): Base de conocimientos (Wiki técnica) usando Starlight.

Blog (/blog): Artículos sobre amenazas, análisis forense, hardening, etc.

Socios (/socios): Página para mostrar alianzas estratégicas (Distribuidores de Kaspersky, Microsoft, etc.).

Tienda (/tienda): E-commerce para venta de productos de tecnología (Hardware/Software seguro).

Tech: Requiere conexión a BBDD (Turso) para inventario/precios.

Stack de Datos

Base de Datos: Turso (Edge SQL).

ORM: Drizzle ORM.

Objetivo: Consultas rápidas en el borde para la tienda y gestión de contenidos dinámicos.

Uso de MCP (Herramientas Externas)

Tienes acceso a servidores MCP para potenciar tu desarrollo:

Filesystem & GitHub: Para gestión del repo.

Astro Docs: Para consultar la última documentación de Astro 5.

Microsoft Docs: Para referencias oficiales de Azure y Seguridad Microsoft.

Flujo de Trabajo

Analizar la solicitud bajo la óptica de "Security by Design".

Si es contenido estático -> Starlight/Markdown.

Si es dinámico (Tienda) -> Svelte + Turso + Astro SSR.

Validar siempre las Reglas del Proyecto antes de generar código.
