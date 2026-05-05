import dynamic from 'next/dynamic';

// ssr: false porque WebGL / canvas solo existe en el browser
const SplatViewer = dynamic(() => import('./SplatViewer'), {
  ssr: false,
  loading: () => null,   // Sin placeholder → nada en el DOM mientras carga
});

export default SplatViewer;
