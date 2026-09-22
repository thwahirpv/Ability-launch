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
    scene.background = new THREE.Color("#F8FAFC"); // Ability light background
    // Deep blue-black cinematic fog matching the intended dark environment
    scene.fog = new THREE.FogExp2("#070B19", 0);
  }, [scene]);

  // Handle transition when HI_SUBMITTED
  useEffect(() => {
    if (currentState === LaunchState.HI_SUBMITTED) {
      // 1. Transition the background from light to deep blue-black
      if (scene.background instanceof THREE.Color) {
        gsap.to(scene.background, {
          r: 7 / 255,   // #070B19
          g: 11 / 255,
          b: 25 / 255,
          duration: 2.5,
          ease: "power2.inOut",
        });
      }

      // 2. Establish atmospheric depth (Fog)
      gsap.to(scene.fog as THREE.FogExp2, {
        density: 0.05,
        duration: 3,
        ease: "power2.inOut",
      });

      // 3. Lighting changes
      if (ambientLightRef.current) {
        gsap.to(ambientLightRef.current, {
          intensity: 0.05, // Dim ambient
          duration: 2.5,
          ease: "power2.inOut",
        });
      }
      
      if (spotLightRef.current) {
        gsap.to(spotLightRef.current, {
          intensity: 1.5,
          duration: 3,
          ease: "power2.inOut",
        });
      }

      if (blueLightRef.current) {
        gsap.to(blueLightRef.current, {
          intensity: 0.4,
          duration: 3,
          ease: "power2.inOut",
        });
      }
      
    } else if (currentState === LaunchState.IDLE) {
      // Reset logic for dev 'R' restart
      if (scene.background instanceof THREE.Color) {
        scene.background.setHex(0xf8fafc);
      }
      if (scene.fog) {
        (scene.fog as THREE.FogExp2).density = 0;
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
