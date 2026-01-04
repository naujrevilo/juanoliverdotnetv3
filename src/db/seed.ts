import 'dotenv/config';
import { db } from './client';
import { products, partners } from './schema';

async function main() {
  console.log('Seeding database...');

  try {
    // Seed Products
    console.log('Inserting products...');
    await db.insert(products).values([
      {
        name: 'Licencia Antivirus Empresarial',
        description: 'Protección completa para endpoints con gestión centralizada. Incluye firewall, protección contra ransomware y control de dispositivos.',
        price: 45.99,
        stock: 100,
        category: 'software',
        slug: 'antivirus-empresarial',
        imageUrl: 'https://placehold.co/600x400/005A9C/ffffff?text=Antivirus',
      },
      {
        name: 'Firewall de Próxima Generación',
        description: 'Hardware dedicado para protección perimetral. Inspección profunda de paquetes, VPN integrada y prevención de intrusiones.',
        price: 1299.00,
        stock: 15,
        category: 'hardware',
        slug: 'firewall-ng',
        imageUrl: 'https://placehold.co/600x400/D32F2F/ffffff?text=Firewall',
      },
      {
        name: 'Auditoría de Seguridad Básica',
        description: 'Servicio de análisis de vulnerabilidades y pentesting básico para pequeñas empresas. Informe detallado y recomendaciones.',
        price: 599.00,
        stock: 50,
        category: 'service',
        slug: 'auditoria-basica',
        imageUrl: 'https://placehold.co/600x400/FBC02D/000000?text=Auditoria',
      },
      {
        name: 'YubiKey 5 NFC',
        description: 'Llave de seguridad física para autenticación de dos factores (2FA). Compatible con USB-A y NFC.',
        price: 55.00,
        stock: 200,
        category: 'hardware',
        slug: 'yubikey-5-nfc',
        imageUrl: 'https://placehold.co/600x400/333333/ffffff?text=YubiKey',
      },
    ]).onConflictDoNothing();
    console.log('Products seeded!');

    // Seed Partners
    console.log('Inserting partners...');
    await db.insert(partners).values([
      {
        name: 'Microsoft',
        logoUrl: 'https://placehold.co/200x100/ffffff/000000?text=Microsoft',
        websiteUrl: 'https://microsoft.com',
        description: 'Soluciones Cloud y Seguridad Empresarial',
        category: 'cloud',
      },
      {
        name: 'Kaspersky',
        logoUrl: 'https://placehold.co/200x100/006d55/ffffff?text=Kaspersky',
        websiteUrl: 'https://kaspersky.com',
        description: 'Líder en protección de endpoints',
        category: 'security',
      },
    ]).onConflictDoNothing();
    console.log('Partners seeded!');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main();
