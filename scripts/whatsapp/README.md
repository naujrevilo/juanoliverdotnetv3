# Sincronización de Servicios con WhatsApp Business

Este directorio contiene herramientas para sincronizar automáticamente los servicios de tu sitio web (almacenados en `src/data/services.json`) con un catálogo de WhatsApp Business.

## 📁 Contenido

```
scripts/whatsapp/
├── sync_services.py          # Script principal (lee desde JSON)
├── sync_products.py          # Script anterior (requería Turso)
├── requirements.txt          # Dependencias de Python
└── README.md                 # Este archivo
```

## ⚠️ INFORMACIÓN IMPORTANTE SOBRE EL TOKEN

**El Meta Access Token es OBLIGATORIO.** No hay forma de usar WhatsApp Business APIs sin él. Meta requiere que todos los sistemas que integren con WhatsApp utilicen un token de acceso válido para fines de seguridad, auditoría y control de acceso.

### ¿Por qué necesitas el token?
- WhatsApp Business ahora es parte del ecosistema Meta
- Requiere autenticación OAuth 2.0
- Meta necesita saber qué aplicaciones acceden a tus datos
- Es obligatorio para cualquier integración con WhatsApp APIs

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd scripts/whatsapp
pip install -r requirements.txt
```

### 2. Obtener META_ACCESS_TOKEN (OBLIGATORIO)

**Opción A: User Token (Temporal - Desarrollo)**
1. Ve a: https://developers.facebook.com/apps
2. Selecciona tu app o crea una
3. Ve a **Tools > Graph API Explorer**
4. Genera un token con estos permisos:
   - catalog_management
   - whatsapp_business_management
   - whatsapp_business_messaging
5. Copia el token (válido ~2 horas)

**Opción B: System User Token (Permanente - Producción RECOMENDADO)**
1. Ve a: https://business.facebook.com/
2. Ve a **Users > System Users**
3. Crea un System User con rol Admin
4. Genera un token con los permisos listados arriba
5. Copia el token (válido indefinidamente)

### 3. Obtener META_CATALOG_ID
1. Ve a: https://business.facebook.com
2. Ve a **Commerce > Catalogs**
3. Abre tu catálogo E-commerce
4. La URL dirá: `/catalogs/123456789/items`
5. El número después de `/catalogs/` es tu CATALOG_ID

### 4. Ejecutar

```bash
# Modo prueba (sin enviar datos)
python sync_services.py --dry-run

# Modo producción
python sync_services.py --mode full
```

- Documentación para scripts **v2.0+**

## 🔍 Características

✅ Extrae productos de BD Turso  
✅ Transforma al formato Meta API  
✅ Divide en lotes automáticamente  
✅ Maneja errores y reintentos  
✅ Genera logs detallados  
✅ Soporta CREATE, UPDATE, DELETE  

## ⚙️ Argumentos de Línea de Comandos

```bash
python sync_products.py [--mode create|update|full] [--dry-run]

Opciones:
  --mode create    Solo crear productos nuevos
  --mode update    Solo actualizar existentes
  --mode full      Crear y actualizar (default)
  --dry-run        Simular sin enviar a Meta API
```

## 📊 Estructura de Logs

Los logs se generan en: `logs/whatsapp_sync_YYYYMMDD_HHMMSS.log`

Ejemplo:
```
2024-02-27 14:30:45 - INFO - ✓ Se obtuvieron 15 productos de la BD
2024-02-27 14:30:47 - INFO - ✓ Sincronización exitosa
```

## 🛠️ Requisitos

- Python 3.8+
- Acceso a BD Turso (variables de entorno)
- Token Meta con permisos `catalog_management`
- Catálogo Meta conectado a WABA

## 📝 Variables de Entorno Requeridas

| Variable | Descripción |
|---|---|
| `TURSO_DATABASE_URL` | URL de conexión a Turso |
| `TURSO_AUTH_TOKEN` | Token de autenticación Turso |
| `META_ACCESS_TOKEN` | Token de acceso Meta/Facebook |
| `META_CATALOG_ID` | ID del catálogo Meta |
| `META_WABA_ID` | ID de WhatsApp Business (opcional) |

## 🚨 Solución de Problemas

### ImportError: No module named 'requests'

```bash
pip install -r requirements.txt
```

### Error de conexión a BD

Verificar que `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` son correctos.

### Error 401 en Meta API

Token inválido o expirado. Regenerar en Meta Developers.

Para más ayuda, consultar `docs/WHATSAPP_SYNC_USER_GUIDE.md` sección "Solución de Problemas".

## 📞 Soporte

- Documentación completa: `docs/WHATSAPP_SYNC_USER_GUIDE.md`
- Especificaciones técnicas: `docs/WHATSAPP_SYNC_TECHNICAL.md`
- Meta API Docs: https://developers.facebook.com/docs/whatsapp

---

**Versión:** 1.0.0  
**Autor:** Oz (oz-agent@warp.dev)  
**Última actualización:** 2024-02-27
