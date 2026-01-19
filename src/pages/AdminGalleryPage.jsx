import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Cache buster - fuerza actualización en navegador
const CACHE_BUSTER = '2026-01-19-v2';

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageSize, setImageSize] = useState('normal');
  const [editingImageTitle, setEditingImageTitle] = useState('');
  const { toast } = useToast();

  const imageSizes = {
    small: { label: 'Pequeño (300px)', width: 300, height: 300 },
    normal: { label: 'Normal (500px)', width: 500, height: 500 },
    large: { label: 'Grande (800px)', width: 800, height: 800 },
    xlarge: { label: 'Extra Grande (1200px)', width: 1200, height: 1200 }
  };

  useEffect(() => {
    loadImages();

    // Verificar cambios cada 3 segundos (sincronización en tiempo real)
    const pollInterval = setInterval(loadImages, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const apiUrl = `http://${window.location.hostname}:3000/api/gallery?t=${Date.now()}`;
      console.log('📥 GET desde:', apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Error fetching gallery');
      
      const data = await response.json();
      console.log('✅ Galería recibida:', data.images.length, 'imágenes');
      if (data.images && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (err) {
      console.error('❌ Error loading images:', err);
      if (loading) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las imágenes',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (imageUrl) => {
    if (!imageUrl) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa una URL',
        variant: 'destructive'
      });
      return;
    }

    const newImage = {
      id: Date.now().toString(),
      name: editingImageTitle || 'Nueva imagen',
      image: imageUrl,
      size: imageSize,
      created_at: new Date().toISOString()
    };

    const updatedImages = [...images, newImage];
    
    try {
      const apiUrl = `http://${window.location.hostname}:3000/api/gallery?t=${Date.now()}`;
      console.log('📤 Enviando POST a:', apiUrl);
      console.log('📦 Datos:', JSON.stringify({ images: updatedImages }, null, 2).substring(0, 200));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: updatedImages })
      });

      console.log('📥 Respuesta:', response.status, response.statusText);
      if (!response.ok) throw new Error('Error saving image');
      
      setImages(updatedImages);
      toast({
        title: 'Éxito',
        description: '✅ Imagen agregada. Se ve en todos tus dispositivos al instante.'
      });
      setEditingImageTitle('');
      setImageSize('normal');
    } catch (error) {
      console.error('❌ Error saving image:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar la imagen',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      
      try {
        const apiUrl = `http://${window.location.hostname}:3000/api/gallery?t=${Date.now()}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: updatedImages })
        });

        if (!response.ok) throw new Error('Error deleting image');
        
        setImages(updatedImages);
        setSelectedImage(null);
        toast({
          title: 'Éxito',
          description: '✅ Imagen eliminada en todos los dispositivos'
        });
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: 'Error',
          description: 'Error al eliminar la imagen',
          variant: 'destructive'
        });
      }
    }
  };

  const handleEditImage = async (imageId, updatedImageData) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, ...updatedImageData } : img
    );
    
    try {
      const apiUrl = `http://${window.location.hostname}:3000/api/gallery?t=${Date.now()}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: updatedImages })
      });

      if (!response.ok) throw new Error('Error updating image');
      
      setImages(updatedImages);
      toast({
        title: 'Éxito',
        description: '✅ Imagen actualizada. Se sincroniza al instante en todos tus dispositivos.'
      });
    } catch (error) {
      console.error('Error updating image:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar la imagen',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando galería...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add Image Section */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">📸 Agregar Nueva Imagen</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Título de la Imagen</label>
            <input
              type="text"
              value={editingImageTitle}
              onChange={(e) => setEditingImageTitle(e.target.value)}
              placeholder="Ej: Banner Principal"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Tamaño de Imagen</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(imageSizes).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setImageSize(key)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    imageSize === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">URL de la Imagen</label>
            <input
              type="text"
              placeholder="https://ejemplo.com/imagen.jpg"
              id="imageUrlInput"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          <button
            onClick={() => {
              const url = document.getElementById('imageUrlInput').value;
              if (url) {
                handleAddImage(url);
                document.getElementById('imageUrlInput').value = '';
              }
            }}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            ➕ Agregar Imagen
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6">📷 Galería de Imágenes ({images.length})</h3>

        {images.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-slate-400">No hay imágenes en la galería</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => {
              const sizeConfig = imageSizes[image.size] || imageSizes.normal;
              return (
                <div
                  key={image.id}
                  className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-500 transition"
                >
                  <div className="aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={image.image}
                      alt={image.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500?text=Error';
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-white mb-2">{image.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">Tamaño: {sizeConfig.label}</p>
                    <p className="text-xs text-slate-500 mb-4">
                      {new Date(image.created_at).toLocaleDateString('es-ES')}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">✏️ Editar Imagen</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Título</label>
                <input
                  type="text"
                  value={selectedImage.name}
                  onChange={(e) => setSelectedImage({ ...selectedImage, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">URL de la Imagen</label>
                <input
                  type="text"
                  value={selectedImage.image}
                  onChange={(e) => setSelectedImage({ ...selectedImage, image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Cambiar Tamaño</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(imageSizes).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedImage({ ...selectedImage, size: key })}
                      className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                        selectedImage.size === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista Previa */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Vista Previa</label>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.image}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500?text=Error';
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    handleEditImage(selectedImage.id, {
                      name: selectedImage.name,
                      image: selectedImage.image,
                      size: selectedImage.size
                    });
                    setSelectedImage(null);
                  }}
                  className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  ✅ Actualizar Producto
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
