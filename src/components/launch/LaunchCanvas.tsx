"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { LaunchState } from "@/lib/launch/launch-state";
import CinematicScene from "./cinematic/CinematicScene";

interface LaunchCanvasProps {
  currentState: LaunchState;
}

export default function LaunchCanvas({ currentState }: LaunchCanvasProps) {
  // Prevent hydration mismatches by only rendering canvas after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]} // Control device pixel ratio for performance
        gl={{ alpha: true, antialias: true }}
      >
        <CinematicScene currentState={currentState} />
      </Canvas>
    </div>
  );
}
