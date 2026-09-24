"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { LaunchState } from "@/lib/launch/launch-state";
import AtmosphericParticles from "./AtmosphericParticles";

interface CinematicSceneProps {
  currentState: LaunchState;
}

export default function CinematicScene({ currentState }: CinematicSceneProps) {
  const { scene } = useThree();
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const blueLightRef = useRef<THREE.DirectionalLight>(null);

  // Initialize scene properties
  useEffect(() => {
    scene.background = new THREE.Color("#FFFFFF");
    scene.fog = null;
  }, [scene]);

  // Handle transition when HI_SUBMITTED
  useEffect(() => {
    if (currentState === LaunchState.HI_SUBMITTED) {
      if (scene.background instanceof THREE.Color) {
        gsap.to(scene.background, {
          r: 1,
          g: 1,
          b: 1,
          duration: 1,
          ease: "power2.inOut",
        });
      }

      // Keep lighting clean and bright for white background
      if (ambientLightRef.current) {
        gsap.to(ambientLightRef.current, {
          intensity: 1.2,
          duration: 1.5,
          ease: "power2.inOut",
        });
      }
      
      if (spotLightRef.current) {
        gsap.to(spotLightRef.current, {
          intensity: 1.0,
          duration: 2,
          ease: "power2.inOut",
        });
      }

      if (blueLightRef.current) {
        gsap.to(blueLightRef.current, {
          intensity: 0.25,
          duration: 2,
          ease: "power2.inOut",
        });
      }
      
    } else if (currentState === LaunchState.IDLE) {
      if (scene.background instanceof THREE.Color) {
        scene.background.setHex(0xffffff);
      }
      if (ambientLightRef.current) ambientLightRef.current.intensity = 1.0;
      if (spotLightRef.current) spotLightRef.current.intensity = 0;
      if (blueLightRef.current) blueLightRef.current.intensity = 0;
    }
  }, [currentState, scene]);

  return (
    <>
      {/* Base illumination */}
      <ambientLight ref={ambientLightRef} intensity={1} color="#ffffff" />
      
      {/* Subtle central stage lighting (will illuminate the hand later) */}
      <spotLight 
        ref={spotLightRef}
        position={[0, 2, 10]}
        angle={0.6}
        penumbra={1}
        intensity={0}
        color="#ffffff"
        distance={25}
      />

      {/* Atmospheric secondary light (Ability Blue/Aqua influence) */}
      <directionalLight
        ref={blueLightRef}
        position={[-5, 5, 5]}
        intensity={0}
        color="#42CFE3" // Primary Aqua
      />

      {/* Particles */}
      <AtmosphericParticles currentState={currentState} />
    </>
  );
}
