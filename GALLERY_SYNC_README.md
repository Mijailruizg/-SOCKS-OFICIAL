# Solución de Sincronización de Galería - SOCKS OFICIAL

## 🎯 Problema Resuelto

Los cambios realizados por el administrador en el panel de galería ahora se **sincronizan automáticamente en todos los dispositivos** (PC, móvil, tablet, etc.) en tiempo real.

## 🔧 Cómo Funciona

### Arquitectura
- **API Server** (Express): Gestiona lectura/escritura de datos de galería
- **Frontend** (React + Vite): Conecta con la API para obtener/guardar cambios
- **Storage**: Archivo `src/data/gallery-config.json` (persistente en servidor)

### Flujo
1. **Admin guarda cambio** → POST a `/api/gallery`
2. **API guarda archivo** → `gallery-config.json` se actualiza
3. **Otros dispositivos** → Verifican cada 2 segundos con GET `/api/gallery`
4. **Se actualizan automáticamente** → Todos ven los cambios al instante

## 🚀 Uso

### Iniciar el servidor

```bash
npm run dev
```

Esto inicia:
- **API Server**: http://localhost:3000 (Express)
- **Frontend**: http://localhost:3002 (Vite/React)

### Acceder a la aplicación

```
http://192.168.0.10:3002  # Desde cualquier dispositivo en la red
```

### API Endpoints

#### Obtener galería actual
```bash
GET http://localhost:3000/api/gallery
```

Respuesta:
```json
{
  "images": [
    {
      "id": "1",
      "name": "SOCKS OFICIAL 1",
      "image": "/galeria/2.jpeg"
    }
  ],
  "updatedAt": "2024-01-20T15:30:00.000Z"
}
```

#### Actualizar galería
```bash
POST http://localhost:3000/api/gallery
Content-Type: application/json

{
  "images": [
    {
      "id": "1",
      "name": "SOCKS OFICIAL 1",
      "image": "/galeria/2.jpeg"
    }
  ]
}
```

## 📝 Cambios Realizados

### Archivos Creados
1. **api-server.js** - Servidor Express con endpoints de galería
2. **src/lib/galleryServerSync.js** - Cliente para sincronización

### Archivos Modificados
1. **src/pages/AdminGalleryPage.jsx**
   - Ahora usa API `/api/gallery` en lugar de localStorage
   - POST al guardar/eliminar/editar imágenes
   - Verifica cambios cada 2 segundos

2. **src/components/ModelsSection.jsx**
   - Lee de `/api/gallery` en lugar de localStorage
   - Actualiza automáticamente cuando hay cambios

3. **src/components/ModelGallerySection.jsx**
   - Sincroniza con servidor automáticamente
   - Usa polling de 2 segundos

4. **src/data/gallery-config.json**
   - Estructura actualizada: `id`, `name`, `image` (en lugar de `url`, `title`, `cacheBuster`)

5. **package.json**
   - Agregado: `"express": "^4.18.2"`
   - Scripts actualizados

### Estructura de Datos

**Antes (localStorage)**:
```json
{
  "id": "123",
  "url": "/ruta/imagen.jpg",
  "title": "Título",
  "size": "normal",
  "cacheBuster": 12345
}
```

**Ahora (API)**:
```json
{
  "id": "1",
  "name": "Nombre del Producto",
  "image": "/galeria/1.jpeg"
}
```

## ✨ Características

✅ **Cross-Device Sync**: Cambios visibles en todos los dispositivos al instante
✅ **Real-time Updates**: Polling cada 2 segundos
✅ **Fallback Seguro**: Si la API falla, usa localStorage como respaldo
✅ **Persistent Storage**: Los datos se guardan en archivo JSON del servidor
✅ **Admin Friendly**: Panel visual fácil de usar
✅ **Network Friendly**: Sincronización en red local (192.168.0.10)

## 🐛 Verificación

### Probar desde 2 dispositivos
1. Abre en PC: `http://192.168.0.10:3002`
2. Abre en móvil: `http://192.168.0.10:3002`
3. Admin en PC: Agrega/edita/elimina una imagen
4. Móvil: Debe mostrar el cambio en 2-3 segundos automáticamente

### Verificar API
```bash
# Terminal 1 (PC)
curl http://localhost:3000/api/gallery

# Resultado esperado
{"images":[...],"updatedAt":"2024-01-20T15:30:00.000Z"}
```

## ⚙️ Configuración

### Cambiar puerto del API
```bash
API_PORT=3001 npm run dev
```

### Cambiar intervalo de polling
En `AdminGalleryPage.jsx`, `ModelsSection.jsx` y `ModelGallerySection.jsx`:
```javascript
// Cambiar de 2000ms (2 segundos) a otro valor
const pollInterval = setInterval(loadImages, 2000);
```

## 📦 Estructura de Carpetas

```
src/
├── data/
│   └── gallery-config.json      # ← Datos de galería (servidor)
├── lib/
│   └── galleryServerSync.js     # ← Cliente de sincronización
├── pages/
│   └── AdminGalleryPage.jsx     # ← Panel admin (sincronizado)
└── components/
    ├── ModelsSection.jsx        # ← Galería en home (sincronizada)
    └── ModelGallerySection.jsx   # ← Galería visual (sincronizada)

api-server.js                     # ← Servidor Express
package.json                      # ← Dependencies + scripts
```

## 🎓 Lecciones Aprendidas

### ❌ Qué No Funcionó
- `localStorage` - Solo funciona en el mismo navegador/dispositivo
- Polling en localStorage - No sincroniza entre dispositivos

### ✅ Qué Funciona
- Archivo JSON en servidor + API
- Polling desde cliente a servidor
- Express para servir API

## 🔮 Mejoras Futuras

1. **Base de datos real** (Supabase, PostgreSQL)
   - Mejor para múltiples usuarios simultáneos
   - Real-time subscriptions

2. **WebSockets**
   - En lugar de polling cada 2 segundos
   - Actualizaciones instantáneas

3. **Caché en cliente**
   - Evitar requests innecesarios
   - Comparar timestamps

4. **Autenticación**
   - Solo admin puede modificar
   - Historial de cambios

## ❓ Preguntas Frecuentes

**P: ¿Por qué se demora 2 segundos en ver los cambios?**
R: Ese es el intervalo de polling. Puedes bajarlo a 1000ms para ser más rápido, pero consumirá más recursos.

**P: ¿Funciona desde internet?**
R: No, solo en red local (LAN). Para internet necesitarías Vercel con una base de datos.

**P: ¿Qué pasa si cierro el servidor?**
R: El frontend seguirá funcionando pero no podrá guardar/sincronizar cambios.

**P: ¿Puedo usar esto en Vercel?**
R: No directamente. Vercel necesita una base de datos (Supabase, Firebase, etc.) para persistencia.

---

**Última actualización**: 2024-01-20
**Versión**: 1.0
**Estado**: ✅ Funcional en red local
