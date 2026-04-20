'use client';

import TrainScene from '@/app/components/TrainScene';
import BookingWidget from '@/app/components/BookingWidget';
import Navbar from '@/app/components/Navbar';
import Gallery from '@/app/components/Gallery';
import { useLanguage } from '@/app/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative w-full min-h-screen bg-[#FCFBFA] font-sans selection:bg-[#9E3B22]/20 text-[#222222]">
      
      {/* NAVBAR ORIGINAL */}
      <Navbar />

      {/* ESCENA 3D DE FONDO (Con overlay claro para contraste) */}
      <div className="fixed inset-0 z-0">
        <TrainScene />
        <div className="absolute inset-0 bg-[#FCFBFA]/60 backdrop-blur-[2px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex flex-col w-full pointer-events-none">
        
        {/* SECCIÓN 1: Hero + Widget de Reservas */}
        <section id="reservas" className="min-h-screen flex flex-col xl:flex-row items-center justify-evenly px-4 lg:px-20 py-32 gap-12">
          <div className="text-center xl:text-left drop-shadow-xl xl:w-1/2 pointer-events-auto">
            <h1 className="text-6xl md:text-8xl font-black text-[#222222] mb-6 tracking-tighter leading-[0.95]">
              Ushuaia <br/> <span className="text-[#9E3B22]">City Train</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#444444] font-medium backdrop-blur-md bg-white/70 inline-block p-5 rounded-[20px] border border-[#E5E0D8] shadow-sm">
              {t('hero_subtitle')} <strong className="font-bold text-[#9E3B22]">{t('hero_highlight')}</strong>
            </p>
          </div>
          <div className="xl:w-1/2 flex justify-center w-full z-20 pointer-events-auto">
            <BookingWidget />
          </div>
        </section>

        {/* SECCIÓN 2: Nosotros + Galería */}
        <section id="nosotros" className="min-h-screen flex items-center justify-center px-4 lg:px-20 py-24">
          <div className="bg-[#FCFBFA]/90 backdrop-blur-xl p-8 md:p-16 rounded-[2rem] shadow-2xl border border-[#E5E0D8] w-full max-w-6xl pointer-events-auto">
            <div className="w-20 h-1 bg-[#9E3B22] mb-8 mx-auto md:mx-0" />
            <h2 className="text-4xl md:text-5xl font-black text-[#222222] mb-8 text-center md:text-left">
              {t('about_title_1')} <span className="text-[#9E3B22]">{t('about_title_2')}</span>
            </h2>
            <p className="text-[#444444] text-lg md:text-xl leading-relaxed mb-12 text-center md:text-left font-medium max-w-3xl">
              {t('about_text')}
            </p>
            <Gallery />
          </div>
        </section>

        {/* SECCIÓN 3: Servicios */}
        <section id="servicios" className="min-h-screen flex items-center justify-center px-4 lg:px-20 py-24 bg-[#F4F1EB]/95 border-y border-[#E5E0D8]">
           <div className="w-full max-w-6xl pointer-events-auto text-[#222222]">
              <h2 className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tight">
                {t('services_title_1')} <span className="text-[#9E3B22]">{t('services_title_2')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/90 p-10 rounded-[24px] border border-[#E5E0D8] hover:border-[#9E3B22]/50 transition-all shadow-lg">
                  <div className="text-5xl mb-6">🚂</div>
                  <h3 className="text-2xl font-bold mb-4">{t('srv_tour_title')}</h3>
                  <p className="text-[#666666] text-lg leading-relaxed">{t('srv_tour_text')}</p>
                </div>
                <div className="bg-white/90 p-10 rounded-[24px] border border-[#E5E0D8] hover:border-[#9E3B22]/50 transition-all shadow-lg">
                  <div className="text-5xl mb-6">🎫</div>
                  <h3 className="text-2xl font-bold mb-4">{t('srv_benefits_title')}</h3>
                  <p className="text-[#666666] text-lg leading-relaxed">{t('srv_benefits_text')}</p>
                </div>
                <div className="bg-white/90 p-10 rounded-[24px] border border-[#E5E0D8] hover:border-[#9E3B22]/50 transition-all shadow-lg">
                  <div className="text-5xl mb-6">🗺️</div>
                  <h3 className="text-2xl font-bold mb-4">{t('srv_stats_title')}</h3>
                  <p className="text-[#666666] text-lg leading-relaxed">{t('srv_stats_text')}</p>
                </div>
              </div>
           </div>
        </section>

        {/* SECCIÓN 4: Contacto */}
        <section id="contacto" className="flex items-center justify-center px-4 lg:px-20 py-32 bg-[#222222] border-t border-[#E5E0D8]">
          <div className="w-full max-w-4xl pointer-events-auto text-center text-[#FCFBFA]">
            <h2 className="text-4xl md:text-5xl font-black mb-6">{t('contact_title')}</h2>
            <p className="text-[#999999] text-xl mb-12 max-w-2xl mx-auto">{t('contact_text')}</p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a href="mailto:info@ushuaiacitytrain.com" className="bg-white/10 hover:bg-white/20 text-white px-8 py-5 rounded-[16px] font-bold text-lg transition-all border border-white/20 flex items-center justify-center gap-3">
                ✉️ {t('btn_email')}
              </a>
              <a href="https://wa.me/5492901401044" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-8 py-5 rounded-[16px] font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.2)]">
                💬 {t('btn_whatsapp')}
              </a>
            </div>
            
            <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[#999999] text-sm uppercase tracking-widest font-bold">
                © {new Date().getFullYear()} Ushuaia City Train. Todos los derechos reservados.
              </p>
              <a href="/admin" className="text-[#999999] hover:text-white text-sm font-bold uppercase tracking-widest transition-colors">
                Acceso Admin
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* BOTÓN FLOTANTE ORIGINAL DE WHATSAPP */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <a 
          href="https://wa.me/5492901401044?text=%20%C2%A1Hola%20Gracias%20por%20comunicarte,%20a%20la%20brevedad%20te%20responderemos" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:bg-[#1EBE5D] transition-transform text-3xl"
        >
          💬
        </a>
      </div>

    </main>
  );
}