'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useWeather, getWeatherIcon, getWeatherDesc } from '../hooks/useWeather';

initMercadoPago('TU_PUBLIC_KEY_AQUI', { locale: 'es-AR' });
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Category = { id: number; name: string; price: number };
type TimeSlot = { id: number; time: string; capacity?: number };

// CSS variable shortcuts for inline styles
const C = {
  bg:           'var(--t-bg)',
  bgAlt:        'var(--t-bg-alt)',
  bgCard:       'var(--t-bg-card)',
  accent:       'var(--t-accent)',
  accentHover:  'var(--t-accent-hover)',
  accentSubtle: 'var(--t-accent-subtle)',
  text:         'var(--t-text)',
  textMuted:    'var(--t-text-muted)',
  textFaint:    'var(--t-text-faint)',
  border:       'var(--t-border)',
  borderLight:  'var(--t-border-light)',
  success:      'var(--t-success)',
  radius:       'var(--t-radius)',
  radiusSm:     'var(--t-radius-sm)',
  radiusXs:     'var(--t-radius-xs)',
};

export default function BookingWidget() {
  const { t, tCategory, language } = useLanguage();
  const { getWeather, getDayWeather } = useWeather();

  const [categories, setCategories] = useState<Category[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const [upcomingDates, setUpcomingDates] = useState<Date[]>([]);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/booking-data`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setTimeSlots(data.timeSlots || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
      });

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    setUpcomingDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].toISOString().split('T')[0]);
    }
  }, []);

  const updateQuantity = (catId: number, delta: number) => {
    setCart((prev) => {
      const current = prev[catId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      return { ...prev, [catId]: next };
    });
  };

  const totalPassengers = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = categories.reduce((total, cat) => {
    return total + (cart[cat.id] || 0) * cat.price;
  }, 0);

  const handleContinue = () => {
    if (!selectedTime) return alert('Por favor, seleccioná un horario.');
    if (totalPassengers === 0) return alert('Por favor, agregá al menos un pasajero.');
    setStep(2);
  };

  const handleSubmit = async (paymentMethod: 'mercadopago' | 'transfer') => {
    if (!userName || !userEmail) return alert('Completá tus datos.');
    setIsSubmitting(true);

    const payload = {
      userName,
      userEmail,
      date: selectedDate,
      timeSlotId: selectedTime,
      paymentMethod,
      cart,
    };

    try {
      const res = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error en el servidor');

      if (data.method === 'mercadopago' && data.preferenceId) {
        setPreferenceId(data.preferenceId);
      } else if (data.method === 'transfer') {
        setSuccessData(data);
        setStep(3);
      }
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: C.textMuted }}>
        Cargando disponibilidad...
      </div>
    );
  }

  // ─── PASO 1: Selección ────────────────────────────────────────────────────
  if (step === 1) {
    const dayNames = {
      es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    };

    return (
      <div
        className="max-w-md w-full mx-auto shadow-lg overflow-hidden flex flex-col font-sans"
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: C.radius,
          color: C.text,
        }}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <h2 className="text-[28px] font-extrabold leading-tight" style={{ color: C.text }}>
            Reservá tu viaje
          </h2>
          <p className="text-[15px] mt-1" style={{ color: C.textMuted }}>
            Recorrido por la ciudad · 55 min
          </p>
        </div>

        <div className="p-6 space-y-8 flex-1">

          {/* ── Fecha ── */}
          <div className="space-y-3">
            <label className="block text-[15px] font-semibold" style={{ color: C.text }}>
              Fecha
            </label>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {upcomingDates.map((date, idx) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const dayName = dayNames[language][date.getDay()];
                const dayNum = date.getDate();
                const dayWeather = getDayWeather(dateStr);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className="flex-shrink-0 flex flex-col items-center justify-center transition-all"
                    style={{
                      width: '72px',
                      height: '96px',
                      borderRadius: C.radiusSm,
                      border: `2px solid ${isSelected ? C.accent : C.border}`,
                      background: isSelected ? C.accentSubtle : C.bgCard,
                      color: isSelected ? C.accent : C.textMuted,
                    }}
                  >
                    <span className="text-[13px] font-medium">{dayName}</span>
                    <span
                      className="text-[22px] font-bold mt-0.5"
                      style={{ color: isSelected ? C.accent : C.text }}
                    >
                      {dayNum}
                    </span>
                    {/* Weather for this day */}
                    {dayWeather ? (
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-[12px] leading-none">
                          {getWeatherIcon(dayWeather.code)}
                        </span>
                        <span
                          className="text-[11px] font-medium leading-none"
                          style={{ color: isSelected ? C.accent : C.textMuted }}
                        >
                          {dayWeather.temp}°
                        </span>
                      </div>
                    ) : (
                      <div className="h-[16px]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Horario ── */}
          <div className="space-y-3">
            <label className="block text-[15px] font-semibold" style={{ color: C.text }}>
              Horario de salida
            </label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.id;
                const lugares = slot.capacity ?? 40;
                const isFull = lugares === 0;
                const slotHour = parseInt(slot.time.split(':')[0], 10);
                const slotWeather = selectedDate
                  ? getWeather(selectedDate, slotHour)
                  : null;

                return (
                  <button
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setSelectedTime(slot.id)}
                    className="p-4 text-left transition-all"
                    style={{
                      borderRadius: C.radiusSm,
                      border: `2px solid ${
                        isFull
                          ? C.border
                          : isSelected
                          ? C.accent
                          : C.border
                      }`,
                      background: isFull
                        ? C.bgAlt
                        : isSelected
                        ? C.accentSubtle
                        : C.bgCard,
                      opacity: isFull ? 0.6 : 1,
                      cursor: isFull ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div
                      className="text-[20px] font-bold"
                      style={{ color: isFull ? C.textFaint : C.text }}
                    >
                      {slot.time}
                    </div>
                    <div
                      className="text-[14px] mt-0.5"
                      style={{ color: isFull ? C.textFaint : C.success }}
                    >
                      {isFull ? 'Completo' : `${lugares} lugares`}
                    </div>
                    {/* Weather for this time slot */}
                    {slotWeather && !isFull && (
                      <div
                        className="flex items-center gap-1 mt-2 pt-2"
                        style={{ borderTop: `1px solid ${C.border}` }}
                      >
                        <span className="text-[13px] leading-none">
                          {getWeatherIcon(slotWeather.code)}
                        </span>
                        <span
                          className="text-[11px] leading-none"
                          style={{ color: C.textMuted }}
                        >
                          {slotWeather.temp}° · {slotWeather.wind} km/h
                        </span>
                      </div>
                    )}
                    {/* Placeholder when weather is loading */}
                    {!slotWeather && !isFull && (
                      <div className="h-[24px]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Pasajeros ── */}
          <div className="space-y-1 mt-4">
            <label className="block text-[15px] font-semibold mb-2" style={{ color: C.text }}>
              Pasajeros
            </label>
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="py-4 flex justify-between items-center"
                  style={{ borderBottom: `1px solid ${C.border}` }}
                >
                  <div>
                    <div className="text-[17px] font-semibold" style={{ color: C.text }}>
                      {tCategory(cat.name)}
                    </div>
                    <div className="text-[14px] mt-0.5" style={{ color: C.textMuted }}>
                      ${cat.price.toLocaleString('es-AR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(cat.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-[24px] transition-transform active:scale-95"
                      style={{
                        borderRadius: '50%',
                        border: `1px solid ${C.borderLight}`,
                        background: C.bgCard,
                        color: C.textMuted,
                      }}
                    >
                      −
                    </button>
                    <span
                      className="w-4 text-center text-[18px] font-bold"
                      style={{ color: C.text }}
                    >
                      {cart[cat.id] || 0}
                    </span>
                    <button
                      onClick={() => updateQuantity(cat.id, 1)}
                      className="w-10 h-10 flex items-center justify-center text-[24px] transition-transform active:scale-95"
                      style={{
                        borderRadius: '50%',
                        border: `1px solid ${C.borderLight}`,
                        background: C.bgCard,
                        color: C.text,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 pt-5"
          style={{
            background: C.bgAlt,
            borderBottomLeftRadius: C.radius,
            borderBottomRightRadius: C.radius,
          }}
        >
          <div className="flex justify-between items-end mb-4">
            <div className="text-[15px]" style={{ color: C.textMuted }}>
              Total · {totalPassengers} pasajeros
            </div>
            <div className="text-[28px] font-extrabold leading-none" style={{ color: C.text }}>
              <span className="text-[14px] font-normal mr-1" style={{ color: C.textMuted }}>
                ARS
              </span>
              ${totalPrice.toLocaleString('es-AR')}
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="w-full py-[18px] font-bold text-[18px] transition-colors shadow-sm text-white"
            style={{
              background: C.accent,
              borderRadius: C.radiusSm,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accentHover)}
            onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
          >
            Continuar al pago
          </button>
        </div>
      </div>
    );
  }

  // ─── PASO 2: Datos personales y pago ─────────────────────────────────────
  if (step === 2) {
    return (
      <div
        className="max-w-md w-full mx-auto shadow-lg p-6 font-sans"
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: C.radius,
          color: C.text,
        }}
      >
        <button
          onClick={() => { setStep(1); setPreferenceId(null); }}
          className="font-semibold text-[15px] mb-6 flex items-center gap-1"
          style={{ color: C.accent }}
        >
          ← Volver
        </button>

        <h2 className="text-[24px] font-extrabold mb-6" style={{ color: C.text }}>
          Tus datos
        </h2>

        {!preferenceId && (
          <div className="space-y-5 mb-8">
            <div>
              <label
                className="block text-[15px] font-semibold mb-2"
                style={{ color: C.text }}
              >
                Nombre completo
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-4 text-[17px] focus:outline-none"
                style={{
                  borderRadius: C.radiusXs,
                  border: `1px solid ${C.borderLight}`,
                  background: C.bgCard,
                  color: C.text,
                }}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label
                className="block text-[15px] font-semibold mb-2"
                style={{ color: C.text }}
              >
                Email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-4 text-[17px] focus:outline-none"
                style={{
                  borderRadius: C.radiusXs,
                  border: `1px solid ${C.borderLight}`,
                  background: C.bgCard,
                  color: C.text,
                }}
                placeholder="juan@email.com"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {preferenceId ? (
            <div className="mt-4">
              <h3
                className="text-center font-bold mb-4"
                style={{ color: C.textMuted }}
              >
                Completá tu pago de forma segura
              </h3>
              <Wallet
                initialization={{ preferenceId: preferenceId }}
                customization={{ valueProp: 'convenience_all' }}
              />
            </div>
          ) : (
            <>
              <button
                onClick={() => handleSubmit('mercadopago')}
                disabled={isSubmitting}
                className="w-full py-[16px] font-bold text-[17px] text-white transition-colors"
                style={{ background: '#009EE3', borderRadius: C.radiusSm }}
                onMouseEnter={e => (e.currentTarget.style.background = '#008ACA')}
                onMouseLeave={e => (e.currentTarget.style.background = '#009EE3')}
              >
                {isSubmitting ? 'Procesando...' : t('book_btn_mp')}
              </button>
              <button
                onClick={() => handleSubmit('transfer')}
                disabled={isSubmitting}
                className="w-full py-[16px] font-bold text-[17px] transition-colors"
                style={{
                  background: C.bgCard,
                  border: `2px solid ${C.border}`,
                  borderRadius: C.radiusSm,
                  color: C.text,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderLight)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                Transferencia Bancaria
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── PASO 3: Confirmación de transferencia ────────────────────────────────
  if (step === 3 && successData) {
    const { reservationId, bankData } = successData;
    const whatsappMsg = `¡Hola! Hice la reserva #${reservationId} por $${totalPrice.toLocaleString('es-AR')}. Adjunto mi comprobante de transferencia.`;
    const whatsappUrl = `https://wa.me/5492901401044?text=${encodeURIComponent(whatsappMsg)}`;

    return (
      <div
        className="max-w-md w-full mx-auto shadow-lg p-8 font-sans text-center"
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: C.radius,
          color: C.text,
        }}
      >
        <div className="text-6xl mb-6">🎫</div>
        <h2 className="text-[28px] font-extrabold mb-3 leading-tight" style={{ color: C.text }}>
          {t('book_success')}
        </h2>
        <p className="mb-8 font-medium leading-relaxed" style={{ color: C.textMuted }}>
          {t('book_success_sub')}
        </p>

        <div
          className="p-6 text-left mb-8 space-y-3 text-[15px]"
          style={{
            background: C.bgCard,
            borderRadius: C.radiusSm,
            border: `1px solid ${C.border}`,
          }}
        >
          {[
            { label: 'Banco', value: bankData.bank },
            { label: 'Titular', value: bankData.titular },
            { label: 'Alias', value: bankData.alias, mono: true },
            { label: 'CBU', value: bankData.cbu, mono: true },
            { label: 'Total exacto', value: `$${totalPrice.toLocaleString('es-AR')}` },
            { label: 'Referencia', value: `Reserva #${reservationId}`, accent: true },
          ].map(({ label, value, mono, accent }) => (
            <p
              key={label}
              className="flex justify-between pb-2"
              style={{ borderBottom: `1px solid ${C.bgAlt}` }}
            >
              <span className="font-medium" style={{ color: C.textMuted }}>{label}</span>
              <span
                className={`font-bold text-right ${mono ? 'font-mono' : ''}`}
                style={{ color: accent ? C.accent : C.text }}
              >
                {value}
              </span>
            </p>
          ))}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-[18px] font-bold text-[17px] transition-colors mb-4"
          style={{
            borderRadius: C.radiusSm,
            boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
          }}
        >
          <span>💬</span> {t('book_btn_send_voucher')}
        </a>

        <button
          onClick={() => window.location.reload()}
          className="font-semibold text-[15px] transition-colors"
          style={{ color: C.accent }}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.accent)}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return null;
}
