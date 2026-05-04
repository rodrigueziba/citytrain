'use client';

import TrainScene from '@/app/components/TrainScene';
import BookingWidget from '@/app/components/BookingWidget';
import Navbar from '@/app/components/Navbar';
import Gallery from '@/app/components/Gallery';
import ThemeSelector from '@/app/components/ThemeSelector';
import { useLanguage } from '@/app/context/LanguageContext';
import { useTheme } from '@/app/context/ThemeContext';

export default function Home() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isVintage = theme === 'vintage';
  const isExpedition = theme === 'expedition';

  // Overlay sobre la escena 3D, cambia según el tema
  const sceneOverlay = isExpedition
    ? 'bg-[#0A1628]/82'
    : isVintage
    ? 'bg-[#F5F0E6]/72'
    : 'bg-[#FCFBFA]/60';

  return (
    <main
      className="relative w-full min-h-screen font-sans selection:bg-[#9E3B22]/20"
      style={{ background: 'var(--t-bg)', color: 'var(--t-text)' }}
    >
      <Navbar />

      {/* Escena 3D fija de fondo */}
      <div className="fixed inset-0 z-0">
        <TrainScene />
        <div
          className={`absolute inset-0 backdrop-blur-[2px] pointer-events-none transition-all duration-500 ${sceneOverlay}`}
        />
      </div>

      <div className="relative z-10 flex flex-col w-full pointer-events-none">

        {/* ══════════════════════════════════════════════════════
            SECCIÓN 1 · HERO + WIDGET DE RESERVAS
        ══════════════════════════════════════════════════════ */}
        <section
          id="reservas"
          className="min-h-screen flex flex-col xl:flex-row items-center justify-evenly px-4 lg:px-20 py-32 gap-12"
        >
          {/* ── Texto hero ── */}
          <div className="text-center xl:text-left drop-shadow-xl xl:w-1/2 pointer-events-auto">

            {/* ─ DISEÑO VINTAGE ─ */}
            {isVintage && (
              <>
                <div
                  className="inline-block mb-6 px-4 py-1.5 text-[11px] font-bold tracking-[0.25em] uppercase"
                  style={{
                    background: 'var(--t-bg-card)',
                    border: '1px solid var(--t-border)',
                    borderRadius: 'var(--t-radius-xs)',
                    color: 'var(--t-text-muted)',
                  }}
                >
                  — Ushuaia · Tierra del Fuego —
                </div>
                <h1
                  className="text-6xl md:text-8xl font-black mb-4 tracking-tight leading-[0.95]"
                  style={{ color: 'var(--t-text)', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Ushuaia <br />
                  <span style={{ color: 'var(--t-accent)', fontStyle: 'italic' }}>City Train</span>
                </h1>
                <p
                  className="text-xl md:text-2xl font-medium p-5 inline-block backdrop-blur-md"
                  style={{
                    background: 'var(--t-overlay-card)',
                    border: '1px dashed var(--t-border)',
                    borderRadius: 'var(--t-radius-xs)',
                    color: 'var(--t-text-muted)',
                    fontFamily: 'var(--font-playfair), Georgia, serif',
                    fontStyle: 'italic',
                  }}
                >
                  Un viaje a bordo del tren del fin del mundo.{' '}
                  <strong style={{ color: 'var(--t-accent)', fontStyle: 'normal' }}>
                    I·NOL·VI·DA·BLE
                  </strong>
                </p>
                <div
                  className="mt-6 flex items-center gap-3 xl:justify-start justify-center"
                  style={{ color: 'var(--t-text-faint)' }}
                >
                  <span
                    className="text-[11px] tracking-[0.2em] uppercase font-mono"
                    style={{ color: 'var(--t-accent)' }}
                  >
                    ✦ Est. Ushuaia · 55 min · 13 km ✦
                  </span>
                </div>
              </>
            )}

            {/* ─ DISEÑO EXPEDICIÓN ─ */}
            {isExpedition && (
              <>
                <div
                  className="inline-block mb-6 font-mono text-[11px] tracking-[0.3em] uppercase"
                  style={{ color: 'var(--t-accent)', opacity: 0.8 }}
                >
                  54°48&#x2032; S &nbsp;·&nbsp; 68°18&#x2032; O &nbsp;·&nbsp; Tierra del Fuego
                </div>
                <h1
                  className="text-6xl md:text-8xl font-thin mb-6 tracking-widest leading-[0.95] uppercase"
                  style={{ color: 'var(--t-text)', fontWeight: 200 }}
                >
                  Ushuaia <br />
                  <span style={{ color: 'var(--t-accent)' }}>City Train</span>
                </h1>
                <p
                  className="text-base md:text-lg font-light p-5 inline-block backdrop-blur-md"
                  style={{
                    background: 'var(--t-overlay-card)',
                    border: '1px solid var(--t-border)',
                    borderRadius: 'var(--t-radius-xs)',
                    color: 'var(--t-text-muted)',
                    letterSpacing: '0.04em',
                  }}
                >
                  55 minutos &nbsp;/&nbsp; 13 kilómetros &nbsp;/&nbsp;{' '}
                  <span style={{ color: 'var(--t-accent)' }}>4 salidas diarias</span>
                </p>
              </>
            )}

            {/* ─ DISEÑO ACTUAL (default) ─ */}
            {!isVintage && !isExpedition && (
              <>
                <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.95]"
                  style={{ color: 'var(--t-text)' }}
                >
                  Ushuaia <br />
                  <span style={{ color: 'var(--t-accent)' }}>City Train</span>
                </h1>
                <p
                  className="text-xl md:text-2xl font-medium backdrop-blur-md inline-block p-5 shadow-sm"
                  style={{
                    background: 'var(--t-overlay-card)',
                    border: '1px solid var(--t-border)',
                    borderRadius: '20px',
                    color: 'var(--t-text-muted)',
                  }}
                >
                  {t('hero_subtitle')}{' '}
                  <strong className="font-bold" style={{ color: 'var(--t-accent)' }}>
                    {t('hero_highlight')}
                  </strong>
                </p>
              </>
            )}
          </div>

          {/* Widget de reservas (compartido en todos los temas) */}
          <div className="xl:w-1/2 flex justify-center w-full z-20 pointer-events-auto">
            <BookingWidget />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECCIÓN 2 · GALERÍA
        ══════════════════════════════════════════════════════ */}

        {/* ── DEFAULT: card contenedor cálido ── */}
        {!isVintage && !isExpedition && (
          <section
            className="flex items-center justify-center px-4 lg:px-20 py-20"
            style={{ background: 'var(--t-overlay-section)', borderTop: '1px solid var(--t-border)' }}
          >
            <div className="w-full max-w-6xl pointer-events-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-1" style={{ background: 'var(--t-accent)' }} />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--t-text)' }}>
                  Nuestras <span style={{ color: 'var(--t-accent)' }}>Imágenes</span>
                </h2>
              </div>
              <Gallery />
            </div>
          </section>
        )}

        {/* ── VINTAGE: sección con marco de papel envejecido ── */}
        {isVintage && (
          <section
            className="flex items-center justify-center px-4 lg:px-20 py-20"
            style={{ background: 'var(--t-bg-alt)', borderTop: '1px solid var(--t-border)', borderBottom: '1px solid var(--t-border)' }}
          >
            <div className="w-full max-w-6xl pointer-events-auto">
              {/* Cabecera decorativa */}
              <div className="flex flex-col items-center mb-10 gap-3">
                <span
                  className="text-[10px] font-mono tracking-[0.3em] uppercase"
                  style={{ color: 'var(--t-text-faint)' }}
                >
                  ✦ &nbsp; Álbum de recuerdos &nbsp; ✦
                </span>
                <h2
                  className="text-3xl md:text-4xl font-black text-center"
                  style={{ color: 'var(--t-text)', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Nuestros <em style={{ color: 'var(--t-accent)' }}>Momentos</em>
                </h2>
                <div
                  className="w-32 h-px"
                  style={{
                    background: `repeating-linear-gradient(90deg, var(--t-border) 0px, var(--t-border) 6px, transparent 6px, transparent 10px)`,
                  }}
                />
              </div>
              {/* Marco estilo ticket */}
              <div
                className="p-4 md:p-6 relative"
                style={{
                  background: 'var(--t-bg-card)',
                  border: '2px dashed var(--t-border)',
                  borderRadius: 'var(--t-radius-xs)',
                }}
              >
                {/* Perforaciones en las esquinas */}
                {[
                  { top: '-8px', left: '-8px' },
                  { top: '-8px', right: '-8px' },
                  { bottom: '-8px', left: '-8px' },
                  { bottom: '-8px', right: '-8px' },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    style={{ ...pos, background: 'var(--t-bg-alt)', border: '1px solid var(--t-border)' }}
                  />
                ))}
                <Gallery />
              </div>
            </div>
          </section>
        )}

        {/* ── EXPEDITION: sección edge-to-edge minimalista ── */}
        {isExpedition && (
          <section
            className="flex items-center justify-center px-4 lg:px-20 py-16"
            style={{ background: 'var(--t-bg-alt)', borderTop: '1px solid var(--t-border)' }}
          >
            <div className="w-full max-w-6xl pointer-events-auto">
              {/* Header minimalista */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p
                    className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2"
                    style={{ color: 'var(--t-text-faint)' }}
                  >
                    Registro visual
                  </p>
                  <h2
                    className="text-2xl md:text-3xl font-light tracking-widest uppercase"
                    style={{ color: 'var(--t-text)', fontWeight: 200 }}
                  >
                    Galería
                  </h2>
                </div>
                <div
                  className="hidden md:block text-right text-[10px] font-mono tracking-[0.15em]"
                  style={{ color: 'var(--t-text-faint)' }}
                >
                  54°48&#x2032; S · 68°18&#x2032; O
                </div>
              </div>
              <div
                className="h-px w-full mb-6"
                style={{ background: 'var(--t-border)' }}
              />
              <Gallery />
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
            SECCIÓN 3 · NOSOTROS
        ══════════════════════════════════════════════════════ */}
        <section
          id="nosotros"
          className="flex items-center justify-center px-4 lg:px-20 py-24"
        >
          <div
            className="backdrop-blur-xl p-8 md:p-16 shadow-2xl w-full max-w-6xl pointer-events-auto"
            style={{
              background: 'var(--t-overlay-card)',
              border: `1px solid var(--t-border)`,
              borderRadius: 'var(--t-radius)',
            }}
          >
            {isVintage ? (
              <div className="mb-8 flex items-center gap-3 md:justify-start justify-center">
                <span
                  className="text-[11px] font-mono tracking-[0.2em] uppercase"
                  style={{ color: 'var(--t-accent)' }}
                >
                  ✦ Sobre Nosotros ✦
                </span>
                <div className="flex-1 hidden md:block" style={{
                  height: '1px',
                  background: `repeating-linear-gradient(90deg, var(--t-border) 0px, var(--t-border) 4px, transparent 4px, transparent 8px)`,
                }} />
              </div>
            ) : isExpedition ? (
              <div
                className="w-16 h-px mb-8 mx-auto md:mx-0"
                style={{ background: 'var(--t-accent)', opacity: 0.5 }}
              />
            ) : (
              <div className="w-20 h-1 mb-8 mx-auto md:mx-0" style={{ background: 'var(--t-accent)' }} />
            )}

            <h2
              className="text-4xl md:text-5xl font-black mb-8 text-center md:text-left"
              style={{ color: 'var(--t-text)' }}
            >
              {t('about_title_1')}{' '}
              <span style={{ color: 'var(--t-accent)' }}>{t('about_title_2')}</span>
            </h2>
            <p
              className="text-lg md:text-xl leading-relaxed text-center md:text-left font-medium max-w-3xl"
              style={{ color: 'var(--t-text-muted)' }}
            >
              {t('about_text')}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECCIÓN 4 · SERVICIOS
        ══════════════════════════════════════════════════════ */}
        <section
          id="servicios"
          className="min-h-screen flex items-center justify-center px-4 lg:px-20 py-24"
          style={{
            background: 'var(--t-overlay-section)',
            borderTop: '1px solid var(--t-border)',
            borderBottom: '1px solid var(--t-border)',
          }}
        >
          <div className="w-full max-w-6xl pointer-events-auto" style={{ color: 'var(--t-text)' }}>

            <h2
              className="text-4xl md:text-5xl font-black mb-16 text-center tracking-tight"
              style={{ color: 'var(--t-text)' }}
            >
              {t('services_title_1')}{' '}
              <span style={{ color: 'var(--t-accent)' }}>{t('services_title_2')}</span>
            </h2>

            {/* ─ VINTAGE: Ticket-style cards ─ */}
            {isVintage && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { num: 'I', title: t('srv_tour_title'), text: t('srv_tour_text') },
                  { num: 'II', title: t('srv_benefits_title'), text: t('srv_benefits_text') },
                  { num: 'III', title: t('srv_stats_title'), text: t('srv_stats_text') },
                ].map(({ num, title, text }) => (
                  <div
                    key={num}
                    className="p-8 relative overflow-hidden"
                    style={{
                      background: 'var(--t-bg-card)',
                      border: '2px dashed var(--t-border)',
                      borderRadius: 'var(--t-radius-xs)',
                    }}
                  >
                    {/* Perforation dots top */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-2" style={{ marginTop: '-6px' }}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          style={{ width: '8px', height: '12px', background: 'var(--t-overlay-section)', borderRadius: '0 0 6px 6px' }}
                        />
                      ))}
                    </div>
                    <div
                      className="text-[11px] font-mono tracking-[0.2em] uppercase mb-3"
                      style={{ color: 'var(--t-text-faint)' }}
                    >
                      Boleto N° {num}
                    </div>
                    <div
                      className="text-4xl font-black mb-4"
                      style={{ color: 'var(--t-accent)', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      ✦
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{ color: 'var(--t-text)', fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {title}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ─ EXPEDITION: Data-forward minimal cards ─ */}
            {isExpedition && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { num: '01', title: t('srv_tour_title'), text: t('srv_tour_text'), stat: '13 km' },
                  { num: '02', title: t('srv_benefits_title'), text: t('srv_benefits_text'), stat: '−10%' },
                  { num: '03', title: t('srv_stats_title'), text: t('srv_stats_text'), stat: '55 min' },
                ].map(({ num, title, text, stat }) => (
                  <div
                    key={num}
                    className="p-8"
                    style={{
                      background: 'var(--t-bg-card)',
                      border: '1px solid var(--t-border)',
                      borderRadius: 'var(--t-radius-xs)',
                    }}
                  >
                    <div
                      className="text-[11px] font-mono tracking-[0.2em] mb-6"
                      style={{ color: 'var(--t-text-faint)' }}
                    >
                      {num}
                    </div>
                    <div
                      className="text-3xl font-thin tracking-widest mb-4"
                      style={{ color: 'var(--t-accent)' }}
                    >
                      {stat}
                    </div>
                    <div
                      className="w-8 h-px mb-4"
                      style={{ background: 'var(--t-border-light)' }}
                    />
                    <h3 className="text-lg font-semibold mb-3 tracking-wide" style={{ color: 'var(--t-text)' }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed font-light" style={{ color: 'var(--t-text-muted)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ─ DEFAULT: Cards con emojis ─ */}
            {!isVintage && !isExpedition && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🚂', title: t('srv_tour_title'), text: t('srv_tour_text') },
                  { icon: '🎫', title: t('srv_benefits_title'), text: t('srv_benefits_text') },
                  { icon: '🗺️', title: t('srv_stats_title'), text: t('srv_stats_text') },
                ].map(({ icon, title, text }) => (
                  <div
                    key={icon}
                    className="p-10 shadow-lg transition-all"
                    style={{
                      background: 'var(--t-bg-card)',
                      border: '1px solid var(--t-border)',
                      borderRadius: 'var(--t-radius)',
                    }}
                  >
                    <div className="text-5xl mb-6">{icon}</div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--t-text)' }}>
                      {title}
                    </h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--t-text-muted)' }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECCIÓN 5 · CONTACTO
        ══════════════════════════════════════════════════════ */}
        <section
          id="contacto"
          className="flex items-center justify-center px-4 lg:px-20 py-32"
          style={{
            background: 'var(--t-bg-dark)',
            borderTop: '1px solid var(--t-border)',
          }}
        >
          <div className="w-full max-w-4xl pointer-events-auto text-center">
            {/* Vintage: decorative top */}
            {isVintage && (
              <div className="mb-6 flex items-center justify-center gap-4">
                <span
                  className="text-[11px] font-mono tracking-[0.25em] uppercase"
                  style={{ color: 'var(--t-accent)', opacity: 0.7 }}
                >
                  ✦ ✦ ✦
                </span>
              </div>
            )}
            {/* Expedition: coordinate label */}
            {isExpedition && (
              <div
                className="mb-4 text-[10px] font-mono tracking-[0.3em] uppercase"
                style={{ color: 'var(--t-text-faint)' }}
              >
                Ushuaia · Argentina
              </div>
            )}

            <h2
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ color: 'var(--t-bg)' }}
            >
              {t('contact_title')}
            </h2>
            <p
              className="text-xl mb-12 max-w-2xl mx-auto"
              style={{ color: 'var(--t-text-faint)' }}
            >
              {t('contact_text')}
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a
                href="mailto:info@ushuaiacitytrain.com"
                className="px-8 py-5 font-bold text-lg transition-all flex items-center justify-center gap-3"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--t-radius-sm)',
                  color: 'var(--t-bg)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                ✉️ {t('btn_email')}
              </a>
              <a
                href="https://wa.me/5492901401044"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-8 py-5 font-bold text-lg transition-all flex items-center justify-center gap-3"
                style={{
                  borderRadius: 'var(--t-radius-sm)',
                  boxShadow: '0 0 20px rgba(37,211,102,0.2)',
                }}
              >
                💬 {t('btn_whatsapp')}
              </a>
            </div>

            <div
              className="mt-24 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p
                className="text-sm uppercase tracking-widest font-bold"
                style={{ color: 'var(--t-text-faint)' }}
              >
                © {new Date().getFullYear()} Ushuaia City Train. Todos los derechos reservados.
              </p>
              <a
                href="/admin"
                className="text-sm font-bold uppercase tracking-widest transition-colors"
                style={{ color: 'var(--t-text-faint)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--t-bg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--t-text-faint)')}
              >
                Acceso Admin
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* Botón flotante WhatsApp */}
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

      {/* Selector de diseño (permanente) */}
      <ThemeSelector />
    </main>
  );
}
