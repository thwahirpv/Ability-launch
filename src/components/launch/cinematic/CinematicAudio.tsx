"use client";

import { useEffect, useRef } from "react";
import { LaunchState } from "@/lib/launch/launch-state";

interface CinematicAudioProps {
  currentState: LaunchState;
}

export default function CinematicAudio({ currentState }: CinematicAudioProps) {
  const bedAudioRef = useRef<HTMLAudioElement | null>(null);
  const accentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio architecture cleanly so real assets can be dropped in.
  // Note: HTML5 Audio is used here because it allows preloading and plays seamlessly
  // outside the React render cycle without expensive WebAudio API context setup unless needed.
  useEffect(() => {
    // If assets are provided later, initialize them here:
    // bedAudioRef.current = new Audio("/assets/audio/cinematic_bed.mp3");
    // bedAudioRef.current.loop = true;
    
    // accentAudioRef.current = new Audio("/assets/audio/identity_accent.mp3");
  }, []);

  useEffect(() => {
    try {
      if (currentState === LaunchState.HI_SUBMITTED) {
        // User interacted, we can safely play audio now
        if (bedAudioRef.current) {
          bedAudioRef.current.currentTime = 0;
          bedAudioRef.current.volume = 0.5;
          bedAudioRef.current.play().catch(() => { /* Silent fail */ });
        }
      } else if (currentState === LaunchState.LOGO_REVEAL) {
        // Identity accent
        if (accentAudioRef.current) {
          accentAudioRef.current.currentTime = 0;
          accentAudioRef.current.volume = 0.7;
          accentAudioRef.current.play().catch(() => { /* Silent fail */ });
        }
      } else if (currentState === LaunchState.WEBSITE_REVEAL) {
        // Fade out
        // For a real implementation, a GSAP tween on the volume property is ideal
        if (bedAudioRef.current) bedAudioRef.current.volume = 0;
      } else if (currentState === LaunchState.IDLE || currentState === LaunchState.EXPERIENCE_COMPLETE) {
        // Complete Cleanup
        if (bedAudioRef.current) {
          bedAudioRef.current.pause();
          bedAudioRef.current.currentTime = 0;
        }
        if (accentAudioRef.current) {
          accentAudioRef.current.pause();
          accentAudioRef.current.currentTime = 0;
        }
      }
    } catch (e) {
      // Audio failures must never crash the visual experience
      console.warn("Audio architecture fail-safe caught error:", e);
    }
  }, [currentState]);

  return null;
}
