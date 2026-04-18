'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Estado para el menú de celular
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled || mobileMenuOpen ? 'bg-[#111111]/95 backdrop-blur-md shadow-lg border-b border-white/10 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-extrabold text-white tracking-tight z-50">
          City <span className="text-[#E53935]">Train</span>
        </div>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#reservas" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav_reservas')}</a>
          <a href="#nosotros" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav_nosotros')}</a>
          <a href="#servicios" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav_servicios')}</a>
          <a href="#contacto" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest transition-colors">{t('nav_contacto')}</a>
        </div>

        {/* --- IDIOMAS Y MENÚ HAMBURGUESA --- */}
        <div className="flex items-center gap-4 z-50">
          {/* Idiomas (Desktop) */}
          <div className="hidden md:flex gap-2">
            <button onClick={() => setLanguage('es')} className={`text-xs font-bold px-2.5 py-1 rounded transition-all ${language === 'es' ? 'bg-[#E53935] text-white' : 'text-gray-400 hover:text-white bg-white/10'}`}>ES</button>
            <button onClick={() => setLanguage('en')} className={`text-xs font-bold px-2.5 py-1 rounded transition-all ${language === 'en' ? 'bg-[#E53935] text-white' : 'text-gray-400 hover:text-white bg-white/10'}`}>EN</button>
            <button onClick={() => setLanguage('pt')} className={`text-xs font-bold px-2.5 py-1 rounded transition-all ${language === 'pt' ? 'bg-[#E53935] text-white' : 'text-gray-400 hover:text-white bg-white/10'}`}>PT</button>
          </div>

          {/* Botón Hamburguesa (Mobile) */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {/* Ícono simple hecho con SVG */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* --- MOBILE NAV MENU --- */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-[#111111]/95 border-b border-white/10 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
        <div className="flex flex-col items-center gap-6">
          <a href="#reservas" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest">{t('nav_reservas')}</a>
          <a href="#nosotros" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest">{t('nav_nosotros')}</a>
          <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest">{t('nav_servicios')}</a>
          <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest">{t('nav_contacto')}</a>
          
          {/* Idiomas en Mobile */}
          <div className="flex gap-4 pt-4 border-t border-white/10 w-1/2 justify-center">
            <button onClick={() => {setLanguage('es'); setMobileMenuOpen(false);}} className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${language === 'es' ? 'bg-[#E53935] text-white' : 'text-gray-400 bg-white/10'}`}>ES</button>
            <button onClick={() => {setLanguage('en'); setMobileMenuOpen(false);}} className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${language === 'en' ? 'bg-[#E53935] text-white' : 'text-gray-400 bg-white/10'}`}>EN</button>
            <button onClick={() => {setLanguage('pt'); setMobileMenuOpen(false);}} className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${language === 'pt' ? 'bg-[#E53935] text-white' : 'text-gray-400 bg-white/10'}`}>PT</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
