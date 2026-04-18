'use client';
import { useEffect, useState } from 'react';

type Category = { id: number; name: string; price: number };
type TimeSlot = { id: number; time: string };

export default function BookingWidget() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transfer'>('mercadopago');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTransferDetails, setShowTransferDetails] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/booking-data')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setTimeSlots(data.timeSlots);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  const updateQuantity = (categoryId: number, delta: number) => {
    setCart((prev) => {
      const current = prev[categoryId] || 0;
      const newQuantity = Math.max(0, current + delta);
      return { ...prev, [categoryId]: newQuantity };
    });
  };

  const totalPrice = categories.reduce((total, cat) => {
    return total + (cart[cat.id] || 0) * cat.price;
  }, 0);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    const payload = { userName, userEmail, date: selectedDate, timeSlotId: selectedTime, paymentMethod, cart };

    try {
      const response = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.method === 'mercadopago' && data.init_point) {
          window.location.href = data.init_point;
        } else if (data.method === 'transfer') {
          setShowTransferDetails(data);
        }
      } else {
        alert(`Error al crear la reserva: ${data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error enviando reserva:', error);
      alert('Hubo un problema de conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedDate && selectedTime && totalPrice > 0 && userName && userEmail;

  // --- VISTA ALTERNATIVA: ÉXITO TRANSFERENCIA ---
  if (showTransferDetails) {
    return (
      <div className="bg-[#111111]/80 backdrop-blur-xl p-8 rounded-[2rem] text-white text-center border border-white/10 w-full max-w-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">¡Reserva Recibida!</h2>
        <p className="mb-8 text-gray-400 text-sm leading-relaxed">
          Para confirmar tu lugar, realizá la transferencia y enviá el comprobante por WhatsApp.
        </p>
        
        <div className="bg-black/50 p-6 rounded-2xl text-left space-y-3 border border-white/5 mb-8 backdrop-blur-sm">
          <p className="flex justify-between"><span className="text-gray-400">Titular:</span> <span className="font-medium">{showTransferDetails.bankData.titular}</span></p>
          <p className="flex justify-between"><span className="text-gray-400">Banco:</span> <span className="font-medium">{showTransferDetails.bankData.bank}</span></p>
          <p className="flex justify-between"><span className="text-gray-400">Alias:</span> <span className="font-medium tracking-wider">{showTransferDetails.bankData.alias}</span></p>
          <p className="flex justify-between"><span className="text-gray-400">CBU:</span> <span className="font-medium">{showTransferDetails.bankData.cbu}</span></p>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-gray-400">Total a transferir:</span>
            <span className="text-[#E53935] font-extrabold text-2xl">${totalPrice.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <a 
          href={`https://wa.me/5492901402272?text=Hola!%20Env%C3%ADo%20comprobante%20de%20la%20reserva%20%23${showTransferDetails.reservationId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-1"
        >
          <span>Enviar comprobante por WhatsApp</span>
        </a>
      </div>
    );
  }

  // --- VISTA PRINCIPAL: FORMULARIO ---
  return (
    <div className="bg-[#111111]/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-lg pointer-events-auto text-white">
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-tight">Armá tu Viaje</h2>

      {/* 1. Selección de Fecha */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">¿Cuándo viajás?</label>
        {/* Usamos color-scheme: dark para que el calendario nativo sea oscuro */}
        <input 
          type="date" 
          style={{ colorScheme: 'dark' }}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all cursor-pointer"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* 2. Selección de Horario */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Horario</label>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedTime(slot.id)}
              className={`py-3 px-4 rounded-xl font-bold transition-all border ${
                selectedTime === slot.id 
                  ? 'bg-[#E53935] border-[#E53935] text-white shadow-[0_0_15px_rgba(229,57,53,0.4)] scale-[1.02]' 
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {slot.time} hs
            </button>
          ))}
        </div>
      </div>

      {/* 3. Selección de Pasajeros */}
      <div className="mb-6 space-y-3">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Pasajeros</label>
        {categories.map((cat) => (
          <div key={cat.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 transition-all hover:border-white/20">
            <div>
              <p className="font-bold text-md text-gray-100">{cat.name}</p>
              <p className="text-sm text-[#E53935] font-semibold mt-0.5">${cat.price.toLocaleString('es-AR')}</p>
            </div>
            <div className="flex items-center gap-3 bg-black/30 p-1.5 rounded-full border border-white/5">
              <button 
                onClick={() => updateQuantity(cat.id, -1)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#E53935] font-bold text-lg transition-colors"
              >−</button>
              <span className="w-6 text-center font-bold text-lg">{cart[cat.id] || 0}</span>
              <button 
                onClick={() => updateQuantity(cat.id, 1)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#E53935] font-bold text-lg transition-colors"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Datos del Usuario */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Nombre Completo</label>
          <input 
            type="text" 
            placeholder="Ej: Juan Pérez"
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Email</label>
          <input 
            type="email" 
            placeholder="juan@email.com"
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
      </div>

      {/* 5. Método de Pago */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Método de Pago</label>
        <div className="flex gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10">
          <button 
            onClick={() => setPaymentMethod('mercadopago')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              paymentMethod === 'mercadopago' 
                ? 'bg-[#009EE3] text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            MercadoPago
          </button>
          <button 
            onClick={() => setPaymentMethod('transfer')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              paymentMethod === 'transfer' 
                ? 'bg-white/20 text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Transferencia
          </button>
        </div>
      </div>

      {/* 6. Total y Botón de Pago */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex justify-between items-end mb-6">
          <span className="text-gray-300 font-medium text-lg">Total final:</span>
          <span className="text-4xl font-extrabold text-[#E53935] drop-shadow-[0_2px_10px_rgba(229,57,53,0.3)]">
            ${totalPrice.toLocaleString('es-AR')}
          </span>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-[#E53935] to-[#C62828] text-white py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all hover:shadow-[0_8px_25px_rgba(229,57,53,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting 
            ? 'Procesando...' 
            : paymentMethod === 'mercadopago' 
              ? 'Pagar con MercadoPago' 
              : 'Confirmar Reserva'
          }
        </button>
      </div>
    </div>
  );
}
