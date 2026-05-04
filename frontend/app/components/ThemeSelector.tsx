'use client';
import { useTheme, ThemeId } from '../context/ThemeContext';

interface ThemeMeta {
  id: ThemeId;
  name: string;
  bg: string;
  card: string;
  accent: string;
  dark: boolean;
}

const THEMES: ThemeMeta[] = [
  {
    id: 'default',
    name: 'Actual',
    bg: '#FCFBFA',
    card: '#fff',
    accent: '#9E3B22',
    dark: false,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    bg: '#F5F0E6',
    card: '#FBF7EF',
    accent: '#8B1A1A',
    dark: false,
  },
  {
    id: 'expedition',
    name: 'Expedición',
    bg: '#0A1628',
    card: '#0F1F38',
    accent: '#B8D4F0',
    dark: true,
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="fixed z-50 pointer-events-auto"
      style={{ bottom: '104px', left: '16px' }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 0, 0, 0.07)',
          borderRadius: '20px',
          padding: '12px 14px 10px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          minWidth: '216px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px' }}>🎨</span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#999',
          }}>
            Diseño de pantalla
          </span>
        </div>

        {/* Theme cards */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={`Cambiar a diseño ${t.name}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 4px 5px',
                  borderRadius: '12px',
                  border: `2px solid ${isActive ? t.accent : 'transparent'}`,
                  background: isActive ? `${t.accent}12` : 'rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                }}
              >
                {/* Preview thumbnail */}
                <div style={{
                  width: '52px',
                  height: '38px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: t.dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  {/* Background */}
                  <div style={{ position: 'absolute', inset: 0, background: t.bg }} />

                  {/* Simulated card element */}
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    right: '5px',
                    height: '16px',
                    borderRadius: t.id === 'vintage' ? '2px' : t.id === 'expedition' ? '1px' : '5px',
                    background: t.card,
                    opacity: 0.85,
                    border: t.id === 'vintage'
                      ? `1px dashed ${t.accent}60`
                      : t.id === 'expedition'
                      ? `1px solid ${t.accent}20`
                      : '1px solid rgba(0,0,0,0.05)',
                  }} />

                  {/* Accent bottom strip */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '9px',
                    background: t.accent,
                  }} />

                  {/* Vintage: decorative line dots */}
                  {t.id === 'vintage' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '9px',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `repeating-linear-gradient(90deg, ${t.accent} 0px, ${t.accent} 2px, transparent 2px, transparent 5px)`,
                      opacity: 0.4,
                    }} />
                  )}

                  {/* Expedition: coordinate label */}
                  {t.id === 'expedition' && (
                    <div style={{
                      position: 'absolute',
                      top: '3px',
                      left: '4px',
                      fontSize: '4px',
                      color: t.accent,
                      fontFamily: 'monospace',
                      opacity: 0.7,
                      letterSpacing: '0.05em',
                    }}>
                      54°S
                    </div>
                  )}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '9px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? t.accent : '#888',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.25s',
                }}>
                  {t.name}
                </span>

                {/* Active indicator dot */}
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: isActive ? t.accent : 'transparent',
                  transition: 'background 0.25s',
                  marginTop: '-3px',
                }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
