'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// CORREGIDO: Adaptamos el tipo a lo que devuelve tu backend
type Reservation = {
  id: number;
  userName: string;
  userEmail: string;
  date: string;
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  timeSlot: { time: string };
  tickets: { 
    quantity: number;
    ticketCategory: { name: string; price: number };
  }[];
};

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/admin/reservations')
      .then((res) => res.json())
      .then((data) => {
        // ESCUDO: Verificamos si la respuesta es realmente una lista (Array)
        if (Array.isArray(data)) {
          setReservations(data);
        } else {
          // Si no es una lista, imprimimos el error real en consola y dejamos la tabla vacía
          console.error('⚠️ El backend no devolvió una lista. Esto devolvió:', data);
          setReservations([]); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando reservas:', err);
        setReservations([]); // Escudo en caso de que el servidor esté apagado
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <p className="text-xl font-bold animate-pulse">Cargando Baticueva...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white p-8 md:p-16">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Panel de <span className="text-[#E53935]">Control</span></h1>
            <p className="text-gray-400 mt-2">Gestión de reservas de Ushuaia City Train</p>
          </div>
          <Link href="/" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-all text-sm">
            ← Volver al sitio
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-lg">
            <h3 className="text-gray-400 font-medium mb-1">Total Reservas</h3>
            <p className="text-4xl font-bold">{reservations.length}</p>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-lg">
            <h3 className="text-gray-400 font-medium mb-1">Ingresos Proyectados</h3>
            <p className="text-4xl font-bold text-[#E53935]">
              ${reservations.reduce((acc, curr) => acc + curr.totalPrice, 0).toLocaleString('es-AR')}
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-lg">
            <h3 className="text-gray-400 font-medium mb-1">Pendientes de Transferencia</h3>
            <p className="text-4xl font-bold text-yellow-500">
              {reservations.filter(r => r.paymentMethod === 'transfer' && r.paymentStatus === 'pending').length}
            </p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 border-b border-white/5 text-sm uppercase tracking-wider text-gray-400">
                  <th className="p-5 font-semibold">Cliente</th>
                  <th className="p-5 font-semibold">Viaje</th>
                  <th className="p-5 font-semibold">Pasajeros</th>
                  <th className="p-5 font-semibold">Pago</th>
                  <th className="p-5 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                      Aún no hay reservas registradas.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-gray-200">{res.userName}</p>
                        <p className="text-gray-500 text-xs">{res.userEmail}</p>
                      </td>
                      <td className="p-5">
                        <p className="font-medium text-gray-300">{new Date(res.date + 'T12:00:00').toLocaleDateString('es-AR')}</p>
                        <p className="text-[#E53935] font-bold text-xs">{res.timeSlot?.time || 'N/A'} hs</p>
                      </td>
                      <td className="p-5">
                        <ul className="text-xs space-y-1 text-gray-400">
                          {/* CORREGIDO: Mapeamos res.tickets y leemos ticket.ticketCategory */}
                          {res.tickets?.map((ticket, idx) => (
                            <li key={idx}>
                              <span className="font-bold text-gray-300">{ticket.quantity}x</span> {ticket.ticketCategory?.name || 'Ticket'}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            res.paymentMethod === 'mercadopago' ? 'bg-[#009EE3]/20 text-[#009EE3]' : 'bg-gray-700 text-gray-300'
                          }`}>
                            {res.paymentMethod === 'mercadopago' ? 'MercadoPago' : 'Transferencia'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                            res.paymentStatus === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {res.paymentStatus === 'approved' ? 'Pagado' : 'Pendiente'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-right font-extrabold text-lg text-white">
                        ${res.totalPrice.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
