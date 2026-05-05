declare module '@mkkellogg/gaussian-splats-3d' {
  export class Viewer {
    constructor(options: Record<string, unknown>);
    addSplatScene(path: string, options?: Record<string, unknown>): Promise<void>;
    start(): void;
    stop(): void;
    dispose(): void;
    controls: {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      enablePan: boolean;
    } | null;
  }
  export const RenderMode: Record<string, number> | undefined;
}
