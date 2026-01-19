import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import ImageGallerySelector from '@/components/ImageGallerySelector';

export default function AdminContentPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: '',
    button_link: '',
    section_type: 'hero'
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await api.getContentSections();
      setSections(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las secciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast({
        title: 'Error',
        description: 'Por favor completa el título',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        await api.updateContentSection(editingId, formData);
        toast({
          title: 'Éxito',
          description: 'Sección actualizada correctamente'
        });
        setEditingId(null);
      } else {
        await api.addContentSection({
          ...formData,
          id: Date.now().toString()
        });
        toast({
          title: 'Éxito',
          description: 'Sección agregada correctamente'
        });
      }

      resetForm();
      await loadSections();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la sección',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      button_text: '',
      button_link: '',
      section_type: 'hero'
    });
  };

  const handleEdit = (section) => {
    setFormData(section);
    setEditingId(section.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sección?')) {
      try {
        await api.deleteContentSection(id);
        toast({
          title: 'Éxito',
          description: 'Sección eliminada correctamente'
        });
        await loadSections();
      } catch (err) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la sección',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const sectionTypes = [
    { value: 'hero', label: '🎬 Hero (Portada Principal)' },
    { value: 'banner', label: '🖼️ Banner' },
    { value: 'product-section', label: '👕 Sección de Productos' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando secciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {editingId || true && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingId ? 'Editar Sección' : 'Agregar Nueva Sección de Contenido'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section Type */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Tipo de Sección *
              </label>
              <select
                name="section_type"
                value={formData.section_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {sectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: NEW COLLECTION 2026"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Ej: ELEVATE YOUR STRIDE"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleInputChange}
                  placeholder="Ej: SHOP NOW"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Button Link */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Link del Botón
                </label>
                <input
                  type="text"
                  name="button_link"
                  value={formData.button_link}
                  onChange={handleInputChange}
                  placeholder="Ej: /shop"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe la sección..."
                rows="3"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Imagen de la Sección
              </label>

              <ImageGallerySelector
                currentImageUrl={formData.image_url}
                onSelect={(imagePath) => {
                  setFormData(prev => ({
                    ...prev,
                    image_url: imagePath
                  }));
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                {editingId ? 'Actualizar' : 'Agregar'} Sección
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Content Sections */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">
          Secciones de Contenido ({sections.length})
        </h3>

        {sections.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-slate-400">No hay secciones aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition"
              >
                <div className="p-4">
                  {/* Section Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs font-semibold rounded">
                          {sectionTypes.find(t => t.value === section.section_type)?.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-white mb-1">{section.title}</h4>
                      {section.subtitle && (
                        <p className="text-slate-400 text-sm">{section.subtitle}</p>
                      )}
                    </div>
                    {section.image_url && (
                      <img
                        src={section.image_url}
                        alt={section.title}
                        className="w-32 h-24 object-cover rounded ml-4"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    )}
                  </div>

                  {/* Description */}
                  {section.description && (
                    <p className="text-slate-300 text-sm mb-4">{section.description}</p>
                  )}

                  {/* Button Info */}
                  {section.button_text && (
                    <div className="mb-4 text-sm text-slate-400">
                      <p>Botón: {section.button_text} → {section.button_link}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
