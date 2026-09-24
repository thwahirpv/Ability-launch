"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LaunchState } from "@/lib/launch/launch-state";
import { LaunchConfig } from "@/lib/launch/launch-config";
import LaunchCanvas from "./LaunchCanvas";
import LaunchUI from "./LaunchUI";
import WebsiteRevealLayer from "./WebsiteRevealLayer";
import HumanSignVideo from "./cinematic/HumanSignVideo";
import AbilityLogoReveal from "./cinematic/AbilityLogoReveal";
import CinematicAudio from "./cinematic/CinematicAudio";
import WebGLFallbackErrorBoundary from "./WebGLFallbackErrorBoundary";
import confetti from "canvas-confetti";
import AudioMuteButton from "./AudioMuteButton";

export default function LaunchExperience() {
  const [currentState, setCurrentState] = useState<LaunchState>(LaunchState.IDLE);

  // Development event controls setup
  useEffect(() => {
    if (!LaunchConfig.controls.enableDevControls) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === LaunchConfig.controls.skipToWebsiteKey) {
        setCurrentState(LaunchState.WEBSITE_REVEAL);
      } else if (e.key === LaunchConfig.controls.restartKey) {
        setCurrentState(LaunchState.IDLE);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // GSAP-like state machine orchestration for Phases 5, 6, 7, and 8
  useEffect(() => {
    if (currentState === LaunchState.HI_SUBMITTED) {
      const timer1 = setTimeout(() => setCurrentState(LaunchState.HI_TRANSFORMING), 1200);
      return () => clearTimeout(timer1);
    } else if (currentState === LaunchState.HI_TRANSFORMING) {
      const timer2 = setTimeout(() => setCurrentState(LaunchState.SIGN_ACTIVE), 1500);
      return () => clearTimeout(timer2);
    } else if (currentState === LaunchState.SIGN_COMPLETE) {
      const timer3 = setTimeout(() => setCurrentState(LaunchState.LOGO_REVEAL), 1300);
      return () => clearTimeout(timer3);
    } else if (currentState === LaunchState.LOGO_REVEAL) {
      const timer4 = setTimeout(() => setCurrentState(LaunchState.LOGO_HOLD), 1500);
      return () => clearTimeout(timer4);
    } else if (currentState === LaunchState.LOGO_HOLD) {
      const timer5 = setTimeout(() => setCurrentState(LaunchState.IDENTITY_REVEAL), 800);
      return () => clearTimeout(timer5);
    } else if (currentState === LaunchState.IDENTITY_REVEAL) {
      // Fire massive inauguration confetti from both corners to cover the whole screen
      const festiveColors = ['#FFD700', '#00FFFF', '#FF3366', '#FFFFFF', '#4D4DFF']; // Gold, Cyan, Pink, White, Bright Blue

      // Left cannon
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 1 },
        colors: festiveColors,
        startVelocity: 60,
        zIndex: 100,
      });

      // Right cannon
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 1 },
        colors: festiveColors,
        startVelocity: 60,
        zIndex: 100,
      });

      import("@/lib/launch/launch-audio").then(m => {
        m.launchAudio.playPopper(0);
        setTimeout(() => m.launchAudio.playPopper(1), 30);
      });

      const timer6 = setTimeout(() => setCurrentState(LaunchState.IDENTITY_HOLD), 1200);
      return () => clearTimeout(timer6);
    } else if (currentState === LaunchState.IDENTITY_HOLD) {
      const timer7 = setTimeout(() => setCurrentState(LaunchState.WEBSITE_REVEAL), 2000);
      return () => clearTimeout(timer7);
    } else if (currentState === LaunchState.WEBSITE_REVEAL) {
      const timer8 = setTimeout(() => setCurrentState(LaunchState.EXPERIENCE_COMPLETE), 3500);
      return () => clearTimeout(timer8);
    }
  }, [currentState]);

  // Global Watchdog: Automatic safety fallback
  useEffect(() => {
    if (
      currentState !== LaunchState.IDLE && 
      currentState !== LaunchState.WEBSITE_REVEAL && 
      currentState !== LaunchState.EXPERIENCE_COMPLETE
    ) {
      const watchdog = setTimeout(() => {
        console.warn("Cinematic watchdog triggered: Sequence stalled for 12s. Forcing website reveal.");
        setCurrentState(LaunchState.WEBSITE_REVEAL);
      }, 12000); // 12 seconds max per state phase
      return () => clearTimeout(watchdog);
    }
  }, [currentState]);

  // Handle smooth redirect once the cinematic experience is completely finished
  useEffect(() => {
    if (currentState === LaunchState.EXPERIENCE_COMPLETE) {
      window.location.href = "https://sign.abilitycollege.in/";
    }
  }, [currentState]);

  const handleVideoComplete = () => {
    if (currentState === LaunchState.SIGN_ACTIVE) {
      setCurrentState(LaunchState.SIGN_COMPLETE);
    }
  };

  const isExperienceComplete = currentState === LaunchState.EXPERIENCE_COMPLETE;

  return (
    <div className="relative w-full h-full overflow-hidden">
      
      {/* Audio Architecture (Non-blocking, invisible) */}
      <CinematicAudio currentState={currentState} />

      {/* Z-index 0: Actual Website Placeholder (or Real Website) */}
      <WebsiteRevealLayer />

      <AnimatePresence>
        {!isExperienceComplete && (
          <motion.div
            key="cinematic-wrapper"
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5, 
              delay: 0.8, // Wait for statement to fade before opening the atmosphere
              ease: "easeInOut" 
            }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            {/* Cinematic WebGL Layer wrapped in safety boundary */}
            <WebGLFallbackErrorBoundary>
              <LaunchCanvas currentState={currentState} />
            </WebGLFallbackErrorBoundary>
            
            {/* Human Sign Cinematic Video Layer */}
            <HumanSignVideo currentState={currentState} onComplete={handleVideoComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo & Identity Reveal Layer (Handles its own exit separately to overlap perfectly) */}
      {!isExperienceComplete && (
        <AbilityLogoReveal currentState={currentState} />
      )}

      {/* Z-index 20: HTML UI Layer (Initial Launch Screen) */}
      {!isExperienceComplete && (
        <LaunchUI currentState={currentState} onStateChange={setCurrentState} />
      )}

      {/* Audio Mute/Unmute Button in screen left bottom */}
      {!isExperienceComplete && (
        <AudioMuteButton currentState={currentState} />
      )}
    </div>
  );
}
