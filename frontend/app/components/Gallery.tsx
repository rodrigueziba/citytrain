'use client';
import { useState, useEffect } from 'react';

// Fotos de prueba (luego las cambias por las tuyas en la carpeta /public)
const images = [
  "https://images.unsplash.com/photo-1496262967815-132206202600?q=80&w=1200&auto=format&fit=crop", // Tren nieve
  "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1200&auto=format&fit=crop", // Paisaje sur
  "https://images.unsplash.com/photo-1541815143393-27eb8451f28b?q=80&w=1200&auto=format&fit=crop"  // Tren bosque
];

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para que cambie sola cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group shadow-2xl border border-white/10 mt-8">
      
      {/* Contenedor de las imágenes */}
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img 
              src={src} 
              alt={`Galería Ushuaia City Train ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {/* Sombra interna para darle profundidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Controles: Flechas (aparecen al pasar el mouse) */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#E53935] text-white w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
      >
        &#10094;
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#E53935] text-white w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
      >
        &#10095;
      </button>

      {/* Indicadores (Puntitos abajo) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {images.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-[#E53935] w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
