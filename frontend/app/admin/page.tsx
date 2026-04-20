'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  tickets: { quantity: number; ticketCategory: { name: string; price: number } }[];
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NUEVO: Estado para el filtro de fecha ---
  const [filterDate, setFilterDate] = useState<string>(''); // '' significa "Todas"

  // Funciones para calcular la fecha de Hoy y Mañana (Ajustado a Argentina UTC-3 aprox)
  const getLocalDateStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(d.getHours() - 3); 
    return d.toISOString().split('T')[0];
  };

  const todayStr = getLocalDateStr(0);
  const tomorrowStr = getLocalDateStr(1);

  const loadReservations = () => {
    fetch('http://localhost:3001/api/admin/reservations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReservations(data);
        else setReservations([]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando reservas:', err);
        setReservations([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token === 'baticueva-token-secreto-123') {
      setIsAuthenticated(true);
      loadReservations();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        loadReservations(); 
      } else {
        setLoginError('Usuario o contraseña incorrectos');
        setLoading(false);
      }
    } catch (error) {
      setLoginError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setReservations([]);
  };

  const handleApprove = async (id: number) => {
    if (!confirm('¿Confirmar que recibiste la transferencia?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) loadReservations();
      else alert('Hubo un error al actualizar el estado.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- NUEVO: Lógica para filtrar las reservas según el botón seleccionado ---
  const filteredReservations = reservations.filter(res => {
    if (!filterDate) return true; // Si está vacío, mostramos todas
    return res.date.startsWith(filterDate);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
        <p className="text-xl font-bold animate-pulse">Cargando Baticueva...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-4">
        <div className="bg-[#1A1A1A] p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white text-center mb-8 tracking-tight">Acceso <span className="text-[#E53935]">Admin</span></h1>
          {loginError && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center border border-red-500/30">{loginError}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Usuario</label>
              <input type="text" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#E53935] transition-all" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contraseña</label>
              <input type="password" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#E53935] transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-[#E53935] hover:bg-red-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all">Ingresar</button>
          </form>
          <div className="mt-6 text-center">
             <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Volver al sitio</Link>
          </div>
        </div>
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
          <div className="flex gap-4">
            <Link href="/" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center">
              Ir al sitio
            </Link>
            <button onClick={handleLogout} className="border border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white px-6 py-3 rounded-xl font-bold transition-all text-sm">
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* --- NUEVO: Botonera de Filtros --- */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filtrar por:</span>
          <button 
            onClick={() => setFilterDate('')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterDate === '' ? 'bg-[#E53935] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilterDate(todayStr)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterDate === todayStr ? 'bg-[#E53935] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            Hoy
          </button>
          <button 
            onClick={() => setFilterDate(tomorrowStr)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterDate === tomorrowStr ? 'bg-[#E53935] text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            Mañana
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
             <span className="text-sm text-gray-400">Buscar fecha:</span>
             <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E53935] color-scheme-dark"
                style={{ colorScheme: 'dark' }}
             />
          </div>
        </div>

        {/* Tarjetas calculadas en base a los FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-lg transition-all">
            <h3 className="text-gray-400 font-medium mb-1">Viajes Mostrados</h3>
            <p className="text-4xl font-bold">{filteredReservations.length}</p>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-lg transition-all">
            <h3 className="text-gray-400 font-medium mb-1">Ingresos Filtrados</h3>
            <p className="text-4xl font-bold text-[#E53935]">
              ${filteredReservations.reduce((acc, curr) => acc + curr.totalPrice, 0).toLocaleString('es-AR')}
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-lg transition-all">
            <h3 className="text-gray-400 font-medium mb-1">Pendientes de Transferencia</h3>
            <p className="text-4xl font-bold text-yellow-500">
              {filteredReservations.filter(r => r.paymentMethod === 'transfer' && r.paymentStatus === 'pending').length}
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
                  <th className="p-5 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                      No se encontraron reservas para esta fecha.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-5">
                        <p className="font-bold text-gray-200">{res.userName}</p>
                        <p className="text-gray-500 text-xs">{res.userEmail}</p>
                      </td>
                      <td className="p-5">
                        <p className="font-medium text-gray-300">
                          {new Date(res.date).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                        </p>
                        <p className="text-[#E53935] font-bold text-xs">{res.timeSlot?.time || 'N/A'} hs</p>
                      </td>
                      <td className="p-5">
                        <ul className="text-xs space-y-1 text-gray-400">
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
                      <td className="p-5 text-center">
                        {res.paymentMethod === 'transfer' && res.paymentStatus === 'pending' ? (
                          <button 
                            onClick={() => handleApprove(res.id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md"
                          >
                            Aprobar Pago
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs">-</span>
                        )}
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