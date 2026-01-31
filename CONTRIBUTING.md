# Contribuir a juanoliver-web

¡Gracias por tu interés en contribuir! Este documento proporciona pautas para contribuir al proyecto.

## 🤝 Código de Conducta

- Se respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo que es mejor para la comunidad
- Muestra empatía hacia otros miembros

## 🐛 Reportar Bugs

Antes de crear un issue:

1. Verifica que no exista uno similar
2. Usa la plantilla de bug report
3. Incluye toda la información relevante:
   - Versión de Node.js y pnpm
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

## 💡 Proponer Mejoras

Para sugerir nuevas funcionalidades:

1. Abre un issue con la etiqueta `enhancement`
2. Describe claramente el problema que resuelve
3. Proporciona ejemplos de uso
4. Considera alternativas que hayas evaluado

## 🔧 Pull Requests

### Proceso

1. **Fork** el repositorio
2. Crea una **rama** desde `develop`:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. Realiza tus cambios siguiendo las **convenciones de código**
4. Asegúrate de que todos los **tests pasen**:

   ```bash
   pnpm check
   pnpm build
   ```

5. **Commit** tus cambios usando [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push** a tu fork:

   ```bash
   git push origin feature/amazing-feature
   ```

7. Abre un **Pull Request** hacia `develop`

### Conventional Commits

Usa el formato:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, puntos y comas, etc.
- `refactor`: Refactorización de código
- `test`: Añadir tests
- `chore`: Mantenimiento

**Ejemplos:**

```
feat(blog): add RSS feed support
fix(db): resolve connection timeout issue
docs(readme): update installation instructions
```

## 📝 Estándares de Código

### TypeScript/JavaScript

- Usa TypeScript para todo código nuevo
- Sigue las reglas de ESLint (cuando esté configurado)
- Usa tipos explícitos, evita `any`
- Nombres descriptivos en inglés para variables y funciones

### Astro/Svelte

- Componentes en PascalCase
- Props con tipos definidos
- Comentarios JSDoc para componentes complejos

### CSS/Tailwind

- Usa clases de Tailwind cuando sea posible
- Evita CSS custom a menos que sea necesario
- Sigue la paleta de colores definida

### Commits

- Un commit por cambio lógico
- Mensajes claros y descriptivos
- Referencias a issues cuando aplique (#123)

## 🧪 Testing

Actualmente el proyecto no tiene tests automatizados, pero:

- Verifica que `pnpm build` funcione sin errores
- Prueba manualmente en desarrollo
- Revisa que no haya warnings de TypeScript

## 📚 Documentación

Si tu PR añade nuevas funcionalidades:

- Actualiza el README.md si es necesario
- Añade comentarios JSDoc a funciones complejas
- Documenta nuevas variables de entorno en `.env.example`

## ⚡ Prioridades

Áreas donde las contribuciones son especialmente bienvenidas:

- Tests automatizados (unit, integration, e2e)
- Accesibilidad (a11y)
- Performance optimizations
- Documentación mejorada
- Componentes reutilizables

## 🔍 Revisión de Código

Los PRs serán revisados considerando:

- Calidad del código
- Adherencia a estándares del proyecto
- Impacto en performance
- Seguridad
- Documentación

## 📞 Contacto

Si tienes preguntas:

- Abre un issue con la etiqueta `question`
- Contacta al mantenedor: [@juanoliver](https://github.com/juanoliver)

---

¡Gracias por contribuir! 🎉
