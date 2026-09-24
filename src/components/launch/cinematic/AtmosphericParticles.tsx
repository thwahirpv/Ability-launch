"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { LaunchState } from "@/lib/launch/launch-state";

interface AtmosphericParticlesProps {
  currentState: LaunchState;
}

export default function AtmosphericParticles({ currentState }: AtmosphericParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  const particleCount = 450; // Performance conscious, elegant density

  // Deterministic positions and vibrant colors visible on white background
  const [positions, phases, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);
    const col = new Float32Array(particleCount * 3);
    
    // Palette curated for high contrast and elegance on pure white
    const palette = [
      new THREE.Color("#060af3ff"), // Royal Blue (Ability)
      new THREE.Color("#0477b1ff"), // Vibrant Cyan
      new THREE.Color("#0756a4ff"), // Fresh Green (Ability)
      new THREE.Color("#1d65e1ff"), // Deep Rose / Festive Red
      new THREE.Color("#553aedff"), // Deep Violet
      new THREE.Color("#061fd9ff"), // Warm Amber
      new THREE.Color("#1E293B"), // Deep Slate contrast
    ];

    let seed = 12345;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (random() - 0.5) * 26;     // x
      pos[i * 3 + 1] = (random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (random() - 0.5) * 15 - 4; // z
      
      ph[i] = random() * Math.PI * 2;

      const c = palette[Math.floor(random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, ph, col];
  }, []);

  // Handle transition
  useEffect(() => {
    if (currentState === LaunchState.HI_SUBMITTED) {
      if (materialRef.current) {
        // Fade in particles smoothly
        gsap.to(materialRef.current, {
          opacity: 0.85,
          duration: 2.5,
          delay: 0.5,
          ease: "power2.inOut",
        });
      }
    } else if (currentState === LaunchState.IDLE) {
      if (materialRef.current) {
        materialRef.current.opacity = 0;
      }
    }
  }, [currentState]);

  // Subtle organic movement
  useFrame(({ clock }) => {
    if (currentState === LaunchState.IDLE) return;

    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;
      const time = clock.elapsedTime;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const phase = phases[i];
        
        array[i3] += Math.sin(time * 0.12 + phase) * 0.0035;
        array[i3 + 1] += Math.cos(time * 0.16 + phase) * 0.0035;
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.12}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
