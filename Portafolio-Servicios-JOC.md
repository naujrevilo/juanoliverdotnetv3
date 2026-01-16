# PORTAFOLIO DE SERVICIOS RECURRENTES
## Juan Oliver Cyber

**Versión:** 1.0  
**Fecha:** Enero 2026  
**Responsable:** Juan Oliver  
**Ubicación:** Cartagena de Indias, Bolívar, Colombia  

---

## INTRODUCCIÓN

Este documento define el portafolio de **tres (3) servicios recurrentes** que complementan la oferta actual de consultoría y servicios técnicos de **Juan Oliver Cyber**. 

Cada servicio está diseñado para generar **ingresos mensuales predecibles** mediante modelos de **suscripción/licencia**, con contratos que protegen tanto los intereses del proveedor como los del cliente, bajo el marco legal colombiano.

---

## 1. PLAN DE SEGURIDAD TI GESTIONADA (MSP Ligero)

### 1.1 Descripción General

Servicio de **monitoreo de seguridad y soporte técnico remoto gestionado**, dirigido a pequeñas y medianas empresas (Pymes) que requieren:
- Visibilidad de estado de seguridad de sus equipos
- Soporte técnico especializado en ciberseguridad
- Gestión de copias de seguridad automatizadas
- Reportes mensuales de cumplimiento

El servicio **no incluye desarrollo de software a medida**, sino uso de herramientas estándar de monitoreo, automatización y backup.

### 1.2 Alcance Incluido

#### A. CONFIGURACIÓN INICIAL (única vez, sin costo adicional)

- Inventario de equipos conectados (hardware, SO, software crítico)
- Auditoría básica de seguridad (puertos abiertos, cuentas de administrador, antivirus)
- Configuración de actualizaciones automáticas
- Instalación de antivirus/EDR ligero (si aplica)
- Documento de "estado inicial de seguridad"

#### B. MONITOREO CONTINUO (mensual)

Ejecución automática (diaria o semanal según plan) de scripts de monitoreo que detectan:

- Actualizaciones del Sistema Operativo pendientes
- Estado de antivirus/EDR (activo/inactivo)
- Puertos abiertos sospechosos
- Cambios no autorizados en cuentas administrativas
- Fallos de conectividad o servicios críticos
- Espacios en disco críticos

**Herramientas:** PowerShell scripts (Windows), Python scripts (Linux), repositorio en nube económica (Google Sheets, Airtable, o pequeña BD en AWS)

#### C. GESTIÓN DE COPIAS DE SEGURIDAD

- Configuración de backup automático (local + nube)
- Almacenamiento en plataforma económica (Backblaze B2, Google Drive, AWS S3 Light)
- Prueba de restauración 1 vez al mes (ejecución de software, sin intervención manual)
- Alertas si backup falla

**No incluye:** Restauración completa ante desastre (costo adicional por hora)

#### D. SOPORTE TÉCNICO REMOTO

Hasta X horas mensuales según plan, para:
- Respuesta a alertas del sistema de monitoreo
- Resolución de incidentes de seguridad simples
- Asesoramiento en configuración de equipos
- Actualizaciones y parches críticos

**Horario:** Lunes a viernes, 8:00 AM a 6:00 PM (Hora Cartagena, UTC-5)  
**Tiempo de respuesta:** Dentro de 4–8 horas hábiles desde reporte de cliente  
**Canales:** WhatsApp Business, correo, TeamViewer/AnyDesk

#### E. REPORTE MENSUAL AUTOMATIZADO

PDF/HTML auto-generado que contiene:
- Resumen ejecutivo de alertas y acciones tomadas
- Equipos con parches pendientes (criticidad)
- Estado de copias de seguridad
- Incidentes tratados en el mes
- Recomendaciones para el mes siguiente
- Cumplimiento de SLA

### 1.3 Alcance EXCLUIDO

❌ Desarrollo de software a medida  
❌ Implementación de cambios en infraestructura mayor (p.ej., migración a nube completa)  
❌ Garantía de "cero incidentes" de seguridad  
❌ Responsabilidad por infraestructura de terceros (ISP, proveedores de nube)  
❌ Soporte fuera de horario (costo adicional por hora si se requiere)  
❌ Capacitación de usuarios (se ofrece como servicio adicional)  

### 1.4 Modelos de Precio (Mensual)

Todos los precios son **antes de IVA (19%)** y **antes de retención en la fuente (11% para servicios técnicos)**.

| Plan | Equipos Incluidos | Horas Soporte/Mes | Precio Mensual (COP) | Precio Anual (COP) | Observaciones |
|------|------------------|------------------|----------------------|-------------------|--------------|
| **MICRO** | 1–5 | 2 horas | $250.000 | $2.750.000 | Freelancer, home office pequeño, profesional independiente |
| **BÁSICO** | 6–15 | 4 horas | $650.000 | $7.150.000 | Pyme pequeña, oficina, 1 o 2 sucursales |
| **PROFESIONAL** | 16–30 | 8 horas | $1.200.000 | $13.200.000 | Pyme mediana, múltiples sucursales, 30–50 usuarios |
| **ENTERPRISE** | 31+ | Custom | Custom | Custom | Negociación directa, SLA a medida, incluye reuniones mensuales |

### 1.5 Vigencia y Renovación

- **Período inicial:** 6 o 12 meses (a elegir por cliente)
- **Renovación:** Automática por períodos iguales, salvo aviso con 30 días de anticipación
- **Cancellation:** Requiere notificación escrita 30 días antes del vencimiento
- **Costo de cambio de plan:** $0 (se aplica el nuevo precio a partir del próximo ciclo de facturación)

### 1.6 Niveles de Servicio (SLA)

| Aspecto | Compromiso |
|--------|-----------|
| Disponibilidad de soporte | L–V 8:00 AM – 6:00 PM (Cartagena) |
| Tiempo de respuesta (alertas críticas) | 4 horas hábiles |
| Tiempo de respuesta (alertas normales) | 8 horas hábiles |
| Reporte mensual | Antes del día 5 del mes siguiente |
| Actualización de inventario | Semanal |
| Prueba de backup | Mínimo 1 vez/mes |

---

## 2. AUDITORÍA AUTOMATIZADA DE CIBERSEGURIDAD EN NUBE (SaaS)

### 2.1 Descripción General

**Plataforma web SaaS** que permite a clientes conectar sus ambientes en nube (AWS, Azure, Google Cloud) y recibir auditorías automáticas de seguridad con:
- Checklists de 40+ controles de seguridad
- Puntuación mensual de "Health Score" de ciberseguridad
- Reportes detallados con recomendaciones priorizadas
- Dashboard de visibilidad en tiempo real (versión Plus/Enterprise)

**Modelo de negocio:** Licencia de acceso a plataforma, facturación mensual por "cuenta en nube" monitoreada.

### 2.2 Alcance Incluido

#### A. CONEXIÓN A AMBIENTES EN NUBE

- Integración con AWS IAM, Azure Entra ID, Google Cloud IAM
- Configuración de role de auditoría (read-only, sin acceso a datos sensibles)
- Encriptación de credenciales almacenadas en plataforma
- Documentación de permisos necesarios

#### B. AUDITORÍA AUTOMATIZADA

Ejecución automática (diaria/semanal según plan) de controles sobre:

**AWS:**
- Configuración de Security Groups y NACL
- Acceso de usuarios (MFA, permisos excesivos)
- Encriptación de datos en reposo (S3, RDS, EBS)
- Logs y monitoreo (CloudTrail, VPC Flow Logs)
- Configuración de buckets S3 públicos
- Riesgos de IAM

**Azure:**
- Configuración de Network Security Groups
- Acceso condicional y MFA
- Encriptación de datos
- Auditoría y compliance
- Gestión de identidades
- Roles excesivos

**Google Cloud:**
- Configuración de Firewall
- Gestión de IAM y roles
- Encriptación de datos
- Auditoría y logs
- Exposición de recursos

#### C. PUNTUACIÓN Y REPORTE

- **Health Score de Ciberseguridad:** 0–100, basado en controles cumplidos
- Clasificación de riesgos: Crítico, Alto, Medio, Bajo
- Recomendaciones priorizadas con acciones específicas
- Reporte automático en PDF/HTML (mensual, bi-semanal, o semanal según plan)
- Histórico de puntuación para tracking de mejora

#### D. SOPORTE

- Acceso a plataforma 24/7
- Email de soporte con respuesta dentro de 24 horas
- Documentación de conectores y uso
- Actualizaciones automáticas de plataforma

### 2.3 Alcance EXCLUIDO

❌ Remediación de hallazgos de seguridad (se ofrece como servicio de consultoría adicional)  
❌ Integración con otras plataformas de nube no listadas  
❌ Garantía de detectar el 100% de vulnerabilidades  
❌ Responsabilidad por datos confidenciales en nube (auditoría es read-only)  
❌ Soporte técnico 24/7 incluido (disponible como add-on)  

### 2.4 Modelos de Precio (Mensual)

Todos los precios son **antes de IVA (19%)**.

| Plan | Cuentas en Nube | Reportes | Acceso Dashboard | Precio Mensual (COP) | Precio Anual (COP) |
|------|-----------------|----------|-----------------|----------------------|-------------------|
| **STARTUP** | 1 | Mensual | Limitado | $150.000 | $1.650.000 |
| **ESCALA** | 2–5 | Bi-semanal | Completo | $450.000 | $4.950.000 |
| **PROFESIONAL** | 6–10 | Semanal | Completo + API | $900.000 | $9.900.000 |
| **ENTERPRISE** | 11+ | Diario + alertas | Completo + API + Custom | Custom | Custom |

**Nota:** Cada cuenta adicional en nube fuera del plan = +$100.000/mes (plan Startup), +$75.000/mes (plan Escala), +$50.000/mes (plan Profesional).

### 2.5 Vigencia y Renovación

- **Período inicial:** 6 o 12 meses
- **Renovación:** Automática, salvo aviso con 30 días de anticipación
- **Costo de cambio de plan:** Sin penalidad, se prorratea en el siguiente ciclo

### 2.6 Niveles de Servicio (SLA)

| Aspecto | Compromiso |
|--------|-----------|
| Disponibilidad de plataforma | 99% mensual |
| Tiempo de auditoría (1ª ejecución) | 24 horas |
| Tiempo de auditoría (ejecuciones posteriores) | 4 horas |
| Respuesta a consultas de soporte | 24 horas hábiles |
| Actualización de plataforma | Semanal |

---

## 3. GESTOR DE CUMPLIMIENTO SGSI PARA PYMES (SaaS)

### 3.1 Descripción General

**Plataforma web SaaS** que asiste a Pymes en el diseño, implementación y seguimiento de políticas de seguridad de información (SGSI), documentación de cumplimiento, y auditoría interna.

Incluye:
- Biblioteca de templates de políticas SGSI (basadas en ISO 27001)
- Gestor de documentos con versionado
- Asignación de responsables y tareas
- Seguimiento de vencimientos (renovación de certificaciones, auditorías)
- Auto-generación de reportes de cumplimiento

**Modelo de negocio:** Licencia SaaS por "organización + número de usuarios", facturación mensual.

### 3.2 Alcance Incluido

#### A. ACCESO A PLATAFORMA

- Portal web con autenticación segura
- Gestión de usuarios y roles (Admin, Editor, Revisor, Lector)
- Integración básica con email (notificaciones de tareas)
- Almacenamiento ilimitado de documentos

#### B. BIBLIOTECA DE POLÍTICAS SGSI

Más de 30 templates basados en ISO 27001:

- Política de seguridad de información (general)
- Política de acceso y autenticación
- Política de gestión de contraseñas
- Política de manejo de datos confidenciales
- Política de uso aceptable de TI
- Política de copias de seguridad
- Política de incidentes de seguridad
- Política de continuidad del negocio
- Política de terceros/proveedores
- Política de teletrabajo
- Otros (según ISO 27001)

**Cada template es:** Personalizable (incluye campos para nombre empresa, datos específicos), en formato Word/PDF editable, con instrucciones de implementación.

#### C. GESTOR DE DOCUMENTOS

- Upload y almacenamiento de políticas, procedimientos, planes
- Versionado automático (historial de cambios)
- Control de revisiones (quién lo aprobó, cuándo)
- Etiquetado por categoría (riesgo, proceso, función)
- Búsqueda por palabra clave
- Exportación a PDF

#### D. GESTOR DE TAREAS DE CUMPLIMIENTO

- Creación de tareas por tipo: "Revisión de política", "Capacitación de empleados", "Auditoría interna", "Evaluación de proveedor"
- Asignación a responsables con fecha de vencimiento
- Recordatorios automáticos (1 semana, 3 días, 1 día antes)
- Evidencia de completitud (upload de documentos, firma digital)
- Dashboard de tareas pendientes

#### E. SEGUIMIENTO DE VENCIMIENTOS

Calendario de eventos críticos:
- Renovación de certificaciones (ISO 27001, ISO 27002, etc.)
- Auditorías internas y externas programadas
- Licencias de software (compliance)
- Acuerdos con proveedores
- Evaluaciones de riesgo

**Alertas automáticas** 60, 30, 14 y 7 días antes del vencimiento.

#### F. REPORTES AUTOMATIZADOS

Auto-generación en PDF de:
- **Reporte de cumplimiento:** Estado de políticas, tareas completadas, hallazgos pendientes
- **Reporte de auditor:** Resumen de no conformidades, recomendaciones, plazo de corrección
- **Reporte ejecutivo:** Dashboard visual para C-suite (nivel de cumplimiento %, riesgos, roadmap)
- **Reporte de controles:** Mapeo de controles implementados vs ISO 27001 / NTC 5854

#### G. IMPLEMENTACIÓN INICIAL (Incluida en suscripción)

Durante el **primer mes**, se incluye:
- 1 reunión de alignment (hasta 2 horas)
- Diagnóstico rápido del estado de SGSI
- Recomendación de políticas prioritarias para implementar
- Customización de templates básicos con datos de empresa

#### H. SOPORTE

- Acceso a plataforma 24/7
- Email de soporte con respuesta dentro de 24 horas hábiles
- Documentación de uso y tutoriales en video
- Webinarios mensuales de capacitación (para suscriptores Enterprise)

### 3.3 Alcance EXCLUIDO

❌ Implementación completa de SGSI (requiere consultoría adicional)  
❌ Auditoría externa y certificación ISO (soporte, pero no lo ejecutamos)  
❌ Desarrollo de políticas 100% personalizadas por escrito (templates customizable)  
❌ Capacitación en persona de empleados cliente (disponible como add-on por hora)  
❌ Integración con sistemas ERP/HRMS del cliente  

### 3.4 Modelos de Precio (Mensual)

Todos los precios son **antes de IVA (19%)**.

| Plan | Usuarios | Documentos | Reportes | Precio Mensual (COP) | Precio Anual (COP) | Ideal Para |
|------|----------|-----------|----------|----------------------|-------------------|-----------|
| **STARTUP** | 1–5 | Ilimitado | Trimestral | $200.000 | $2.200.000 | Startup, micro-empresa, profesor |
| **PYME** | 6–20 | Ilimitado | Mensual + alertas | $500.000 | $5.500.000 | Pyme pequeña-mediana |
| **PROFESIONAL** | 21–50 | Ilimitado | Semanal + API | $1.000.000 | $11.000.000 | Pyme grande, oficinas múltiples |
| **ENTERPRISE** | 50+ | Ilimitado | Diario + Custom | Custom | Custom | Empresa grande, compliance crítico |

**Nota:** Usuarios adicionales fuera del plan incluido = +$15.000/usuario/mes (retroactivo al siguiente ciclo).

### 3.5 Vigencia y Renovación

- **Período inicial:** 6 o 12 meses
- **Renovación:** Automática, salvo aviso con 30 días de anticipación
- **Costo de cambio de plan:** Sin penalidad, se prorratea

### 3.6 Niveles de Servicio (SLA)

| Aspecto | Compromiso |
|--------|-----------|
| Disponibilidad de plataforma | 99.5% mensual |
| Tiempo de respuesta a bugs críticos | 2 horas |
| Tiempo de respuesta a soporte general | 24 horas hábiles |
| Disponibilidad de reportes automáticos | Dentro de 24 horas del evento de vencimiento |
| Actualización de templates SGSI | Trimestral |

---

## 4. PROCESO DE VENTA Y ONBOARDING

### 4.1 Propuesta Comercial

1. **Contacto inicial:** Cliente expresa interés (por correo, WhatsApp, llamada)
2. **Propuesta:** Envío de documento PDF con:
   - Descripción de servicio elegido
   - Plan recomendado
   - Precio mensual + IVA
   - Términos de pago
   - Plazo de implementación
   - Contrato adjunto para firmar

3. **Firma:** Cliente revisa y firma contrato (formato PDF + DocuSign, o físico)

4. **Facturación:** Se genera cuenta de cobro/factura por el primer mes

### 4.2 Implementación (Onboarding)

**MSP Ligero:**
- Semana 1: Inventario de equipos + auditoría inicial
- Semana 2: Instalación de scripts de monitoreo
- Semana 3: Primeros reportes
- Total: 2–3 semanas

**Auditoría en Nube:**
- Día 1: Creación de cuenta en plataforma
- Día 2: Configuración de conectores (AWS/Azure/GCP)
- Día 3: Primera auditoría automática
- Día 5: Primer reporte
- Total: 5 días hábiles

**Gestor SGSI:**
- Semana 1: Reunión de alignment + acceso a plataforma
- Semana 2: Customización de templates y organización
- Semana 3: Capacitación de usuarios
- Mes 1: Implementación inicial incluida
- Total: 2–3 semanas

---

## 5. TÉRMINOS DE PAGO Y FACTURACIÓN

### 5.1 Forma de Pago

**Obligatorio:** Transferencia bancaria a cuenta de Juan Oliver Cyber

**Opciones de ciclo:**
- **Mensual:** Pago anticipado (primeros 5 días del mes) o mes vencido (hasta 5 días después del corte)
- **Anual:** Pago único al inicio, con descuento del 5% vs mensual
- **Trimestral:** Disponible bajo solicitud

### 5.2 Facturación

- **Emisión:** Cuenta de cobro simple o factura (según régimen tributario)
- **Vencimiento:** Máximo 5 días después de emisión para mes vencido, inmediato para mes anticipado
- **Formato:** PDF enviado por correo

### 5.3 Mora y Cobranza

**Interés de mora:**
- Tasa: 24,36% efectivo anual (tasa de usura vigente para enero 2026, variable mensualmente)
- Base legal: Art. 635 del Estatuto Tributario Colombiano
- Se liquida diariamente sobre el saldo no pagado

**Plazo de gracia:**
- 5 días después del vencimiento: Sin penalidad
- Día 6+: Inicia cálculo de interés moratorio

**Acciones por no pago:**
- **Día 10+:** Notificación de vencimiento (correo + WhatsApp)
- **Día 20+:** Suspensión automática del servicio
- **Día 30+:** Terminación del contrato y cobro judicial

---

## 6. GARANTÍAS, LIMITACIONES Y RESPONSABILIDAD

### 6.1 Garantías del Proveedor

✅ Prestar los servicios con **diligencia profesional**  
✅ Respetar **horarios de soporte** descritos en SLA  
✅ Mantener **confidencialidad** de información del cliente  
✅ Proteger datos bajo estándares de **encriptación estándar industrial**  

### 6.2 No se Garantiza

❌ Eliminación del 100% de riesgos de ciberseguridad  
❌ "Cero incidentes" o "cero vulnerabilidades"  
❌ Disponibilidad 24/7 (excepto servicios específicamente pactados)  
❌ Responsabilidad por terceros (ISP, proveedores de nube, infraestructura ajena)  

### 6.3 Limitación de Responsabilidad

La responsabilidad total del proveedor por cualquier incumplimiento **no excederá el 50% del monto pagado en los últimos 3 meses** de suscripción.

En particular, el proveedor **no es responsable** por:
- Pérdida de datos (excepto por negligencia grave del proveedor)
- Lucro cesante o pérdida de ingresos del cliente
- Daño reputacional
- Daños indirectos, consecuenciales o punitivos

---

## 7. PROPIEDAD INTELECTUAL

### 7.1 Propiedad del Proveedor

**Permanece como propiedad de Juan Oliver Cyber:**
- Plataformas SaaS (auditoría, SGSI)
- Scripts de monitoreo y automatización
- Templates de políticas y documentos
- Knowhow y metodologías propias
- Branding y nombres comerciales

El cliente recibe una **licencia de uso limitada, no exclusiva, revocable**, condicionada al pago de las mensualidades.

### 7.2 Información del Cliente

Los documentos, datos y información proporcionados por el cliente quedan bajo **derecho de confidencialidad** del proveedor. No será divulgada a terceros sin consentimiento escrito.

### 7.3 Registros y Copias de Seguridad

Al terminar el contrato:
- El cliente puede exportar sus documentos/datos en formato estándar (PDF, CSV, Excel)
- Plazo: Hasta 15 días después de terminación
- Costo: Sin costo adicional
- El proveedor puede eliminar datos del cliente después de 30 días de terminación

---

## 8. VIGENCIA DEL PORTAFOLIO

Este documento entra en vigencia a partir de **Enero 15, 2026** y es válido hasta que el proveedor lo actualice o revoque.

**Revisión:** Trimestral, con ajustes de precios según inflación y costo operacional.

---

**Documento preparado por:** Juan Oliver Cyber  
**Versión:** 1.0  
**Última actualización:** Enero 2026  
**Próxima revisión:** Abril 2026  
