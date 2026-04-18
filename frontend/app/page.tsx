'use client';

import TrainScene from '@/app/components/TrainScene';
import BookingWidget from '@/app/components/BookingWidget';
import Navbar from '@/app/components/Navbar';
import Gallery from '@/app/components/Gallery';
import { useLanguage } from '@/app/context/LanguageContext';


export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative w-full min-h-screen bg-[#111111] font-sans selection:bg-[#E53935] selection:text-white">
      
      <Navbar />

      <div className="fixed inset-0 z-0">
        <TrainScene />
      </div>

      <div className="relative z-10 flex flex-col w-full pointer-events-none">
        
        {/* SECCIÓN 1: Reservas */}
        <section id="reservas" className="min-h-screen flex flex-col md:flex-row items-center justify-evenly px-4 lg:px-20 py-32 gap-10">
          <div className="text-center md:text-left drop-shadow-2xl md:w-1/2 pointer-events-auto">
            <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 tracking-tighter leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              Ushuaia <br/> <span className="text-[#E53935]">City Train</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-medium backdrop-blur-sm bg-black/30 inline-block p-4 rounded-2xl border border-white/10">
              {t('hero_subtitle')} <strong className="font-bold text-white">{t('hero_highlight')}</strong>
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center w-full z-20 pointer-events-auto">
            <BookingWidget />
          </div>
        </section>

        {/* SECCIÓN 2: Nosotros + Galería */}
        <section id="nosotros" className="min-h-screen flex items-center justify-center px-4 lg:px-20 py-20 bg-gradient-to-b from-transparent to-[#111111]/95">
          <div className="bg-[#111111]/80 backdrop-blur-xl p-8 md:p-16 rounded-[2rem] shadow-2xl border border-white/10 w-full max-w-5xl pointer-events-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              <span className="text-[#E53935]">{t('about_title_1')}</span> {t('about_title_2')}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              {t('about_text')}
            </p>
            <Gallery />
          </div>
        </section>

        {/* SECCIÓN 3: Servicios reales */}
        <section id="servicios" className="min-h-screen flex items-center justify-center px-4 lg:px-20 py-20 bg-[#111111]/95">
           <div className="w-full max-w-5xl pointer-events-auto text-white">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center">
                {t('services_title_1')} <span className="text-[#E53935]">{t('services_title_2')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#E53935]/50 transition-colors shadow-lg">
                  <div className="text-4xl mb-4">🚂</div>
                  <h3 className="text-2xl font-bold mb-4">{t('srv_tour_title')}</h3>
                  <p className="text-gray-400 text-md leading-relaxed">{t('srv_tour_text')}</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#E53935]/50 transition-colors shadow-lg">
                  <div className="text-4xl mb-4">🎫</div>
                  <h3 className="text-2xl font-bold mb-4">{t('srv_benefits_title')}</h3>
                  <p className="text-gray-400 text-md leading-relaxed">{t('srv_benefits_text')}</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#E53935]/50 transition-colors shadow-lg">
                  <div className="text-4xl mb-4">🗺️</div>
                  <h3 className="text-2xl font-bold mb-4">{t('srv_stats_title')}</h3>
                  <p className="text-gray-400 text-md leading-relaxed">{t('srv_stats_text')}</p>
                </div>
              </div>
           </div>
        </section>

        {/* SECCIÓN 4: Contacto */}
        <section id="contacto" className="flex items-center justify-center px-4 lg:px-20 py-32 bg-black border-t border-white/10">
          <div className="w-full max-w-3xl pointer-events-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{t('contact_title')}</h2>
            <p className="text-gray-400 text-lg mb-10">{t('contact_text')}</p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a href="mailto:info@ushuaiacitytrain.com" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/20 flex items-center justify-center gap-3">
                ✉️ {t('btn_email')}
              </a>
              <a href="https://wa.me/5492901401044" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                💬 {t('btn_whatsapp')}
              </a>
            </div>
            
            <p className="text-gray-600 text-sm mt-16 uppercase tracking-widest">
              © 2026 Ushuaia City Train. Todos los derechos reservados.
            </p>
          </div>
        </section>

      </div>

      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <a 
          href="https://wa.me/5492901401044?text=%20%C2%A1Hola%20Gracias%20por%20comunicarte,%20a%20la%20brevedad%20te%20responderemos" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:bg-[#1EBE5D] transition-all text-3xl"
        >
          💬
        </a>
      </div>

    </main>
  );
}
