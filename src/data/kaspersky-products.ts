import type { ImageMetadata } from "astro";

// Importación estática de imágenes para que Astro las optimice
import ksosBlack from "../assets/products/kaspersky/ksos-black.png";
import ksosWhite from "../assets/products/kaspersky/ksos-white.png";
import kEdrBlack from "../assets/products/kaspersky/k_edr_black_icon.svg";
import kEdrWhite from "../assets/products/kaspersky/k_edr_white_icon.svg";
import kEdrFoundationsBlack from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_black_title_g.svg";
import kEdrFoundationsWhite from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_white_title_g.svg";
import kEdrOptimumBlack from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Optimum_black_title_g.svg";
import kEdrOptimumWhite from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Optimum_white_title_g.svg";
import kEdrOptimumIconBlack from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Optimum_black_icon.svg";
import kEdrOptimumIconWhite from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Optimum_white_icon.svg";
import kEdrExpertBlack from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Expert_black_title_g.png";
import kEdrExpertWhite from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Expert_white_title_g.png";
import kEdrExpertIconBlack from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Expert_black_icon.svg";
import kEdrExpertIconWhite from "../assets/products/kaspersky/k_Endpoint_Detection_and_Response_Expert_white_icon.svg";

// Iconos para beneficios
import iconDataProtection from "../assets/products/kaspersky/password-text-personal-data.svg";
import iconThreats from "../assets/products/kaspersky/attack.svg";
import iconVulnerability from "../assets/products/kaspersky/safe-search-magnifyer.svg";
import iconUserControl from "../assets/products/kaspersky/profile-user-personal-locked.svg";
import iconRootCause from "../assets/products/kaspersky/graph-tree-target.svg";
import iconAlerts from "../assets/products/kaspersky/alarm-flasher-aware-signal-1.svg";

export interface FeatureItem {
  name: string;
  included: boolean;
}

export interface FeatureGroup {
  category: string;
  icon?: ImageMetadata;
  features: FeatureItem[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  logoLight: ImageMetadata; // Para fondo oscuro
  logoDark: ImageMetadata; // Para fondo claro
  iconLight?: ImageMetadata; // Icono simple para fondo oscuro
  iconDark?: ImageMetadata; // Icono simple para fondo claro
  features: string[];
  benefits: { title: string; description: string; icon?: ImageMetadata }[];
  platforms: string[];
  groupedFeatures?: FeatureGroup[];
}

export const products: Product[] = [
  {
    id: "small-office-security",
    name: "Kaspersky Small Office Security",
    description:
      "Protección integral diseñada específicamente para pequeñas empresas. Seguridad de nivel corporativo sin complejidad.",
    longDescription:
      "Kaspersky Small Office Security combina la simplicidad de la protección doméstica con funciones especiales para mantener a su empresa segura mientras los empleados trabajan. Con seguridad 'instalar y olvidar', protege sus PC y portátiles con Windows y Mac, así como sus servidores de archivos Windows, para asegurar los archivos que más valora.",
    logoLight: ksosWhite,
    logoDark: ksosBlack,
    features: [
      "Protección contra ransomware y reversión de acciones maliciosas",
      "Cifrado de archivos y copias de seguridad",
      "Pago seguro en línea con 'Safe Money'",
      "Protección para dispositivos móviles Android",
      "Escaneo de vulnerabilidades incorporado",
      "VPN superrápida para privacidad de datos",
    ],
    benefits: [
      {
        title: "Instalar y olvidar",
        description:
          "Fácil de usar, no requiere conocimientos de TI. Funciona de manera eficiente en segundo plano para que pueda concentrarse en su negocio.",
      },
      {
        title: "Protección contra Ransomware",
        description:
          "Incluso si un empleado abre un enlace malicioso, System Watcher detecta y bloquea la actividad, permitiendo revertir los cambios y recuperar datos.",
      },
      {
        title: "Pagos Seguros",
        description:
          "Proteja sus transacciones financieras y bancarias con capas adicionales de seguridad que evitan el robo de credenciales.",
      },
      {
        title: "Protección de Datos Sensibles",
        description:
          "Cifre datos confidenciales y realice copias de seguridad automáticas para evitar fugas de información o pérdida de datos críticos.",
      },
    ],
    platforms: ["Windows", "macOS", "Android", "iOS"],
    groupedFeatures: [
      {
        category: "Protección antivirus",
        features: [
          { name: "Prevención de malware", included: true },
          { name: "Protección contra ransomware", included: true },
          { name: "Reversión automática a estado seguro", included: true },
          { name: "Antivirus para archivos, web y correo", included: true },
          { name: "Firewall bidireccional", included: true },
        ],
      },
      {
        category: "Optimización de tareas",
        features: [
          { name: "Análisis de vulnerabilidades", included: true },
          { name: "Actualizador de software", included: true },
        ],
      },
      {
        category: "Protección de datos",
        features: [
          { name: "Copia de seguridad y restauración", included: true },
          { name: "Cifrado de datos", included: true },
          { name: "Destrucción de archivos (File Shredder)", included: true },
        ],
      },
      {
        category: "Protección en Internet",
        features: [
          { name: "Safe Money (Pago seguro)", included: true },
          { name: "VPN segura y rápida", included: true },
          { name: "Bloqueador de ataques de red", included: true },
          { name: "Navegación privada", included: true },
        ],
      },
      {
        category: "Administración",
        features: [
          { name: "Consola de administración en la nube", included: true },
          { name: "Gestor de contraseñas", included: true },
          { name: "Control web y de aplicaciones", included: true },
        ],
      },
      {
        category: "Funciones avanzadas",
        features: [
          { name: "Soporte para servidores Linux", included: false },
          {
            name: "Gestión de parches avanzada (Patch Management)",
            included: false,
          },
          { name: "EDR (Endpoint Detection and Response)", included: false },
        ],
      },
    ],
  },
  {
    id: "next-edr-foundations",
    name: "Kaspersky Next EDR Foundations",
    description:
      "EPP potentes basadas en ML, controles de seguridad flexibles y herramientas de análisis de causa raíz EDR que le proporcionan la forma más simple de construir una base sólida para su ciberseguridad.",
    longDescription:
      "Protección asequible y simple para que el negocio siga creciendo mientras Kaspersky se encarga de bloquear el ransomware, el malware sin archivos, los ataques de día cero y otras clases de amenazas emergentes.",
    logoLight: kEdrFoundationsWhite,
    logoDark: kEdrFoundationsBlack,
    iconLight: kEdrWhite,
    iconDark: kEdrBlack,
    features: [
      "Protección de endpoints (Windows, Mac, móviles)",
      "Protección contra ransomware",
      "Seguridad de la red",
      "Supervisión en la nube",
      "Optimización de tareas",
      "Funcionalidades de EDR básicas",
    ],
    benefits: [
      {
        title: "Protege sus datos",
        description:
          "con las herramientas antirransomware y antimalware probadas del sector",
        icon: iconDataProtection,
      },
      {
        title: "Evita que las amenazas de malware conocido y desconocido",
        description:
          "infecten los dispositivos con Protección contra amenazas web, de archivos y de correo",
        icon: iconThreats,
      },
      {
        title: "Supervisa las aplicaciones",
        description:
          "en endpoints que necesitan actualizaciones mediante análisis de vulnerabilidades rutinarios",
        icon: iconVulnerability,
      },
      {
        title: "Evita actividades riesgosas de usuarios",
        description:
          "mediante sólidos controles web, de dispositivos y de aplicaciones",
        icon: iconUserControl,
      },
      {
        title: "Detecta y descubre la raíz de ataques avanzados",
        description:
          "en su red y proporciona una ruta visual con exhaustivos análisis de causa raíz",
        icon: iconRootCause,
      },
      {
        title: "Emite alertas sobre actividades sospechosas",
        description:
          "o brechas de seguridad en la red mediante Cloud Discovery y Diagnóstico de vulnerabilidades",
        icon: iconAlerts,
      },
    ],
    platforms: ["Windows", "macOS", "Android", "iOS"],
    groupedFeatures: [
      {
        category: "Protección de endpoints",
        icon: iconThreats,
        features: [
          { name: "Protección contra malware", included: true },
          { name: "Prevención de intrusiones de host", included: true },
          {
            name: "Protección y administración de dispositivos móviles",
            included: true,
          },
          { name: "Control adaptable de anomalías", included: false },
        ],
      },
      {
        category: "Protección contra ransomware",
        icon: iconAlerts,
        features: [
          { name: "Protección contra ransomware", included: true },
          { name: "Reversión automática a estado seguro", included: true },
        ],
      },
      {
        category: "Seguridad de la red",
        icon: iconVulnerability,
        features: [
          { name: "Firewall", included: true },
          { name: "Protección contra amenazas de red", included: true },
        ],
      },
      {
        category: "Supervisión en la nube",
        icon: iconRootCause,
        features: [{ name: "Cloud Discovery", included: true }],
      },
      {
        category: "Seguridad en la nube",
        icon: iconDataProtection,
        features: [
          { name: "Cloud Blocking", included: false },
          { name: "Seguridad de Microsoft Office 365", included: false },
          { name: "Data Discovery", included: false },
        ],
      },
      {
        category: "Optimización de tareas",
        icon: iconUserControl,
        features: [
          { name: "Control web y de dispositivos", included: true },
          { name: "Control de aplicaciones", included: true },
          { name: "Administración de vulnerabilidades", included: true },
          { name: "Administración de parches", included: false },
          { name: "Administración de cifrado", included: false },
        ],
      },
      {
        category: "Funcionalidades de EDR básicas",
        icon: kEdrOptimumIconBlack,
        features: [{ name: "Análisis de causa raíz", included: true }],
      },
      {
        category: "Capacidades de EDR esencial",
        icon: kEdrExpertIconBlack,
        features: [
          { name: "Respuesta con un solo clic", included: false },
          { name: "Respuesta automatizada", included: false },
          { name: "Análisis de IoC", included: false },
        ],
      },
      {
        category: "Capacitaciones en ciberseguridad para personal de IT",
        features: [{ name: "Oferta", included: false }],
      },
    ],
  },
  {
    id: "next-edr-optimum",
    name: "Kaspersky Next EDR Optimum",
    description:
      "Una sólida EPP, controles mejorados, administración de parches, capacitación para personal de TI y mucho más, todo ello potenciado por una funcionalidad EDR esencial. La visibilidad de las amenazas, su investigación y respuesta son simples, rápidas y guiadas para desviar los ataques rápidamente, con una demanda mínima de sus recursos.",
    longDescription:
      "Kaspersky Next EDR Optimum combina una potente protección de endpoints con funcionalidades EDR esenciales. Es ideal para empresas que necesitan visibilidad sobre amenazas y herramientas de respuesta rápida sin la complejidad de soluciones empresariales pesadas. Incluye protección para aplicaciones en la nube y Microsoft 365.",
    logoLight: kEdrOptimumWhite,
    logoDark: kEdrOptimumBlack,
    iconLight: kEdrOptimumIconWhite,
    iconDark: kEdrOptimumIconBlack,
    features: [
      "Todo lo de EDR Foundations",
      "Seguridad en la nube (Cloud Security)",
      "Protección para Microsoft 365",
      "Capacidades de EDR esencial",
      "Capacitaciones en ciberseguridad para TI",
      "Controles de seguridad avanzados",
    ],
    benefits: [
      {
        title: "Automatización",
        description:
          "Reduzca la carga de trabajo de su equipo con respuestas automáticas a amenazas y gestión simplificada.",
      },
      {
        title: "Visibilidad Profunda",
        description:
          "Entienda el origen y el alcance de los ataques con herramientas de análisis de causa raíz (Root Cause Analysis).",
      },
      {
        title: "Protección Cloud",
        description:
          "Asegure sus aplicaciones en la nube y correos electrónicos de Microsoft 365 contra phishing y malware.",
      },
      {
        title: "Respuesta Rápida",
        description:
          "Aísle dispositivos infectados y detenga la propagación de amenazas con un solo clic.",
      },
    ],
    platforms: ["Windows", "macOS", "Android", "iOS"],
    groupedFeatures: [
      {
        category: "Protección de endpoints",
        features: [
          { name: "Protección de endpoints", included: true },
          { name: "Protección contra ransomware", included: true },
        ],
      },
      {
        category: "Seguridad de red",
        features: [{ name: "Seguridad de la red", included: true }],
      },
      {
        category: "Gestión en la nube",
        features: [
          { name: "Supervisión en la nube", included: true },
          { name: "Seguridad en la nube", included: true },
          { name: "Protección Microsoft 365", included: true },
        ],
      },
      {
        category: "EDR",
        features: [
          { name: "Funcionalidades de EDR básicas", included: true },
          { name: "Capacidades de EDR esencial", included: true },
        ],
      },
      {
        category: "Otros",
        features: [
          { name: "Optimización de tareas", included: true },
          {
            name: "Capacitaciones en ciberseguridad para personal de IT",
            included: true,
          },
        ],
      },
    ],
  },
  {
    id: "next-xdr-expert",
    name: "Kaspersky Next XDR Expert",
    description:
      "Además de una protección excepcional de endpoints y funciones de respuesta automática que ayudan a identificar, analizar y neutralizar las amenazas evasivas, la solución ofrece herramientas de detección y respuesta asequibles y fáciles de usar que van más allá de los endpoints, así como acceso a nuestra plataforma de aprendizaje en línea para capacitar a sus empleados en materia de seguridad.",
    longDescription:
      "Kaspersky Next XDR Expert ofrece la máxima protección con capacidades avanzadas de detección y respuesta extendidas (XDR). Diseñado para organizaciones con equipos de seguridad dedicados (SOC) que requieren visibilidad profunda, investigación de amenazas complejas y respuesta orquestada en toda la infraestructura.",
    logoLight: kEdrExpertWhite,
    logoDark: kEdrExpertBlack,
    iconLight: kEdrExpertIconWhite,
    iconDark: kEdrExpertIconBlack,
    features: [
      "Todo lo de EDR Optimum",
      "XDR Nativo y Open XDR",
      "Threat Hunting proactivo",
      "Investigación forense digital",
      "Integración SIEM/SOAR",
      "Inteligencia de amenazas global (TI)",
    ],
    benefits: [
      {
        title: "Visibilidad Total (XDR)",
        description:
          "Vea el panorama completo. Correlacione alertas de diferentes fuentes para detectar ataques sofisticados.",
      },
      {
        title: "Investigación Simplificada",
        description:
          "Analice incidentes complejos con gráficos de visualización de ataques y cronologías detalladas.",
      },
      {
        title: "Respuesta Coordinada",
        description:
          "Responda a amenazas en múltiples vectores (endpoint, red, nube) desde una única consola.",
      },
      {
        title: "Eficiencia Operativa",
        description:
          "Priorice las alertas más críticas y reduzca el ruido para que su equipo se enfoque en lo importante.",
      },
    ],
    platforms: ["Windows", "macOS", "Android", "iOS", "Cloud"],
    groupedFeatures: [
      {
        category: "Protección de endpoints",
        features: [
          { name: "Protección de endpoints", included: true },
          { name: "Protección contra ransomware", included: true },
        ],
      },
      {
        category: "Seguridad de red",
        features: [{ name: "Seguridad de la red", included: true }],
      },
      {
        category: "Gestión en la nube",
        features: [
          { name: "Supervisión en la nube", included: true },
          { name: "Seguridad en la nube", included: true },
          { name: "Protección Microsoft 365", included: true },
        ],
      },
      {
        category: "XDR / EDR Avanzado",
        features: [
          { name: "Funcionalidades de EDR básicas", included: true },
          { name: "Capacidades de EDR esencial", included: true },
          { name: "Correlación cruzada (XDR)", included: true },
        ],
      },
      {
        category: "Otros",
        features: [
          { name: "Optimización de tareas", included: true },
          {
            name: "Capacitaciones en ciberseguridad para personal de IT",
            included: true,
          },
        ],
      },
    ],
  },
];
