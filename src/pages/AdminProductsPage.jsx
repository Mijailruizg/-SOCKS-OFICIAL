import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import ImageGallerySelector from '@/components/ImageGallerySelector';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToSection, setAddingToSection] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [editingGalleryImage, setEditingGalleryImage] = useState(null);
  const [galleryCoverImage, setGalleryCoverImage] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c');

  const [impactoData, setImpactoData] = useState({
    heading: 'CORRE POR',
    subheading: 'EL BIEN',
    description: 'Creemos que cada paso cuenta. Por eso el 5% de cada compra se destina directamente a programas deportivos juveniles en comunidades necesitadas.',
    donated: '50K+',
    donatedLabel: 'PARES DONADOS',
    raised: 'S/ 120,000.00',
    raisedLabel: 'RECAUDADO',
    communities: '20+',
    communitiesLabel: 'COMUNIDADES',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c'
  });
  const [impactoFormData, setImpactoFormData] = useState(impactoData);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hybrid',
    price: '',
    sale_price: '',
    image_url: '',
    rating: '5',
    sizes: []
  });

  const [sectionFormData, setSectionFormData] = useState({
    id: '',
    title: '',
    description: '',
    image_url: '',
    category: ''
  });

  // Secciones predeterminadas
  const defaultSections = [
    { id: 'socks-oficial', title: 'PRODUCT', category: 'hybrid', description: 'Nuestra colección oficial de calcetines' },
    { id: 'new-arrivals', title: 'New Arrivals', category: 'new-arrivals', description: 'Los últimos lanzamientos' },
    { id: 'winter-merino', title: 'Sub 0 Winter Merino', category: 'winter', description: 'Calcetines de lana merino para invierno' },
    { id: 'terry-socks', title: 'TERRY SOCKS ESSENTIALS', category: 'terry-socks', description: 'Calcetines de algodón terrycloth' }
  ];

  useEffect(() => {
    loadData();
    loadGalleryImages();
  }, []);

  const loadGalleryImages = () => {
    const storedImages = JSON.parse(localStorage.getItem('gallery_images') || '[]');
    const coverImage = localStorage.getItem('gallery_cover_image') || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c';
    
    setGalleryImages(storedImages);
    setGalleryCoverImage(coverImage);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const productsData = await api.getProducts();
      const sectionsData = await api.getContentSections();
      
      setProducts(productsData);
      setSections(sectionsData);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter(p => (p.category || 'hybrid') === category);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionInputChange = (e) => {
    const { name, value } = e.target;
    setSectionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({
        title: 'Error',
        description: 'Por favor completa los campos requeridos',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        await api.updateProduct(editingId, {
          ...formData,
          price: parseFloat(formData.price),
          sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
          rating: parseFloat(formData.rating)
        });
        toast({
          title: 'Éxito',
          description: 'Producto actualizado correctamente'
        });
        setEditingId(null);
      } else {
        await api.addProduct({
          ...formData,
          price: parseFloat(formData.price),
          sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
          rating: parseFloat(formData.rating),
          id: Date.now().toString()
        });
        toast({
          title: 'Éxito',
          description: 'Producto agregado correctamente'
        });
      }

      setFormData({
        name: '',
        description: '',
        category: 'hybrid',
        price: '',
        sale_price: '',
        image_url: '',
        rating: '5'
      });
      
      setIsAddingProduct(false);
      await loadData();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el producto',
        variant: 'destructive'
      });
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    
    if (!sectionFormData.title) {
      toast({
        title: 'Error',
        description: 'Por favor completa el título de la sección',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Guardar en localStorage con todos los datos
      const updatedSection = {
        ...editingSection,
        title: sectionFormData.title,
        description: sectionFormData.description,
        updated_at: new Date().toISOString()
      };
      
      const updatedSections = sections.map(s =>
        s.id === editingSection.id ? updatedSection : s
      );
      
      setSections(updatedSections);
      localStorage.setItem('content_sections', JSON.stringify(updatedSections));
      
      toast({
        title: 'Éxito',
        description: 'Sección actualizada correctamente'
      });

      setSectionFormData({
        id: '',
        title: '',
        description: '',
        image_url: '',
        category: ''
      });
      setEditingSection(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la sección',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category || 'hybrid',
      price: product.price.toString(),
      sale_price: product.sale_price?.toString() || '',
      image_url: product.image_url || '',
      rating: product.rating?.toString() || '5',
      sizes: product.sizes || []
    });
    setEditingId(product.id);
    setIsAddingProduct(true);
    setImagePreview(product.image_url);
    window.scrollTo(0, 0);
  };

  const handleEditSection = (section) => {
    setSectionFormData({
      id: section.id,
      title: section.title,
      description: section.description || '',
      image_url: section.image_url || '',
      category: section.category || ''
    });
    setEditingSection(section);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.deleteProduct(id);
        toast({
          title: 'Éxito',
          description: 'Producto eliminado correctamente'
        });
        await loadData();
      } catch (err) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el producto',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingId(null);
    setAddingToSection(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      category: 'hybrid',
      price: '',
      sale_price: '',
      image_url: '',
      rating: '5',
      sizes: []
    });
  };

  const handleCancelSection = () => {
    setEditingSection(null);
    setSectionFormData({
      id: '',
      title: '',
      description: '',
      image_url: '',
      category: ''
    });
  };

  const handleAddGalleryImage = (imageUrl) => {
    if (!imageUrl) return;

    const newImage = {
      id: Date.now().toString(),
      url: imageUrl,
      created_at: new Date().toISOString()
    };

    const updatedImages = [...galleryImages, newImage];
    setGalleryImages(updatedImages);
    localStorage.setItem('gallery_images', JSON.stringify(updatedImages));

    toast({
      title: 'Éxito',
      description: 'Imagen agregada a la galería'
    });
  };

  const handleDeleteGalleryImage = (imageId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      const updatedImages = galleryImages.filter(img => img.id !== imageId);
      setGalleryImages(updatedImages);
      localStorage.setItem('gallery_images', JSON.stringify(updatedImages));
      setEditingGalleryImage(null);

      toast({
        title: 'Éxito',
        description: 'Imagen eliminada correctamente'
      });
    }
  };

  const handleUpdateGalleryImage = (imageId, newUrl) => {
    const updatedImages = galleryImages.map(img =>
      img.id === imageId ? { ...img, url: newUrl } : img
    );
    setGalleryImages(updatedImages);
    localStorage.setItem('gallery_images', JSON.stringify(updatedImages));

    toast({
      title: 'Éxito',
      description: 'Imagen actualizada correctamente'
    });
  };

  const handleUpdateCoverImage = (newUrl) => {
    setGalleryCoverImage(newUrl);
    localStorage.setItem('gallery_cover_image', newUrl);

    toast({
      title: 'Éxito',
      description: 'Portada de galería actualizada'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Editor Modal */}
      {editingSection && (
        <div className="bg-yellow-600/20 border border-yellow-600 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">✏️ Editando Sección: {editingSection.title}</h3>
          
          <form onSubmit={handleSectionSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Título</label>
              <input
                type="text"
                name="title"
                value={sectionFormData.title}
                onChange={handleSectionInputChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Descripción</label>
              <textarea
                name="description"
                value={sectionFormData.description}
                onChange={handleSectionInputChange}
                rows="2"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
              >
                Guardar Cambios de Sección
              </button>
              <button
                type="button"
                onClick={handleCancelSection}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Form */}
      {isAddingProduct && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingId ? 'Editar Producto' : `Agregar Nuevo Producto${addingToSection ? ` en ${addingToSection.title}` : ''}`}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: RUN CLUB"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Precio *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="24.00"
                  step="0.01"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Precio en Oferta</label>
                <input
                  type="number"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleInputChange}
                  placeholder="18.00"
                  step="0.01"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="hybrid">SOCKS OFICIAL</option>
                  <option value="new-arrivals">New Arrivals</option>
                  <option value="winter">Sub 0 Winter Merino</option>
                  <option value="terry-socks">TERRY SOCKS ESSENTIALS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Calificación</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="5"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Tamaños disponibles */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Tamaños Disponibles</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
                        } else {
                          setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-200 text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Imagen del Producto</label>
              <ImageGallerySelector
                currentImageUrl={formData.image_url}
                onSelect={(imagePath) => {
                  setFormData(prev => ({ ...prev, image_url: imagePath }));
                  setImagePreview(imagePath);
                }}
              />
              {imagePreview && (
                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-300 mb-2">Vista previa:</p>
                  <img src={imagePreview} alt="Vista previa" className="h-48 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el producto..."
                rows="3"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                {editingId ? 'Actualizar' : 'Agregar'} Producto
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Button */}
      {!isAddingProduct && (
        <button
          onClick={() => setIsAddingProduct(true)}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          + Agregar Nuevo Producto
        </button>
      )}

      {/* Products by Section */}
      <div className="space-y-8">
        {defaultSections.map((defaultSection) => {
          const sectionProducts = getProductsByCategory(defaultSection.category);
          const sectionData = sections.find(s => s.category === defaultSection.category);

          return (
            <div key={defaultSection.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{sectionData?.title || defaultSection.title}</h2>
                  {sectionData?.description && (
                    <p className="text-slate-400 text-sm mt-1">{sectionData.description}</p>
                  )}
                  {sectionData?.image_url && (
                    <img
                      src={sectionData.image_url}
                      alt={sectionData?.title || defaultSection.title}
                      className="mt-3 h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        description: '',
                        category: defaultSection.category,
                        price: '',
                        sale_price: '',
                        image_url: '',
                        rating: '5',
                        sizes: []
                      });
                      setAddingToSection(sectionData || defaultSection);
                      setIsAddingProduct(true);
                      window.scrollTo(0, 0);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    + Agregar
                  </button>
                  <button
                    onClick={() => handleEditSection(sectionData || defaultSection)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
                  >
                    ⚙️ Editar Sección
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-6">
                {sectionProducts.length === 0 ? (
                  <p className="text-slate-400">No hay productos en esta sección</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-slate-500 transition"
                      >
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300';
                            }}
                          />
                        )}

                        <div className="p-4">
                          <h4 className="font-bold text-white mb-2">{product.name}</h4>
                          
                          <div className="space-y-1 mb-4 text-sm text-slate-300">
                            <p className="font-semibold text-green-400">
                              ${product.price}
                              {product.sale_price && (
                                <span className="line-through ml-2 text-slate-400">
                                  ${product.sale_price}
                                </span>
                              )}
                            </p>
                            <p>⭐ {product.rating}</p>
                            {product.sizes && product.sizes.length > 0 && (
                              <p className="text-xs text-slate-400">Tamaños: {product.sizes.join(', ')}</p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
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
        })}
      </div>

      {/* Gallery Images Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Imágenes de Galería ({galleryImages.length})</h3>

        {galleryImages.length === 0 ? (
          <div className="text-center py-8 bg-slate-700/50 rounded-lg border border-slate-600">
            <p className="text-slate-400">No hay imágenes en la galería</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-slate-500 transition"
              >
                <div className="aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={image.url}
                    alt="Galería"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400?text=Error';
                    }}
                  />
                </div>

                <div className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingGalleryImage(image)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteGalleryImage(image.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition"
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

      {/* Edit Gallery Image Modal */}
      {editingGalleryImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">✏️ Editar Imagen de Galería</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nueva Imagen</label>
                <ImageGallerySelector
                  currentImageUrl={editingGalleryImage.url}
                  onSelect={(newUrl) => {
                    handleUpdateGalleryImage(editingGalleryImage.id, newUrl);
                    setEditingGalleryImage(null);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Vista Previa</label>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <img
                    src={editingGalleryImage.url}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400?text=Error';
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEditingGalleryImage(null)}
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