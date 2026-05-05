'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const isDefault = theme === 'default' || !theme;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = isDefault
    ? scrolled || mobileMenuOpen
      ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#e5e5e7] py-4'
      : 'bg-white/85 backdrop-blur-sm py-6'
    : scrolled || mobileMenuOpen
      ? 'bg-[#111111]/95 backdrop-blur-md shadow-lg border-b border-white/10 py-4'
      : 'bg-transparent py-6';

  const logoMain = isDefault ? 'text-[#000d10]' : 'text-white';
  const logoAccent = isDefault ? 'text-[#bc7155]' : 'text-[#E53935]';

  const linkColor = isDefault
    ? 'text-[#000d10]/60 hover:text-[#000d10]'
    : 'text-gray-300 hover:text-white';

  const langActive = isDefault ? 'bg-[#bc7155] text-white' : 'bg-[#E53935] text-white';
  const langInactive = isDefault
    ? 'text-[#8e8e95] hover:text-[#000d10] bg-[#000d10]/5'
    : 'text-gray-400 hover:text-white bg-white/10';

  const mobileBg = isDefault
    ? 'bg-white/98 border-b border-[#e5e5e7]'
    : 'bg-[#111111]/95 border-b border-white/10';

  const mobileLinkColor = isDefault ? 'text-[#000d10]/70 hover:text-[#000d10]' : 'text-gray-300 hover:text-white';
  const mobileDivider = isDefault ? 'border-t border-[#e5e5e7]' : 'border-t border-white/10';
  const hamburgerColor = isDefault ? 'text-[#000d10]' : 'text-white';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <div className={`text-2xl font-extrabold tracking-tight z-50 ${logoMain}`}>
          City <span className={logoAccent}>Train</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#reservas" className={`text-sm font-bold uppercase tracking-widest transition-colors ${linkColor}`}>{t('nav_reservas')}</a>
          <a href="#nosotros" className={`text-sm font-bold uppercase tracking-widest transition-colors ${linkColor}`}>{t('nav_nosotros')}</a>
          <a href="#servicios" className={`text-sm font-bold uppercase tracking-widest transition-colors ${linkColor}`}>{t('nav_servicios')}</a>
          <a href="#contacto" className={`text-sm font-bold uppercase tracking-widest transition-colors ${linkColor}`}>{t('nav_contacto')}</a>
        </div>

        {/* Language + hamburger */}
        <div className="flex items-center gap-4 z-50">
          <div className="hidden md:flex gap-2">
            <button onClick={() => setLanguage('es')} className={`text-xs font-bold px-2.5 py-1 rounded transition-all ${language === 'es' ? langActive : langInactive}`}>ES</button>
            <button onClick={() => setLanguage('en')} className={`text-xs font-bold px-2.5 py-1 rounded transition-all ${language === 'en' ? langActive : langInactive}`}>EN</button>
            <button onClick={() => setLanguage('pt')} className={`text-xs font-bold px-2.5 py-1 rounded transition-all ${language === 'pt' ? langActive : langInactive}`}>PT</button>
          </div>

          <button
            className={`md:hidden p-2 ${hamburgerColor}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-full left-0 w-full transition-all duration-300 overflow-hidden ${mobileBg} ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
        <div className="flex flex-col items-center gap-6">
          <a href="#reservas" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${mobileLinkColor}`}>{t('nav_reservas')}</a>
          <a href="#nosotros" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${mobileLinkColor}`}>{t('nav_nosotros')}</a>
          <a href="#servicios" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${mobileLinkColor}`}>{t('nav_servicios')}</a>
          <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${mobileLinkColor}`}>{t('nav_contacto')}</a>

          <div className={`flex gap-4 pt-4 w-1/2 justify-center ${mobileDivider}`}>
            <button onClick={() => { setLanguage('es'); setMobileMenuOpen(false); }} className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${language === 'es' ? langActive : langInactive}`}>ES</button>
            <button onClick={() => { setLanguage('en'); setMobileMenuOpen(false); }} className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${language === 'en' ? langActive : langInactive}`}>EN</button>
            <button onClick={() => { setLanguage('pt'); setMobileMenuOpen(false); }} className={`text-xs font-bold px-3 py-1.5 rounded transition-all ${language === 'pt' ? langActive : langInactive}`}>PT</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
