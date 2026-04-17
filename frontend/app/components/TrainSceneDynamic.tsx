'use client';

import dynamic from 'next/dynamic';

const TrainScene = dynamic(() => import('@/app/components/TrainScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#1a1a1a]" aria-hidden />
  ),
});

export default function TrainSceneDynamic() {
  return <TrainScene />;
}
