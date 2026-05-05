'use client';
import { useEffect, useRef } from 'react';

export default function SplatViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let stopped = false;
    let viewer: any = null;
    let renderer: any = null;

    (async () => {
      try {
        // Importamos Three y la librería de splats juntos
        const [THREE, GS3D] = await Promise.all([
          import('three'),
          import('@mkkellogg/gaussian-splats-3d'),
        ]);

        if (stopped) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        // Creamos el renderer usando el <canvas> que nosotros controlamos.
        // Así la librería nunca hace document.body.appendChild().
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(w, h, false); // false = no toca el CSS del canvas
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        viewer = new GS3D.Viewer({
          renderer,                  // renderer externo → no modifica el DOM
          selfDrivenMode: true,
          useBuiltInControls: true,
          gpuAcceleratedSort: true,
        });

        await viewer.addSplatScene('/splats/1.spz', {
          splatAlphaRemovalThreshold: 5,
          showLoadingUI: false,
        });

        if (stopped) return;

        // Auto-rotación suave para el fondo
        if (viewer.controls) {
          viewer.controls.autoRotate = true;
          viewer.controls.autoRotateSpeed = 0.35;
          viewer.controls.enableDamping = true;
          viewer.controls.dampingFactor = 0.05;
          viewer.controls.enableZoom = false;
          viewer.controls.enablePan = false;
        }

        viewer.start();
      } catch (err) {
        // Error silencioso: si el archivo no existe o WebGL falla,
        // la página sigue funcionando con el overlay de color
        console.warn('[SplatViewer]', err);
      }
    })();

    return () => {
      stopped = true;
      try { viewer?.stop?.(); } catch {}
      try { viewer?.dispose?.(); } catch {}
      try { renderer?.dispose?.(); } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        // No intercepta clics del contenido superpuesto
        pointerEvents: 'none',
      }}
    />
  );
}
