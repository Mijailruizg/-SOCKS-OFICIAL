import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await adminLogin(email, password);
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
        setLoading(false);
      } else {
        toast({
          title: 'Éxito',
          description: 'Sesión de administrador iniciada'
        });
        
        // Esperar un poco para asegurar que el contexto se actualice
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Algo salió mal',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">Ingresa con tus credenciales de administrador</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>

          {/* Nota: credenciales de prueba eliminadas para seguridad */}
        </form>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <a href="/" className="text-slate-400 hover:text-slate-300 text-sm transition">
            ← Volver a inicio
          </a>
        </div>
      </div>
    </div>
  );
}
