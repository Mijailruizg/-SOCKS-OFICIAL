// Limpiar todo el localStorage relacionado con galería
console.log('🧹 Limpiando localStorage...');
localStorage.removeItem('gallery_images_local');
localStorage.removeItem('gallery_sync');
localStorage.removeItem('gallery_changes');
sessionStorage.clear();
console.log('✅ localStorage limpio');
