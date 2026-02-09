/**
 * @fileoverview Script para crear los servicios de Juan Oliver en Alegra.
 * Ejecutar con: npx tsx src/scripts/seed-alegra-services.ts
 *
 * @module scripts/seed-alegra-services
 */

import "dotenv/config";

// Verificar credenciales antes de importar el servicio
const email = process.env.ALEGRA_EMAIL;
const token = process.env.ALEGRA_TOKEN;

if (!email || !token) {
  console.error("❌ Error: Configura ALEGRA_EMAIL y ALEGRA_TOKEN en el archivo .env");
  console.log("\nEjemplo:");
  console.log("ALEGRA_EMAIL=joliver@alegra.com");
  console.log("ALEGRA_TOKEN=1f8261b0856ab8ede28c");
  process.exit(1);
}

/**
 * Servicios de ciberseguridad de Juan Oliver
 * Usando los slugs como referencia/código
 */
const SERVICES = [
  // ===== SEGURIDAD & CIBERSEGURIDAD =====
  {
    name: "Seguridad de Computadores, Redes e Internet",
    description:
      "Evaluación de vulnerabilidades, diseño de arquitecturas seguras, implementación de firewalls y sistemas de detección, gestión de accesos e identidades, encriptación de datos y capacitación en seguridad.",
    price: 4688000,
    reference: "seguridad-redes-internet",
  },
  {
    name: "Análisis de Riesgo",
    description:
      "Análisis de vulnerabilidades técnicas, evaluación de amenazas internas y externas, estimación de impacto potencial, calificación de riesgos por severidad, e identificación de medidas de mitigación.",
    price: 3334000,
    reference: "analisis-riesgo",
  },
  {
    name: "Mantenimiento de Software de Protección",
    description:
      "Actualización de definiciones de malware, parches de seguridad, firmas de ataque, auditoría de configuraciones, reportes de incidentes y mejora continua de reglas de protección.",
    price: 1875800,
    reference: "mantenimiento-software-proteccion",
  },
  {
    name: "Recuperación de Desastres (DRP/BCP)",
    description:
      "Análisis de riesgos, diseño de planes de recuperación, replicación de datos en sitios alternos, pruebas periódicas de recuperación, documentación de procedimientos y capacitación de personal.",
    price: 8854200,
    reference: "recuperacion-desastres-drp",
  },
  {
    name: "Redes Privadas Virtuales (VPN)",
    description:
      "Configuración de túneles VPN, encriptación de tráfico, autenticación de usuarios remotos, monitoreo de conexiones y garantía de disponibilidad.",
    price: 2292400,
    reference: "vpn-empresarial",
  },
  {
    name: "Auditoría de Seguridad",
    description:
      "Auditoría de seguridad informática, evaluación de cumplimiento de estándares (ISO 27001, HIPAA, GDPR, PCI-DSS), revisión de controles de acceso, evaluación de gobernanza de TI y reportes de hallazgos.",
    price: 5729600,
    reference: "auditoria-seguridad",
  },

  // ===== INFRAESTRUCTURA & REDES =====
  {
    name: "Arquitectura de Sistemas",
    description:
      "Definición de estructura global, garantía de interoperabilidad de componentes, establecimiento de estándares técnicos, implementación de seguridad a nivel de sistema y escalabilidad planificada.",
    price: 7812700,
    reference: "arquitectura-sistemas",
  },
  {
    name: "Diseño de Redes LAN",
    description:
      "Planificación de topología de red, especificación de tecnologías (cableado estructurado, equipos), dimensionamiento de ancho de banda, diseño de seguridad perimetral e implementación de redundancia.",
    price: 3958900,
    reference: "diseno-redes-lan",
  },
  {
    name: "Servicios de Centros de Datos",
    description:
      "Ubicaciones con certificación Tier III/IV, suministro de energía redundante (UPS, generadores), enfriamiento preciso, conexiones de red múltiples, seguridad física y monitoreo 24/7.",
    price: 12499700,
    reference: "servicios-datacenter",
  },
  {
    name: "Almacenamiento de Datos",
    description:
      "Provisionamiento de capacidad de almacenamiento, implementación de redundancia RAID, backup automático, replicación geográfica y optimización de costos por niveles de almacenamiento.",
    price: 2917400,
    reference: "almacenamiento-datos",
  },

  // ===== DESARROLLO & SOFTWARE =====
  {
    name: "Ingeniería de Software",
    description:
      "Análisis de requisitos técnicos, propuesta de arquitecturas escalables, supervisión de integración de componentes, y garantía de cumplimiento de estándares de calidad, rendimiento y seguridad.",
    price: 6771100,
    reference: "ingenieria-software",
  },
  {
    name: "Integración de Sistemas",
    description:
      "Análisis de infraestructura, identificación de incompatibilidades, diseño de soluciones de interconexión y automatización de flujo de datos entre plataformas diferentes.",
    price: 4375500,
    reference: "integracion-sistemas",
  },
  {
    name: "Diseño de Bases de Datos",
    description:
      "Análisis de requisitos de datos, definición de modelos relacionales o NoSQL, optimización de índices y consultas, implementación de seguridad de datos y escalabilidad sin rediseño.",
    price: 3646400,
    reference: "diseno-bases-datos",
  },
  {
    name: "Diseño de Sitios Web",
    description:
      "Diseño visual atractivo, arquitectura de información clara, desarrollo responsivo, optimización SEO, integración de funcionalidades interactivas e implementación de seguridad web.",
    price: 5000500,
    reference: "diseno-sitios-web",
  },

  // ===== CONSULTORÍA & SOPORTE =====
  {
    name: "Planificación de Sistemas",
    description:
      "Análisis de requisitos futuros, evaluación de tecnologías disponibles, definición de roadmaps tecnológicos, planificación de capacidades, estimación de costos y alineación con estrategia comercial.",
    price: 5417100,
    reference: "planificacion-sistemas",
  },
  {
    name: "Soporte Técnico y Mesa de Ayuda",
    description:
      "Soporte a través de múltiples canales (teléfono, email, chat), diagnóstico remoto de problemas, resolución de incidentes y seguimiento hasta resolución completa.",
    price: 1563300,
    reference: "soporte-tecnico-helpdesk",
  },
  {
    name: "Documentación Técnica",
    description:
      "Creación de documentos técnicos complejos, especificaciones de software, análisis técnicos, manuales de usuario y guías de procedimiento.",
    price: 2604900,
    reference: "documentacion-tecnica",
  },
];

// URL de Alegra - Sandbox: https://sandbox.alegra.com:26967/api/v1
// Producción: https://api.alegra.com/api/v1
const ALEGRA_API_URL = process.env.ALEGRA_API_URL || "https://api.alegra.com/api/v1";

function getAlegraAuth(): string {
  const credentials = `${email}:${token}`;
  return Buffer.from(credentials).toString("base64");
}

async function findItemByReference(reference: string): Promise<{ id: number } | null> {
  try {
    const response = await fetch(
      `${ALEGRA_API_URL}/items?reference=${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${getAlegraAuth()}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const items = await response.json();
    if (Array.isArray(items) && items.length > 0) {
      const found = items.find((item: { reference?: string }) => item.reference === reference);
      return found ? { id: found.id } : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function createOrUpdateItem(service: typeof SERVICES[0]): Promise<{
  success: boolean;
  action: "created" | "updated" | "skipped";
  id?: number;
  error?: string;
}> {
  // Buscar si ya existe
  const existing = await findItemByReference(service.reference);

  const itemData = {
    name: service.name,
    description: service.description,
    reference: service.reference,
    type: "service",
    price: [
      {
        idPriceList: 1, // Lista de precios "General"
        price: service.price,
      },
    ],
  };

  try {
    if (existing) {
      // Actualizar
      const response = await fetch(`${ALEGRA_API_URL}/items/${existing.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Basic ${getAlegraAuth()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          action: "skipped",
          error: errorData.message || `Error ${response.status}`,
        };
      }

      return { success: true, action: "updated", id: existing.id };
    } else {
      // Crear nuevo
      const response = await fetch(`${ALEGRA_API_URL}/items`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${getAlegraAuth()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          action: "skipped",
          error: errorData.message || `Error ${response.status}`,
        };
      }

      const data = await response.json();
      return { success: true, action: "created", id: data.id };
    }
  } catch (error) {
    return {
      success: false,
      action: "skipped",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

async function main() {
  console.log("🚀 Iniciando creación de servicios en Alegra...\n");
  console.log(`📧 Cuenta: ${email}`);
  console.log(`📦 Servicios a procesar: ${SERVICES.length}\n`);

  // Verificar conexión
  console.log("🔗 Verificando conexión con Alegra...");
  try {
    const testResponse = await fetch(`${ALEGRA_API_URL}/company`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${getAlegraAuth()}`,
        "Content-Type": "application/json",
      },
    });

    if (!testResponse.ok) {
      console.error("❌ Error de autenticación. Verifica tus credenciales.");
      const errorData = await testResponse.json().catch(() => ({}));
      console.error("Detalle:", errorData.message || testResponse.statusText);
      process.exit(1);
    }

    const company = await testResponse.json();
    console.log(`✅ Conectado a: ${company.name || "Alegra"}\n`);
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }

  // Procesar servicios
  const results = {
    created: 0,
    updated: 0,
    failed: 0,
  };

  for (const service of SERVICES) {
    process.stdout.write(`  → ${service.name.substring(0, 40).padEnd(40)} `);

    const result = await createOrUpdateItem(service);

    if (result.success) {
      if (result.action === "created") {
        console.log(`✅ Creado (ID: ${result.id})`);
        results.created++;
      } else {
        console.log(`🔄 Actualizado (ID: ${result.id})`);
        results.updated++;
      }
    } else {
      console.log(`❌ Error: ${result.error}`);
      results.failed++;
    }

    // Pequeña pausa para no saturar la API (60 req/min limit)
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Resumen
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN");
  console.log("=".repeat(50));
  console.log(`  ✅ Creados:     ${results.created}`);
  console.log(`  🔄 Actualizados: ${results.updated}`);
  console.log(`  ❌ Fallidos:    ${results.failed}`);
  console.log("=".repeat(50));

  if (results.failed === 0) {
    console.log("\n🎉 ¡Todos los servicios fueron procesados exitosamente!");
  } else {
    console.log("\n⚠️  Algunos servicios fallaron. Revisa los errores arriba.");
  }
}

main().catch(console.error);
