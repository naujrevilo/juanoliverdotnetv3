/**
 * @fileoverview Seed de base de datos con servicios de ciberseguridad.
 * Precios en COP (Pesos Colombianos) competitivos para el mercado colombiano.
 *
 * @module db/seed
 */

import "dotenv/config";
import { db } from "./client";
import { products, partners } from "./schema";

async function main() {
  console.log("Seeding database...");

  try {
    // Limpiar productos existentes para evitar duplicados
    console.log("Clearing existing products...");
    await db.delete(products);

    // Seed Products - Servicios de Ciberseguridad (Precios en COP)
    console.log("Inserting security services...");
    await db
      .insert(products)
      .values([
        // ===== SEGURIDAD & CIBERSEGURIDAD =====
        {
          name: "Seguridad de Computadores, Redes e Internet",
          description:
            "Evaluación de vulnerabilidades, diseño de arquitecturas seguras, implementación de firewalls y sistemas de detección, gestión de accesos e identidades, encriptación de datos y capacitación en seguridad.",
          price: 4500000, // COP - Servicio integral mensual
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "seguridad-redes-internet",
          imageUrl:
            "https://placehold.co/600x400/005A9C/ffffff?text=Seguridad+Redes",
        },
        {
          name: "Análisis de Riesgo",
          description:
            "Análisis de vulnerabilidades técnicas, evaluación de amenazas internas y externas, estimación de impacto potencial, calificación de riesgos por severidad, e identificación de medidas de mitigación.",
          price: 3200000, // COP - Por evaluación completa
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "analisis-riesgo",
          imageUrl:
            "https://placehold.co/600x400/1565C0/ffffff?text=Análisis+Riesgo",
        },
        {
          name: "Mantenimiento de Software de Protección",
          description:
            "Actualización de definiciones de malware, parches de seguridad, firmas de ataque, auditoría de configuraciones, reportes de incidentes y mejora continua de reglas de protección.",
          price: 1800000, // COP - Mensual
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "mantenimiento-software-proteccion",
          imageUrl:
            "https://placehold.co/600x400/2196F3/ffffff?text=Mantenimiento",
        },
        {
          name: "Recuperación de Desastres (DRP/BCP)",
          description:
            "Análisis de riesgos, diseño de planes de recuperación, replicación de datos en sitios alternos, pruebas periódicas de recuperación, documentación de procedimientos y capacitación de personal.",
          price: 8500000, // COP - Implementación completa
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "recuperacion-desastres-drp",
          imageUrl: "https://placehold.co/600x400/0D47A1/ffffff?text=DRP+BCP",
        },
        {
          name: "Redes Privadas Virtuales (VPN)",
          description:
            "Configuración de túneles VPN, encriptación de tráfico, autenticación de usuarios remotos, monitoreo de conexiones y garantía de disponibilidad.",
          price: 2200000, // COP - Implementación + primer mes
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "vpn-empresarial",
          imageUrl: "https://placehold.co/600x400/1976D2/ffffff?text=VPN",
        },
        {
          name: "Auditoría de Seguridad",
          description:
            "Auditoría de seguridad informática, evaluación de cumplimiento de estándares (ISO 27001, HIPAA, GDPR, PCI-DSS), revisión de controles de acceso, evaluación de gobernanza de TI y reportes de hallazgos.",
          price: 5500000, // COP - Por auditoría completa
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "auditoria-seguridad",
          imageUrl: "https://placehold.co/600x400/283593/ffffff?text=Auditoría",
        },

        // ===== INFRAESTRUCTURA & REDES =====
        {
          name: "Arquitectura de Sistemas",
          description:
            "Definición de estructura global, garantía de interoperabilidad de componentes, establecimiento de estándares técnicos, implementación de seguridad a nivel de sistema y escalabilidad planificada.",
          price: 7500000, // COP - Consultoría de arquitectura
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "arquitectura-sistemas",
          imageUrl:
            "https://placehold.co/600x400/37474F/ffffff?text=Arquitectura",
        },
        {
          name: "Diseño de Redes LAN",
          description:
            "Planificación de topología de red, especificación de tecnologías (cableado estructurado, equipos), dimensionamiento de ancho de banda, diseño de seguridad perimetral e implementación de redundancia.",
          price: 3800000, // COP - Diseño completo
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "diseno-redes-lan",
          imageUrl: "https://placehold.co/600x400/455A64/ffffff?text=Redes+LAN",
        },
        {
          name: "Servicios de Centros de Datos",
          description:
            "Ubicaciones con certificación Tier III/IV, suministro de energía redundante (UPS, generadores), enfriamiento preciso, conexiones de red múltiples, seguridad física y monitoreo 24/7.",
          price: 12000000, // COP - Mensual (colocation)
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "servicios-datacenter",
          imageUrl: "https://placehold.co/600x400/263238/ffffff?text=Datacenter",
        },
        {
          name: "Almacenamiento de Datos",
          description:
            "Provisionamiento de capacidad de almacenamiento, implementación de redundancia RAID, backup automático, replicación geográfica y optimización de costos por niveles de almacenamiento.",
          price: 2800000, // COP - Mensual (según capacidad)
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "almacenamiento-datos",
          imageUrl:
            "https://placehold.co/600x400/546E7A/ffffff?text=Almacenamiento",
        },

        // ===== DESARROLLO & SOFTWARE =====
        {
          name: "Ingeniería de Software",
          description:
            "Análisis de requisitos técnicos, propuesta de arquitecturas escalables, supervisión de integración de componentes, y garantía de cumplimiento de estándares de calidad, rendimiento y seguridad.",
          price: 6500000, // COP - Por módulo/sprint
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "ingenieria-software",
          imageUrl: "https://placehold.co/600x400/00695C/ffffff?text=Ingeniería",
        },
        {
          name: "Integración de Sistemas",
          description:
            "Análisis de infraestructura, identificación de incompatibilidades, diseño de soluciones de interconexión y automatización de flujo de datos entre plataformas diferentes.",
          price: 4200000, // COP - Por integración
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "integracion-sistemas",
          imageUrl:
            "https://placehold.co/600x400/00796B/ffffff?text=Integración",
        },
        {
          name: "Diseño de Bases de Datos",
          description:
            "Análisis de requisitos de datos, definición de modelos relacionales o NoSQL, optimización de índices y consultas, implementación de seguridad de datos y escalabilidad sin rediseño.",
          price: 3500000, // COP - Por proyecto
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "diseno-bases-datos",
          imageUrl:
            "https://placehold.co/600x400/00897B/ffffff?text=Bases+Datos",
        },
        {
          name: "Diseño de Sitios Web",
          description:
            "Diseño visual atractivo, arquitectura de información clara, desarrollo responsivo, optimización SEO, integración de funcionalidades interactivas e implementación de seguridad web.",
          price: 4800000, // COP - Sitio corporativo completo
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "diseno-sitios-web",
          imageUrl: "https://placehold.co/600x400/26A69A/ffffff?text=Sitios+Web",
        },

        // ===== CONSULTORÍA & SOPORTE =====
        {
          name: "Planificación de Sistemas",
          description:
            "Análisis de requisitos futuros, evaluación de tecnologías disponibles, definición de roadmaps tecnológicos, planificación de capacidades, estimación de costos y alineación con estrategia comercial.",
          price: 5200000, // COP - Consultoría estratégica
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "planificacion-sistemas",
          imageUrl:
            "https://placehold.co/600x400/7B1FA2/ffffff?text=Planificación",
        },
        {
          name: "Soporte Técnico y Mesa de Ayuda",
          description:
            "Soporte a través de múltiples canales (teléfono, email, chat), diagnóstico remoto de problemas, resolución de incidentes y seguimiento hasta resolución completa.",
          price: 1500000, // COP - Mensual (paquete básico)
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "soporte-tecnico-helpdesk",
          imageUrl: "https://placehold.co/600x400/8E24AA/ffffff?text=Soporte",
        },
        {
          name: "Documentación Técnica",
          description:
            "Creación de documentos técnicos complejos, especificaciones de software, análisis técnicos, manuales de usuario y guías de procedimiento.",
          price: 2500000, // COP - Por documento/proyecto
          stock: 999,
          brand: "Juan Oliver",
          category: "service",
          slug: "documentacion-tecnica",
          imageUrl:
            "https://placehold.co/600x400/9C27B0/ffffff?text=Documentación",
        },
      ])
      .onConflictDoNothing();
    console.log("Security services seeded!");

    // Seed Partners
    console.log("Clearing existing partners...");
    await db.delete(partners);

    console.log("Inserting partners...");
    await db
      .insert(partners)
      .values([
        {
          name: "Microsoft",
          logoUrl: "https://placehold.co/200x100/ffffff/000000?text=Microsoft",
          websiteUrl: "https://microsoft.com",
          description: "Soluciones Cloud y Seguridad Empresarial",
          category: "cloud",
        },
        {
          name: "Fortinet",
          logoUrl: "https://placehold.co/200x100/DA291C/ffffff?text=Fortinet",
          websiteUrl: "https://fortinet.com",
          description: "Líder en seguridad de redes y firewalls",
          category: "security",
        },
        {
          name: "Cisco",
          logoUrl: "https://placehold.co/200x100/1BA0D8/ffffff?text=Cisco",
          websiteUrl: "https://cisco.com",
          description: "Infraestructura de redes empresariales",
          category: "security",
        },
      ])
      .onConflictDoNothing();
    console.log("Partners seeded!");

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
