# Security Policy

## 🛡️ Política de Seguridad

La seguridad es una prioridad máxima en este proyecto. Agradecemos a la comunidad que reporte cualquier vulnerabilidad de manera responsable.

## 📋 Versiones Soportadas

| Versión | Soportada          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## 🔒 Reportar una Vulnerabilidad

**NO** crees un issue público para vulnerabilidades de seguridad.

En su lugar:

1. **Email**: Envía un correo a `security@juanoliver.net` con:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (si las tienes)

2. **Respuesta Esperada**:
   - Confirmación de recepción: 24-48 horas
   - Evaluación inicial: 3-5 días hábiles
   - Resolución: Depende de la severidad

3. **Divulgación Responsable**:
   - Por favor, danos tiempo razonable para corregir la vulnerabilidad antes de divulgarla públicamente
   - Te acreditaremos en el changelog (si lo deseas)

## 🔐 Áreas de Enfoque

Estamos especialmente interesados en reportes sobre:

### Alta Prioridad

- **Inyección SQL**: En queries de Drizzle ORM
- **XSS**: Cross-Site Scripting en componentes Svelte/Astro
- **CSRF**: Cross-Site Request Forgery
- **Auth Bypass**: Vulnerabilidades de autenticación/autorización
- **Sensitive Data Exposure**: Exposición de variables de entorno o secretos

### Media Prioridad

- **CSP Bypass**: Evasión de Content Security Policy
- **SSRF**: Server-Side Request Forgery
- **Path Traversal**: Acceso a archivos no autorizados
- **Rate Limiting**: Ausencia de límites de tasa

### Baja Prioridad

- **Información de versiones**: Revelación de versiones de dependencias
- **Security Headers**: Configuración subóptima (ya tenemos HSTS, CSP, etc.)

## ✅ Buenas Prácticas Implementadas

- ✅ Content Security Policy (CSP)
- ✅ HSTS con preload
- ✅ X-Frame-Options, X-Content-Type-Options
- ✅ Input validation con Zod
- ✅ Variables de entorno para secretos
- ✅ Dependency scanning (Snyk + Dependabot)
- ✅ HTTPS-only en producción
- ✅ Permissions-Policy headers

## 🚫 Fuera de Alcance

Los siguientes NO se consideran vulnerabilidades de seguridad:

- Vulnerabilidades en dependencias de terceros (reporta directamente al proyecto upstream)
- Ataques de ingeniería social
- Ataques de denegación de servicio (DoS) que requieren recursos desproporcionados
- Vulnerabilidades que requieren acceso físico al servidor
- Clickjacking en páginas sin contenido sensible
- Missing security headers ya configurados
- Autocomplete habilitado en formularios públicos

## 🏆 Reconocimientos

Agradecemos a los siguientes investigadores de seguridad (Hall of Fame):

- _Tu nombre podría estar aquí_

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk Vulnerability Database](https://security.snyk.io/)
- [CVE Database](https://cve.mitre.org/)
- [Azure Security Best Practices](https://docs.microsoft.com/azure/security/)

## 📞 Contacto

- **Email de Seguridad**: <security@juanoliver.net>
- **GPG Key**: [Disponible bajo pedido]
- **Website**: <https://juanoliver.net>

---

Gracias por ayudarnos a mantener este proyecto seguro. 🔐
