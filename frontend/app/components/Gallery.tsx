'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const SLIDES = [
  {
    src: '/gallery/banner-1.jpg',
    alt: 'Una hora de un viaje I-NOL-VI-DA-BLE',
    caption: 'Una experiencia única en el Fin del Mundo',
  },
  {
    src: '/gallery/banner-2.jpg',
    alt: 'Viví con nosotros la experiencia #CityTrain',
    caption: 'Viví la experiencia #CityTrain',
  },
  {
    src: '/gallery/banner-3.jpg',
    alt: 'Conocé Ushuaia de la mejor forma',
    caption: 'Conocé Ushuaia de la mejor forma',
  },
];

const AUTOPLAY_MS = 5500;

export default function Gallery() {
  const { theme } = useTheme();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(SLIDES.map(() => false));
  const [errors, setErrors] = useState<boolean[]>(SLIDES.map(() => false));

  const rafRef = useRef<number | null>(null);
  const startRef = useRef(Date.now());
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const accent =
    theme === 'vintage'
      ? '#8B1A1A'
      : theme === 'expedition'
      ? '#B8D4F0'
      : '#bc7155';

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    setProgress(0);
    startRef.current = Date.now();
  }, []);

  const next = useCallback(
    () => goTo((active + 1) % SLIDES.length),
    [active, goTo]
  );
  const prev = useCallback(
    () => goTo((active - 1 + SLIDES.length) % SLIDES.length),
    [active, goTo]
  );

  // Autoplay con RAF para barra de progreso suave
  useEffect(() => {
    if (paused) return;
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActive(a => (a + 1) % SLIDES.length);
        setProgress(0);
        startRef.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, active]);

  // Teclado
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev]);

  // Swipe touch
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const markLoaded = (i: number) =>
    setLoaded(prev => prev.map((v, idx) => (idx === i ? true : v)));
  const markError = (i: number) =>
    setErrors(prev => prev.map((v, idx) => (idx === i ? true : v)));

  const allErrors = errors.every(Boolean);

  return (
    <div
      className="w-full mt-8 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Imagen principal ── */}
      <div
        className="relative w-full overflow-hidden shadow-2xl"
        style={{
          borderRadius: 'var(--t-radius)',
          aspectRatio: '16 / 7',
          minHeight: '220px',
          background: 'var(--t-bg-alt)',
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Placeholder vacío si todas las imágenes fallan */}
        {allErrors && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ color: 'var(--t-text-faint)' }}
          >
            <span className="text-4xl">🖼️</span>
            <p className="text-sm font-medium text-center px-4">
              Agregá tus imágenes en{' '}
              <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--t-border)' }}>
                /public/gallery/
              </code>
            </p>
          </div>
        )}

        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: active === i ? 1 : 0,
              transition: 'opacity 0.75s cubic-bezier(0.4,0,0.2,1)',
              zIndex: active === i ? 1 : 0,
            }}
          >
            {!errors[i] && (
              <img
                src={slide.src}
                alt={slide.alt}
                onLoad={() => markLoaded(i)}
                onError={() => markError(i)}
                className="w-full h-full object-cover"
                draggable={false}
                style={{
                  opacity: loaded[i] ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              />
            )}

            {/* Gradiente inferior para caption */}
            {loaded[i] && !errors[i] && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, transparent 65%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        ))}

        {/* ── Contador ── */}
        <div
          className="absolute top-4 right-5 z-10 font-mono text-sm font-semibold"
          style={{
            color: 'rgba(255,255,255,0.92)',
            textShadow: '0 1px 8px rgba(0,0,0,0.7)',
            letterSpacing: '0.06em',
          }}
        >
          {String(active + 1).padStart(2, '0')}
          <span style={{ opacity: 0.45 }}>
            &thinsp;/&thinsp;{String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>

        {/* ── Flechas ── */}
        {(['prev', 'next'] as const).map(dir => (
          <NavArrow
            key={dir}
            direction={dir}
            accent={accent}
            onClick={dir === 'prev' ? prev : next}
          />
        ))}

        {/* ── Caption ── */}
        {loaded[active] && !errors[active] && (
          <div
            className="absolute bottom-5 left-5 right-16 z-10"
            style={{
              color: 'rgba(255,255,255,0.92)',
              textShadow: '0 1px 8px rgba(0,0,0,0.7)',
            }}
          >
            <p className="text-sm md:text-base font-semibold tracking-wide">
              {SLIDES[active].caption}
            </p>
          </div>
        )}

        {/* ── Indicadores de puntos (mobile) ── */}
        <div className="absolute bottom-4 right-5 z-10 flex gap-2 md:hidden">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: active === i ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: active === i ? accent : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease',
                border: 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Thumbnails (desktop) ── */}
      <div className="hidden md:flex gap-3 mt-3">
        {SLIDES.map((slide, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative flex-1 overflow-hidden"
              style={{
                height: '72px',
                borderRadius: 'var(--t-radius-xs)',
                border: `2px solid ${isActive ? accent : 'transparent'}`,
                outline: isActive ? `3px solid ${accent}30` : 'none',
                outlineOffset: '2px',
                opacity: isActive ? 1 : 0.45,
                transform: isActive ? 'scale(1.025)' : 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                background: 'var(--t-bg-alt)',
              }}
            >
              {!errors[i] && (
                <img
                  src={slide.src}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}
              {errors[i] && (
                <div
                  className="w-full h-full flex items-center justify-center text-[10px]"
                  style={{ color: 'var(--t-text-faint)' }}
                >
                  {i + 1}
                </div>
              )}
              {/* Barra de progreso */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 h-[3px]"
                  style={{
                    width: `${progress}%`,
                    background: accent,
                    boxShadow: `0 0 6px ${accent}99`,
                    transition: 'none',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Componente flecha de navegación ──────────────────────────────────────────
function NavArrow({
  direction,
  accent,
  onClick,
}: {
  direction: 'prev' | 'next';
  accent: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
      style={{
        [direction === 'prev' ? 'left' : 'right']: '14px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: hover ? accent + 'CC' : 'rgba(0,0,0,0.38)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${hover ? accent : 'rgba(255,255,255,0.18)'}`,
        color: 'white',
        fontSize: '24px',
        lineHeight: 1,
        fontWeight: 300,
        transition: 'all 0.2s ease',
      }}
    >
      {direction === 'prev' ? '‹' : '›'}
    </button>
  );
}
