/**
 * @endpoint GET /api/services-feed.xml
 * @description Feed XML compatible con Meta Product Catalog (Facebook/WhatsApp Shop).
 *
 * Formato: Google Merchant Center / Meta Product Feed (RSS 2.0 + g: namespace).
 * Excluye servicios con requiresPlatform === true.
 *
 * Referencia:
 * https://developers.facebook.com/docs/commerce-platform/catalog/product-feed
 */

export const prerender = true;

import type { APIRoute } from "astro";
// @ts-ignore – JSON import
import servicesRaw from "../../data/services.json";

interface ServiceItem {
  id: string;
  code?: string;
  title: string;
  shortDescription: string;
  description?: string;
  category: string;
  pricing?: {
    basePrice?: number;
    currency?: string;
  };
  requiresPlatform?: boolean;
  featured?: boolean;
}

interface ServicesJson {
  services: ServiceItem[];
  managedServices?: ServiceItem[];
}

const BASE_URL = "https://juanoliver.net";
const BRAND = "Juan Oliver Ciberseguridad";
const CURRENCY = "COP";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = () => {
  const data = servicesRaw as unknown as ServicesJson;

  const allServices: ServiceItem[] = [
    ...(data.services ?? []),
    ...(data.managedServices ?? []),
  ];

  const feedItems = allServices
    .filter((s) => !s.requiresPlatform)
    .map((service) => {
      const price = service.pricing?.basePrice ?? 0;
      const priceStr =
        price > 0 ? `${price} ${CURRENCY}` : `0 ${CURRENCY}`;
      const link = `${BASE_URL}/servicios#${escapeXml(service.id)}`;
      const title = escapeXml(service.title);
      const description = escapeXml(service.shortDescription);
      const id = escapeXml(service.id);
      const brand = escapeXml(BRAND);
      const imageLink = `${BASE_URL}/icons/og-image.jpg`;

      return `    <item>
      <g:id>${id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:price>${priceStr}</g:price>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:brand>${brand}</g:brand>
      <g:google_product_category>Business &amp; Industrial &gt; Security</g:google_product_category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(BRAND)} — Catálogo de Servicios</title>
    <link>${BASE_URL}/servicios</link>
    <description>Catálogo de servicios de ciberseguridad y TI de Juan Oliver</description>
${feedItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
