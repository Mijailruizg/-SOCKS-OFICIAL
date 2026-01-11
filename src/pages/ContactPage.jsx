import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-4">Contacto</h1>
      <p className="text-gray-700 mb-4">Escríbenos a: contacto@socksoficial.com o usa el siguiente formulario (placeholder).</p>
      <form className="max-w-xl">
        <input className="w-full p-3 rounded-md border mb-3" placeholder="Tu nombre" />
        <input className="w-full p-3 rounded-md border mb-3" placeholder="Tu correo" />
        <textarea className="w-full p-3 rounded-md border mb-3" placeholder="Tu mensaje" rows={5} />
        <button className="px-6 py-3 bg-black text-white rounded-md">Enviar</button>
      </form>
    </div>
  );
};

export default ContactPage;
