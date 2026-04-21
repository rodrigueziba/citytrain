'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializamos Mercado Pago (¡ACÁ PONÉS TU PUBLIC KEY!)
initMercadoPago('TU_PUBLIC_KEY_AQUI', { locale: 'es-AR' });
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Category = { id: number; name: string; price: number };
type TimeSlot = { id: number; time: string; capacity?: number };

export default function BookingWidget() {
  const { t, tCategory, language } = useLanguage();
  
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
  
  // --- NUEVO: Estado para guardar los datos de la transferencia ---
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    fetch('${API_URL}/api/booking-data')
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
      const res = await fetch('${API_URL}/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      if (data.method === 'mercadopago' && data.preferenceId) {
        setPreferenceId(data.preferenceId);
      } else if (data.method === 'transfer') {
        // --- NUEVO: Guardamos los datos y pasamos al Paso 3 ---
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

  if (loading) return <div className="p-8 text-center text-[#222222]">Cargando disponibilidad...</div>;

  // --- UI: PASO 1 (Selección) ---
  if (step === 1) {
    return (
      <div className="bg-[#FCFBFA] border border-[#E5E0D8] rounded-[24px] max-w-md w-full mx-auto shadow-lg overflow-hidden flex flex-col text-[#222222] font-sans">
        
        <div className="p-6 pb-2">
          <h2 className="text-[28px] font-extrabold leading-tight">Reservá tu viaje</h2>
          <p className="text-[#666666] text-[15px] mt-1">Recorrido por la ciudad · 55 min</p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div className="space-y-3">
            <label className="block text-[15px] font-semibold">Fecha</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {upcomingDates.map((date, idx) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;
                const dayNames = { es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] };
                const dayName = dayNames[language][date.getDay()];
                const dayNum = date.getDate();

                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex-shrink-0 w-[72px] h-[84px] rounded-[16px] border-2 flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'border-[#9E3B22] bg-[#9E3B22]/5 text-[#9E3B22]' : 'border-[#E5E0D8] bg-white text-[#666666] hover:border-[#D1CCC5]'
                    }`}
                  >
                    <span className="text-[13px] font-medium">{dayName}</span>
                    <span className={`text-[22px] font-bold mt-0.5 ${isSelected ? 'text-[#9E3B22]' : 'text-[#222222]'}`}>{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[15px] font-semibold">Horario de salida</label>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.id;
                const lugares = slot.capacity || 40; 
                const isFull = lugares === 0;

                return (
                  <button
                    key={slot.id}
                    disabled={isFull}
                    onClick={() => setSelectedTime(slot.id)}
                    className={`p-4 rounded-[16px] border-2 text-left transition-all ${
                      isFull ? 'border-[#E5E0D8] bg-[#F7F6F2] opacity-60 cursor-not-allowed'
                      : isSelected ? 'border-[#9E3B22] bg-[#9E3B22]/5' 
                      : 'border-[#E5E0D8] bg-white hover:border-[#D1CCC5]'
                    }`}
                  >
                    <div className={`text-[20px] font-bold ${isFull ? 'text-[#999999]' : 'text-[#222222]'}`}>{slot.time}</div>
                    <div className={`text-[14px] mt-0.5 ${isFull ? 'text-[#999999]' : 'text-[#3E7B44]'}`}>
                      {isFull ? 'Completo' : `${lugares} lugares`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1 mt-4">
            <label className="block text-[15px] font-semibold mb-2">Pasajeros</label>
            <div className="divide-y divide-[#E5E0D8]">
              {categories.map((cat) => (
                <div key={cat.id} className="py-4 flex justify-between items-center">
                  <div>
                    <div className="text-[17px] font-semibold text-[#222222]">{tCategory(cat.name)}</div>
                    <div className="text-[14px] text-[#666666] mt-0.5">${cat.price.toLocaleString('es-AR')}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => updateQuantity(cat.id, -1)} className="w-10 h-10 rounded-full border border-[#D1CCC5] bg-white flex items-center justify-center text-[24px] text-[#666666] hover:bg-[#F7F6F2] active:scale-95 transition-transform">−</button>
                    <span className="w-4 text-center text-[18px] font-bold text-[#222222]">{cart[cat.id] || 0}</span>
                    <button onClick={() => updateQuantity(cat.id, 1)} className="w-10 h-10 rounded-full border border-[#D1CCC5] bg-white flex items-center justify-center text-[24px] text-[#222222] hover:bg-[#F7F6F2] active:scale-95 transition-transform">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#F4F1EB] p-6 pt-5 rounded-b-[24px]">
          <div className="flex justify-between items-end mb-4">
            <div className="text-[15px] text-[#666666]">Total · {totalPassengers} pasajeros</div>
            <div className="text-[28px] font-extrabold text-[#222222] leading-none">
              <span className="text-[14px] font-normal text-[#666666] mr-1">ARS</span>
              ${totalPrice.toLocaleString('es-AR')}
            </div>
          </div>
          <button onClick={handleContinue} className="w-full bg-[#9E3B22] hover:bg-[#8A331D] text-white py-[18px] rounded-[14px] font-bold text-[18px] transition-colors shadow-sm">
            Continuar al pago
          </button>
        </div>

      </div>
    );
  }

  // --- UI: PASO 2 (Datos Personales y Pago) ---
  if (step === 2) {
    return (
      <div className="bg-[#FCFBFA] border border-[#E5E0D8] rounded-[24px] max-w-md w-full mx-auto shadow-lg p-6 text-[#222222] font-sans">
        <button 
          onClick={() => { setStep(1); setPreferenceId(null); }} 
          className="text-[#9E3B22] font-semibold text-[15px] mb-6 flex items-center gap-1"
        >
          ← Volver
        </button>
        
        <h2 className="text-[24px] font-extrabold mb-6">Tus datos</h2>
        
        {!preferenceId && (
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-[15px] font-semibold mb-2">Nombre completo</label>
              <input 
                type="text" 
                value={userName} onChange={(e) => setUserName(e.target.value)}
                className="w-full p-4 rounded-[12px] border border-[#D1CCC5] bg-white text-[17px] focus:outline-none focus:border-[#9E3B22]"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-[15px] font-semibold mb-2">Email</label>
              <input 
                type="email" 
                value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-4 rounded-[12px] border border-[#D1CCC5] bg-white text-[17px] focus:outline-none focus:border-[#9E3B22]"
                placeholder="juan@email.com"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {preferenceId ? (
            <div className="mt-4 animate-fade-in">
              <h3 className="text-center font-bold mb-4 text-[#666666]">Completá tu pago de forma segura</h3>
              <Wallet 
                initialization={{ preferenceId: preferenceId }} 
                customization={{ texts: { valueProp: 'smart_option' } }} 
              />
            </div>
          ) : (
            <>
              <button 
                onClick={() => handleSubmit('mercadopago')} disabled={isSubmitting}
                className="w-full bg-[#009EE3] hover:bg-[#008ACA] text-white py-[16px] rounded-[14px] font-bold text-[17px] transition-colors"
              >
                {isSubmitting ? 'Procesando...' : t('book_btn_mp')}
              </button>
              <button 
                onClick={() => handleSubmit('transfer')} disabled={isSubmitting}
                className="w-full bg-white border-2 border-[#E5E0D8] hover:border-[#D1CCC5] text-[#222222] py-[16px] rounded-[14px] font-bold text-[17px] transition-colors"
              >
                Transferencia Bancaria
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- UI: PASO 3 (Éxito de Transferencia) ---
  if (step === 3 && successData) {
    const { reservationId, bankData } = successData;
    
    // Armamos el mensaje predefinido para WhatsApp
    const whatsappMsg = `¡Hola! Hice la reserva #${reservationId} por $${totalPrice.toLocaleString('es-AR')}. Adjunto mi comprobante de transferencia.`;
    const encodedMsg = encodeURIComponent(whatsappMsg);
    // Acá podés cambiar el número por el oficial del Ushuaia City Train
    const whatsappUrl = `https://wa.me/5492901401044?text=${encodedMsg}`;

    return (
      <div className="bg-[#FCFBFA] border border-[#E5E0D8] rounded-[24px] max-w-md w-full mx-auto shadow-lg p-8 text-[#222222] font-sans text-center animate-fade-in">
        <div className="text-6xl mb-6">🎫</div>
        <h2 className="text-[28px] font-extrabold mb-3 leading-tight">{t('book_success')}</h2>
        <p className="text-[#666666] mb-8 font-medium leading-relaxed">
          {t('book_success_sub')}
        </p>

        {/* Caja de datos bancarios con estilo de ticket */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] text-left mb-8 shadow-sm space-y-3 text-[15px]">
          <p className="flex justify-between border-b border-[#F4F1EB] pb-2">
            <span className="text-[#666666] font-medium">Banco</span>
            <span className="font-bold text-right">{bankData.bank}</span>
          </p>
          <p className="flex justify-between border-b border-[#F4F1EB] pb-2">
            <span className="text-[#666666] font-medium">Titular</span>
            <span className="font-bold text-right">{bankData.titular}</span>
          </p>
          <p className="flex justify-between border-b border-[#F4F1EB] pb-2">
            <span className="text-[#666666] font-medium">Alias</span>
            <span className="font-mono font-bold text-[#9E3B22] text-right">{bankData.alias}</span>
          </p>
          <p className="flex justify-between border-b border-[#F4F1EB] pb-2">
            <span className="text-[#666666] font-medium">CBU</span>
            <span className="font-mono font-bold text-[#9E3B22] text-right">{bankData.cbu}</span>
          </p>
          <p className="flex justify-between border-b border-[#F4F1EB] pb-2">
            <span className="text-[#666666] font-medium">Total exacto</span>
            <span className="font-bold text-right">${totalPrice.toLocaleString('es-AR')}</span>
          </p>
          <p className="flex justify-between pt-1">
            <span className="text-[#666666] font-medium">Referencia</span>
            <span className="font-bold text-[#9E3B22] text-right">Reserva #{reservationId}</span>
          </p>
        </div>

        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-[18px] rounded-[14px] font-bold text-[17px] transition-colors mb-4 shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
        >
          <span>💬</span> {t('book_btn_send_voucher')}
        </a>
        
        <button 
          onClick={() => window.location.reload()} 
          className="text-[#9E3B22] font-semibold text-[15px] hover:text-[#222222] transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return null;
}