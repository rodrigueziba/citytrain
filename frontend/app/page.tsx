import TrainSceneDynamic from '@/app/components/TrainSceneDynamic';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]">
      
      {/* CAPA 1: Escena 3D de Fondo */}
      <div className="absolute inset-0 z-0">
        <TrainSceneDynamic />
      </div>

      {/* CAPA 2: Interfaz de Usuario (UI) superpuesta */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none px-4">
        
        <div className="text-center drop-shadow-2xl bg-black/20 p-8 rounded-3xl backdrop-blur-sm">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
            Ushuaia <span className="text-[#E53935]">City Train</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light">
            Una hora de un viaje <strong className="font-bold">I-NOL-VI-DA-BLE</strong>
          </p>

          {/* 
            Botón de acción. 
            El pointer-events-auto es clave para que se pueda clickear por encima del canvas 3D 
          */}
          <button className="pointer-events-auto bg-[#E53935] hover:bg-[#C62828] text-white px-10 py-4 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(229,57,53,0.4)]">
            Reservar Pasajes
          </button>
        </div>

      </div>

      {/* CAPA 3: Widget de WhatsApp flotante (Placeholder por ahora) */}
      <div className="absolute bottom-6 right-6 z-20">
        <button className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
          💬 WA
        </button>
      </div>

    </main>
  );
}
