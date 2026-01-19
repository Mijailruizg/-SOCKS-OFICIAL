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
    const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
    const gallery = JSON.parse(data);
    console.log(`📖 [GET /api/gallery] ${gallery.images.length} imágenes enviadas`);
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

    fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));

    console.log(`💾 [POST /api/gallery] Actualizado con ${images.length} imágenes`);

    res.json({ success: true, gallery });
  } catch (error) {
    console.error('❌ Error guardando galería:', error.message);
    res.status(500).json({ error: 'Error updating gallery' });
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
