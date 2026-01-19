import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const GALLERY_FILE = path.join(__dirname, '../data/gallery-config.json');

// GET - Obtener galería actual
router.get('/gallery', async (req, res) => {
  try {
    const data = await fs.readFile(GALLERY_FILE, 'utf-8');
    const gallery = JSON.parse(data);
    res.json(gallery);
  } catch (error) {
    console.error('Error reading gallery:', error);
    res.status(500).json({ error: 'Error reading gallery' });
  }
});

// POST - Actualizar galería
router.post('/gallery', async (req, res) => {
  try {
    const { images } = req.body;
    
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Invalid images array' });
    }

    const gallery = {
      images: images,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(GALLERY_FILE, JSON.stringify(gallery, null, 2));
    
    res.json({ success: true, gallery });
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({ error: 'Error updating gallery' });
  }
});

export default router;
