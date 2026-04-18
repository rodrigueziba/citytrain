'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// --- ESTE ES EL TREN DE PRUEBA ANIMADO ---
function PlaceholderTrain() {
  const group = useRef<THREE.Group>(null);
  const scroll = useScroll(); // Hook para leer la posición del scroll

  useFrame((state, delta) => {
    if (!group.current) return;

    // 1. Rotación constante muy lenta (como antes)
    group.current.rotation.y += delta * 0.2;

    // 2. MAGIA: Animación basada en el scroll.
    // scroll.offset va de 0 (arriba) a 1 (abajo de todo).
    const r1 = scroll.range(0, 1); // Rango completo de la página
    
    // Hacemos que el tren suba ligeramente y se aleje (zoom out) a medida que el usuario baja
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, r1 * 1.5, 0.1);
    group.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.8, r1));
    
    // Leve "flote" estilo respiración
    group.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Locomotora */}
      <mesh position={[0, 1, 1.5]}>
        <boxGeometry args={[1.8, 2, 2.5]} />
        <meshStandardMaterial color="#E53935" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Chimenea */}
      <mesh position={[0, 2.5, 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      {/* Vagón */}
      <mesh position={[0, 1, -1.5]}>
        <boxGeometry args={[1.8, 2, 3]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Conector */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.2, 1]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
    </group>
  );
}

export default function TrainScene() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [6, 3, 6], fov: 40 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />

        {/* ScrollControls envuelve al tren para darle acceso a los datos del scroll */}
        {/* 'pages' indica cuántas "pantallas" virtuales abarca el scroll */}
        <ScrollControls pages={4} damping={0.1}>
          <PlaceholderTrain />
        </ScrollControls>

        <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={15} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
