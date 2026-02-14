/**
 * @fileoverview Endpoint de API para procesar solicitudes del carrito.
 * Implementa sistema A/B testing:
 * - Variante A: Notificación manual (email/WhatsApp a admin)
 * - Variante B: Cotización automática vía Alegra API
 *
 * @module pages/api/cart
 */

import type { APIRoute } from "astro";
import { rateLimit, createRateLimitResponse } from "../../lib/rate-limit";
import {
  createAlegraEstimate,
  createAlegraContact,
  findAlegraContactByEmail,
  findAlegraItemByReference,
  formatAlegraDate,
  calculateDueDate,
  type AlegraEstimateItem,
} from "../../services/alegra";
import type { CartItem, CustomerData, ABVariant } from "../../stores/cart";

/**
 * Payload esperado del cliente
 */
interface CartPayload {
  items: CartItem[];
  customer: CustomerData;
  variant: ABVariant;
  total: number;
}

/**
 * Respuesta del endpoint
 */
interface CartResponse {
  success: boolean;
  message: string;
  quoteId?: string;
  variant: ABVariant;
}

/**
 * Genera el contenido del email de notificación (Variante A)
 */
function generateEmailContent(payload: CartPayload): string {
  const { items, customer, total } = payload;

  const productList = items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} = $${(
          item.price * item.quantity
        ).toLocaleString("es-CO")}`,
    )
    .join("\n");

  return `
Nueva Solicitud de Cotización
==============================

Datos del Cliente:
- Nombre: ${customer.name}
- Email: ${customer.email}
- Teléfono: ${customer.phone}
${customer.company ? `- Empresa: ${customer.company}` : ""}

Productos Solicitados:
${productList}

Total Estimado: $${total.toLocaleString("es-CO")} COP

${customer.message ? `Mensaje del cliente:\n${customer.message}` : ""}

---
Solicitud generada desde juanoliver.net
Variante A/B: A (Manual)
Fecha: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
  `.trim();
}

/**
 * Envía notificación por email usando un servicio externo.
 * Por ahora solo logea, pero se puede integrar con:
 * - Resend, SendGrid, Mailgun, etc.
 */
async function sendEmailNotification(payload: CartPayload): Promise<boolean> {
  const emailContent = generateEmailContent(payload);

  // Log para debug (en producción integrar con servicio de email)
  console.log("[Variante A] Nueva solicitud de cotización:");
  console.log(emailContent);

  // TODO: Integrar con servicio de email real (Resend, SendGrid, etc.)
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@juanoliver.net',
  //   to: 'joliver@juanoliver.net',
  //   subject: `Nueva Cotización - ${payload.customer.name}`,
  //   text: emailContent,
  // });

  return true;
}

/**
 * Procesa cotización automática con Alegra (Variante B)
 */
async function processAlegraQuote(
  payload: CartPayload,
): Promise<{ success: boolean; quoteId?: string; error?: string }> {
  try {
    const { items, customer, total } = payload;

    // 1. Buscar o crear contacto en Alegra
    let clientId: number;

    const existingContact = await findAlegraContactByEmail(customer.email);

    if (existingContact.success && existingContact.data?.id) {
      clientId = existingContact.data.id;
    } else {
      // Crear nuevo contacto
      const newContact = await createAlegraContact({
        name: customer.name,
        email: customer.email,
        phonePrimary: customer.phone,
        address: customer.company ? { address: customer.company } : undefined,
        type: ["client"],
      });

      if (!newContact.success || !newContact.data?.id) {
        console.error("Error creando contacto en Alegra:", newContact.error);
        // Fallback a variante A
        await sendEmailNotification(payload);
        return {
          success: true,
          quoteId: "FALLBACK-CONTACT-" + Date.now(),
          error: "Contacto creado manualmente",
        };
      }

      clientId = newContact.data.id;
    }

    // 2. Preparar ítems para la cotización
    const estimateItems: AlegraEstimateItem[] = [];

    for (const item of items) {
      // Determinar referencia del producto
      let reference: string;

      if (item.source === "local") {
        // Servicios propios: usar el slug como referencia
        reference = String(item.id);
      } else {
        // Productos externos (Syscom): SYSCOM-{id}
        reference = `SYSCOM-${item.externalProductId || item.id}`;
      }

      // Buscar ítem en Alegra por referencia
      const alegraItem = await findAlegraItemByReference(reference);

      if (alegraItem.success && alegraItem.data?.id) {
        // Ítem existe en Alegra
        estimateItems.push({
          id: alegraItem.data.id,
          price: item.price,
          quantity: item.quantity,
        });
      } else {
        // Ítem no existe, crear en línea
        estimateItems.push({
          name: item.name,
          description:
            `${item.brand || ""} ${item.model || ""} - ${item.category || ""}`.trim(),
          price: item.price,
          quantity: item.quantity,
        });
      }
    }

    // 3. Crear cotización en Alegra
    const observations = customer.message
      ? `Mensaje del cliente: ${customer.message}\n\nGenerado desde juanoliver.net`
      : "Cotización generada automáticamente desde juanoliver.net";

    const estimateResult = await createAlegraEstimate({
      date: formatAlegraDate(),
      dueDate: calculateDueDate(30), // Válida por 30 días
      client: { id: clientId },
      items: estimateItems,
      observations,
      termsConditions:
        "Precios en COP. Válida por 30 días. Sujeta a disponibilidad de inventario.",
    });

    if (!estimateResult.success || !estimateResult.data?.id) {
      console.error(
        "Error creando cotización en Alegra:",
        estimateResult.error,
      );
      // Fallback a variante A
      await sendEmailNotification({
        ...payload,
        customer: {
          ...payload.customer,
          message: `[NOTA: Cotización Alegra falló - ${estimateResult.error}]\n\n${
            customer.message || ""
          }`,
        },
      });
      return {
        success: true,
        quoteId: "FALLBACK-QUOTE-" + Date.now(),
      };
    }

    const quoteId = `ALG-${estimateResult.data.id}`;

    console.log(`[Variante B] Cotización creada en Alegra: ${quoteId}`);
    console.log(`  Cliente: ${customer.name} (${customer.email})`);
    console.log(`  Total: $${total.toLocaleString("es-CO")} COP`);
    console.log(`  Items: ${items.length}`);

    return {
      success: true,
      quoteId,
    };
  } catch (error) {
    console.error("Error en processAlegraQuote:", error);

    // Fallback a variante A
    await sendEmailNotification(payload);
    return {
      success: true,
      quoteId: "FALLBACK-ERROR-" + Date.now(),
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Handler POST - Procesa solicitudes del carrito
 */
export const POST: APIRoute = async ({ request }) => {
  if (rateLimit(request, { maxRequests: 10, windowMs: 60_000 })) {
    return createRateLimitResponse();
  }

  try {
    const payload = (await request.json()) as CartPayload;

    // Validaciones básicas
    if (!payload.items || payload.items.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "El carrito está vacío",
          variant: payload.variant || "A",
        } satisfies CartResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!payload.customer?.email || !payload.customer?.name) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Datos de cliente incompletos",
          variant: payload.variant || "A",
        } satisfies CartResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    let result: { success: boolean; quoteId?: string; error?: string };

    // Procesar según variante A/B
    if (payload.variant === "B") {
      // Variante B: Cotización automática en Alegra
      result = await processAlegraQuote(payload);
    } else {
      // Variante A: Notificación manual
      await sendEmailNotification(payload);
      result = { success: true, quoteId: "MANUAL-" + Date.now() };
    }

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.error || "Error procesando solicitud",
          variant: payload.variant,
        } satisfies CartResponse),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          payload.variant === "B"
            ? "¡Cotización creada! Te enviaremos los detalles por email."
            : "¡Solicitud recibida! Te contactaremos pronto.",
        quoteId: result.quoteId,
        variant: payload.variant,
      } satisfies CartResponse),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error en /api/cart:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error interno del servidor",
        variant: "A",
      } satisfies CartResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

/**
 * Handler GET - Información del endpoint
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      endpoint: "/api/cart",
      methods: ["POST"],
      description: "Procesa solicitudes del carrito con sistema A/B testing",
      variants: {
        A: "Notificación manual por email/WhatsApp",
        B: "Cotización automática vía Alegra API",
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
