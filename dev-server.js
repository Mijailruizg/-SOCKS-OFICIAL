// Script para iniciar servidor Express + Vite para desarrollo
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const startServer = async () => {
  const app = express();
  const GALLERY_FILE = path.join(__dirname, 'src/data/gallery-config.json');

  // Middleware JSON
  app.use(express.json());

  // Asegurar que el archivo existe
  const ensureGalleryFile = () => {
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
      fs.mkdirSync(path.dirname(GALLERY_FILE), { recursive: true });
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(defaultGallery, null, 2));
      console.log('Created default gallery file');
    }
  };

  ensureGalleryFile();

  // API Routes
  app.get('/api/gallery', (req, res) => {
    try {
      const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
      const gallery = JSON.parse(data);
      console.log(`[GET /api/gallery] Retornando ${gallery.images.length} imágenes`);
      res.json(gallery);
    } catch (error) {
      console.error('Error reading gallery:', error);
      res.status(500).json({ error: 'Error reading gallery' });
    }
  });

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

      console.log(`[POST /api/gallery] Actualizado con ${images.length} imágenes en ${new Date().toLocaleTimeString()}`);

      res.json({ success: true, gallery });
    } catch (error) {
      console.error('Error updating gallery:', error);
      res.status(500).json({ error: 'Error updating gallery' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Crear servidor Vite
  const vite = await createViteServer({
    server: { middlewareMode: true }
  });

  // Usar middleware de Vite
  app.use(vite.middlewares);

  // Servir index.html en rutas desconocidas (para React Router)
  app.get('*', async (req, res) => {
    try {
      let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      indexHtml = await vite.transformIndexHtml(req.url, indexHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(indexHtml);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      res.status(500).end(e.message);
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Servidor iniciado en http://localhost:${port}`);
    console.log(`✅ API de galería en http://localhost:${port}/api/gallery`);
  });
};

startServer().catch(console.error);
