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
  
  const particleCount = 400; // Performance conscious, minimal density

  // Deterministic positions
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);
    
    // Seeded random for deterministic behavior
    let seed = 12345;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < particleCount; i++) {
      // Spread them around, keeping the center slightly more open but atmospheric
      pos[i * 3] = (random() - 0.5) * 25;     // x
      pos[i * 3 + 1] = (random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (random() - 0.5) * 15 - 5; // z (slightly pushed back)
      
      ph[i] = random() * Math.PI * 2; // Random starting phase for organic movement
    }
    return [pos, ph];
  }, []);

  // Handle transition
  useEffect(() => {
    if (currentState === LaunchState.HI_SUBMITTED) {
      if (materialRef.current) {
        // Fade in particles smoothly
        gsap.to(materialRef.current, {
          opacity: 0.6,
          duration: 3,
          delay: 1, // Start fading in after background starts dimming
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
    if (currentState === LaunchState.IDLE) return; // Save performance when not visible

    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;
      const time = clock.elapsedTime;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Very slow, drifting vertical/horizontal organic motion
        const phase = phases[i];
        
        array[i3] += Math.sin(time * 0.1 + phase) * 0.003;
        array[i3 + 1] += Math.cos(time * 0.15 + phase) * 0.003;
        // Z movement is negligible to prevent them from hitting camera
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
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        color="#42CFE3" // Ability aqua tint for particles
        transparent
        opacity={0} // Hidden initially
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
