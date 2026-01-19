import React, { useState } from 'react';

export default function ImageGallerySelector({ onSelect, currentImageUrl }) {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [fileName, setFileName] = useState('');
  const [imageSize, setImageSize] = useState({ width: '100%', height: 'auto' });
  const [galleryImages] = useState([
    'public/galeria/2.jpeg',
    'public/galeria/4.jpeg',
    'public/galeria/5.jpeg',
    'public/galeria/521320355_18072665359996750_586440822232935836_n.jpg',
    'public/galeria/cafe.jpeg',
    'public/galeria/fondo.jpeg',
    'public/galeria/logo.png',
    'public/galeria/WhatsApp Image 2026-01-11 at 00.12.00.jpeg'
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe pesar más de 5MB');
      return;
    }

    // Crear URL blob de la imagen
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setPreviewUrl(dataUrl);
      setFileName(file.name);
      onSelect(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Gallery Images Selection */}
      <div className="mb-6 pb-6 border-b border-slate-600">
        <label className="block text-sm font-medium text-slate-200 mb-3">
          O selecciona de la galería
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-40 overflow-y-auto p-2 bg-slate-700/30 rounded-lg border border-slate-600">
          {galleryImages.map((imagePath) => {
            const fileName = imagePath.split('/').pop();
            return (
              <button
                key={imagePath}
                onClick={() => {
                  setPreviewUrl(imagePath);
                  setFileName(fileName);
                  onSelect(imagePath);
                }}
                className={`p-2 rounded text-xs font-semibold transition ${
                  previewUrl === imagePath
                    ? 'bg-blue-600 text-white border border-blue-400'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
                }`}
              >
                {fileName}
              </button>
            );
          })}
        </div>
      </div>

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Selecciona una imagen de tu computadora
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg border-dashed cursor-pointer hover:bg-slate-600 transition flex items-center justify-center gap-3">
            <span className="text-2xl">📁</span>
            <div className="text-center">
              <p className="text-white font-semibold">
                {fileName || 'Haz clic para seleccionar imagen'}
              </p>
              <p className="text-xs text-slate-400">JPG, PNG, WebP • Máximo 5MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Options */}
      {previewUrl && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Vista en diferentes tamaños
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Pequeño (300px)', size: '300px' },
              { label: 'Normal (500px)', size: '500px' },
              { label: 'Grande (800px)', size: '800px' },
              { label: 'Pantalla Completa', size: '100%' }
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => setImageSize({ 
                  width: option.size, 
                  height: option.size === '100%' ? 'auto' : option.size 
                })}
                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                  imageSize.width === option.size
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div>
          <p className="text-xs text-slate-400 mb-2">Vista previa ({imageSize.width === '100%' ? 'Pantalla Completa' : imageSize.width}):</p>
          <div className="relative rounded-lg overflow-hidden border border-slate-600 bg-slate-900">
            <div style={{ maxWidth: imageSize.width, margin: '0 auto' }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300?text=Error';
                }}
              />
            </div>
            {/* Clear Button */}
            <button
              type="button"
              onClick={() => {
                setPreviewUrl('');
                setFileName('');
                onSelect('');
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
            >
              ✕ Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Manual URL Input Option */}
      <div className="mt-4 pt-4 border-t border-slate-600">
        <label className="block text-sm font-medium text-slate-200 mb-2">
          O pega URL de una imagen
        </label>
        <input
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          onChange={(e) => {
            onSelect(e.target.value);
            if (e.target.value) {
              setPreviewUrl(e.target.value);
              setFileName('URL de imagen');
            }
          }}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
