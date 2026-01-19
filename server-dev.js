#!/usr/bin/env node
/**
 * Servidor de desarrollo que integra Express con Vite
 * Lee/escribe archivos de galería y sirve la aplicación React
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

const PORT = process.env.PORT || 3000;

// Intentar puertos alternativos si 3000 está en uso
let actualPort = PORT;
const server = app.listen(actualPort, '0.0.0.0', () => {
  console.log('\n🚀 Servidor Express iniciado');
  console.log(`📍 Escuchando en: http://localhost:${actualPort}`);
  console.log(`📍 API de galería: http://localhost:${actualPort}/api/gallery`);
  console.log(`💚 Health check: http://localhost:${actualPort}/api/health\n`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // Intentar siguiente puerto
    actualPort++;
    console.log(`⚠️  Puerto ${PORT} en uso, intentando ${actualPort}...`);
    server.listen(actualPort, '0.0.0.0', () => {
      console.log(`\n🚀 Servidor Express iniciado`);
      console.log(`📍 Escuchando en: http://localhost:${actualPort}`);
      console.log(`📍 API de galería: http://localhost:${actualPort}/api/gallery\n`);
    });
  } else {
    throw err;
  }
});

// Iniciar Vite en modo desarrollo
console.log('📦 Iniciando Vite en paralelo...\n');
const viteProcess = spawn('npm', ['run', 'dev:vite'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Manejar cierre de procesos
process.on('SIGINT', () => {
  console.log('\n⏹️  Deteniendo servidores...');
  server.close();
  viteProcess.kill();
  process.exit(0);
});

viteProcess.on('exit', (code) => {
  console.log(`⏹️  Vite se cerró con código ${code}`);
  process.exit(code);
});
