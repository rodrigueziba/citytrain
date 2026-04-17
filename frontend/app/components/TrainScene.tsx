'use client'; // Obligatorio porque Three.js necesita el navegador (cliente)

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

export default function TrainScene() {
  return (
    <Canvas camera={{ position: [5, 2, 8], fov: 45 }}>
      {/* Iluminación básica */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      {/* Entorno HDRI para dar reflejos metálicos y realistas */}
      <Environment preset="city" />

      {/* 
        PLACEHOLDER DEL TREN 
        Temporalmente usaremos un bloque con las proporciones del colectivo.
        Más adelante aquí cargaremos tu modelo .gltf/.glb real.
      */}
      <group position={[0, 0, 0]}>
        {/* Cuerpo del colectivo/tren */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2.5, 3, 7]} /> 
          <meshStandardMaterial color="#6B1A1F" roughness={0.2} metalness={0.1} /> 
          {/* Usamos un bordó oscuro similar al de la foto */}
        </mesh>
      </group>

      {/* Sombra proyectada en el suelo falso */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.6} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />

      {/* Controles: auto-rotación lenta y suave para efecto "Wow" */}
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.8} 
        enablePan={false} 
        enableZoom={false} // Evita que el usuario haga zoom y rompa el diseño
        minPolarAngle={Math.PI / 3} // Limita el ángulo para que no miren por debajo del suelo
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
