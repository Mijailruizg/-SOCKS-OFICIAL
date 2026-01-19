#!/usr/bin/env node
/**
 * Servidor de desarrollo simple que sirve la API de galería
 * Vite se ejecuta en puerto separado (3002)
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const GALLERY_FILE = path.join(__dirname, 'src/data/gallery-config.json');

// Middleware
app.use(express.json());

// CORS - Permitir requests desde cualquier origen
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Asegurar que el archivo de galería existe
const ensureGalleryFile = () => {
  const dir = path.dirname(GALLERY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(GALLERY_FILE)) {
    const defaultGallery = {
      images: [
        { id: 1, name: 'Producto 1', image: '/galeria/1.jpeg' },
        { id: 2, name: 'Producto 2', image: '/galeria/2.jpeg' },
        { id: 3, name: 'Producto 3', image: '/galeria/3.jpeg' },
        { id: 4, name: 'Producto 4', image: '/galeria/4.jpeg' }
      ],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(defaultGallery, null, 2));
    console.log('✅ Archivo de galería creado');
  }
};

ensureGalleryFile();

// ============ API ROUTES ============

// GET /api/gallery - Obtener la galería actual
app.get('/api/gallery', (req, res) => {
  try {
    if (!fs.existsSync(GALLERY_FILE)) {
      console.log('⚠️  Archivo no existe, creando con datos por defecto...');
      ensureGalleryFile();
    }
    const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
    const gallery = JSON.parse(data);
    console.log(`✅ [GET /api/gallery] Enviando ${gallery.images.length} imágenes`);
    console.log(`   Archivo: ${GALLERY_FILE}`);
    res.json(gallery);
  } catch (error) {
    console.error('❌ Error leyendo galería:', error.message);
    res.status(500).json({ error: 'Error reading gallery' });
  }
});

// POST /api/gallery - Actualizar la galería
app.post('/api/gallery', (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Images must be an array' });
    }

    const gallery = {
      images,
      updatedAt: new Date().toISOString()
    };

    // Guardar con ruta absoluta
    const absolutePath = path.resolve(GALLERY_FILE);
    fs.writeFileSync(absolutePath, JSON.stringify(gallery, null, 2));
    
    // Verificar que se guardó
    const verifyRead = fs.readFileSync(absolutePath, 'utf-8');
    const verifyData = JSON.parse(verifyRead);

    console.log(`💾 [POST /api/gallery] Guardado: ${images.length} imágenes`);
    console.log(`   Ruta: ${absolutePath}`);
    console.log(`   Verificación: ${verifyData.images.length} imágenes confirmadas`);

    res.json({ success: true, gallery });
  } catch (error) {
    console.error('❌ Error guardando galería:', error.message);
    console.error('   Stack:', error.stack);
    res.status(500).json({ error: 'Error updating gallery', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ START SERVER ============

const PORT = process.env.API_PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n✅ Servidor API iniciado');
  console.log(`📍 Escuchando en: http://localhost:${PORT}`);
  console.log(`📍 API de galería: http://localhost:${PORT}/api/gallery`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n⏹️  Presiona Ctrl+C para detener\n`);
});

// Manejar cierre
process.on('SIGINT', () => {
  console.log('\n⏹️  Servidor detenido');
  process.exit(0);
});
