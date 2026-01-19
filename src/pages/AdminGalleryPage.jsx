import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import ImageGallerySelector from '@/components/ImageGallerySelector';
import { syncManager } from '@/lib/syncManager';

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

    // Escuchar cambios de galería desde otros tabs/dispositivos
    const unsubscribe = syncManager.onSync('gallery_images', (updatedImages) => {
      setImages(updatedImages);
      toast({
        title: 'Sincronizado',
        description: 'La galería ha sido actualizada desde otro dispositivo'
      });
    });

    return unsubscribe;
  }, [toast]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const storedImages = syncManager.load('gallery_images');
      setImages(storedImages);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las imágenes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = (imageUrl) => {
    if (!imageUrl) return;

    const newImage = {
      id: Date.now().toString(),
      url: imageUrl,
      title: editingImageTitle || 'Nueva imagen',
      size: imageSize,
      created_at: new Date().toISOString(),
      cacheBuster: Date.now()
    };

    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    syncManager.saveAndSync('gallery_images', updatedImages);

    toast({
      title: 'Éxito',
      description: 'Imagen agregada. Se mostrará en todos los dispositivos en segundos.'
    });

    setEditingImageTitle('');
    setImageSize('normal');
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      syncManager.saveAndSync('gallery_images', updatedImages);
      setSelectedImage(null);

      toast({
        title: 'Éxito',
        description: 'Imagen eliminada en todos los dispositivos'
      });
    }
  };

  const handleEditImage = (imageId, newUrl) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { 
        ...img, 
        url: newUrl,
        updated_at: new Date().toISOString(),
        cacheBuster: Date.now()
      } : img
    );
    setImages(updatedImages);
    syncManager.saveAndSync('gallery_images', updatedImages);

    toast({
      title: 'Éxito',
      description: 'Imagen actualizada. Se sincronizará en todos tus dispositivos automáticamente.'
    });
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
            <label className="block text-sm font-medium text-slate-200 mb-2">Selecciona una Imagen</label>
            <ImageGallerySelector
              currentImageUrl=""
              onSelect={handleAddImage}
            />
          </div>
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
                      src={image.url}
                      alt={image.title}
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
                    <h4 className="font-bold text-white mb-2">{image.title}</h4>
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
                  value={selectedImage.title}
                  onChange={(e) => setSelectedImage({ ...selectedImage, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nueva Imagen</label>
                <ImageGallerySelector
                  currentImageUrl={selectedImage.url}
                  onSelect={(newUrl) => setSelectedImage({ ...selectedImage, url: newUrl })}
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
                    src={selectedImage.url}
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
                    handleEditImage(selectedImage.id, selectedImage.url);
                    setSelectedImage(null);
                  }}
                  className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  ✅ Guardar Cambios
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
