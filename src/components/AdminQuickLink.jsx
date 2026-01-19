import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminQuickLink() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ocultar en rutas /admin
  if (location.pathname.startsWith('/admin')) return null;

  // Hotspot invisible: doble-click o Ctrl+Shift+click para acceder al login admin
  const handleOpen = (e) => {
    e.stopPropagation();
    navigate('/admin/login');
  };

  return (
    <div className="w-full flex justify-end pr-6 mt-8">
      <div
        onDoubleClick={handleOpen}
        onClick={(e) => { if (e.ctrlKey && e.shiftKey) handleOpen(e); }}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
        style={{ width: 28, height: 28, opacity: 0, background: 'transparent' }}
      />
    </div>
  );
}
