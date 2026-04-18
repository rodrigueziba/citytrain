import TrainScene from '@/app/components/TrainScene';
import BookingWidget from '@/app/components/BookingWidget';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#1a1a1a]">
      
      {/* CAPA 1: Escena 3D de Fondo (Fixed para que se quede mientras scrolleas) */}
      <div className="fixed inset-0 z-0">
        <TrainScene />
      </div>

      {/* CAPA 2: Contenido */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-evenly min-h-screen pointer-events-none px-4 lg:px-20 py-10 gap-10">
        
        {/* Título a la izquierda */}
        <div className="text-center md:text-left drop-shadow-2xl md:w-1/2">
          <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Ushuaia <br/> <span className="text-[#E53935]">City Train</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-200 font-light backdrop-blur-sm bg-black/10 inline-block p-2 rounded-lg">
            Una hora de un viaje <strong className="font-bold">I-NOL-VI-DA-BLE</strong>
          </p>
        </div>

        {/* Widget a la derecha */}
        <div className="md:w-1/2 flex justify-center w-full z-20">
          <BookingWidget />
        </div>

      </div>

      {/* WhatsApp Flotante */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto">
        <button className="bg-green-500 text-white p-4 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform text-2xl">
          💬
        </button>
      </div>

    </main>
  );
}
