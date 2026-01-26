import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const GALLERY_FILE = path.join(__dirname, 'src/data/gallery-config.json');

// Middleware
app.use(express.json());

// Asegurar que el archivo existe
const ensureGalleryFile = () => {
  if (!fs.existsSync(GALLERY_FILE)) {
    const defaultGallery = {
      images: [
        { id: 1, name: 'Producto 1', image: '/galeria/1.jpeg' },
        { id: 2, name: 'Producto 2', image: '/galeria/2.jpeg' },
        { id: 3, name: 'Producto 3', image: '/galeria/3.jpeg' },
        { id: 4, name: 'Producto 4', image: '/galeria/model.jpeg' }
      ],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(defaultGallery, null, 2));
  }
};

ensureGalleryFile();

// GET /api/gallery - Obtener galería actual
app.get('/api/gallery', (req, res) => {
  try {
    const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
    const gallery = JSON.parse(data);
    res.json(gallery);
  } catch (error) {
    console.error('Error reading gallery:', error);
    res.status(500).json({ error: 'Error reading gallery' });
  }
});

// POST /api/gallery - Actualizar galería
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

    console.log(`[${new Date().toLocaleTimeString()}] Gallery updated with ${images.length} images`);

    res.json({ success: true, gallery });
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({ error: 'Error updating gallery' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gallery server is running' });
});

export default app;
