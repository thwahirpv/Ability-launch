"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { LaunchState } from "@/lib/launch/launch-state";

interface AbilityLogoRevealProps {
  currentState: LaunchState;
}

export default function AbilityLogoReveal({ currentState }: AbilityLogoRevealProps) {
  // Determine if we are in the states related to Phase 6 & 7 & 8
  const isSignComplete = currentState === LaunchState.SIGN_COMPLETE;
  const isLogoReveal = currentState === LaunchState.LOGO_REVEAL;
  const isLogoHold = currentState === LaunchState.LOGO_HOLD;
  const isIdentityReveal = currentState === LaunchState.IDENTITY_REVEAL;
  const isIdentityHold = currentState === LaunchState.IDENTITY_HOLD;
  const isWebsiteReveal = currentState === LaunchState.WEBSITE_REVEAL;
  
  const showTrace = isSignComplete || isLogoReveal; // The trace acts as the bridge
  // Show logo during reveal, hold, and the start of website reveal
  const showLogo = isLogoReveal || isLogoHold || isIdentityReveal || isIdentityHold || isWebsiteReveal;
  // Hide text as soon as website reveal begins
  const showIdentityText = isIdentityReveal || isIdentityHold;

  return (
    <div className="absolute inset-0 z-18 pointer-events-none flex flex-col items-center justify-center">
      <AnimatePresence>
        {/* Subtle Visual Trace / Energy */}
        {showTrace && (
          <motion.div
            key="visual-trace"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ 
              opacity: isSignComplete ? 0.4 : 0, 
              scale: isSignComplete ? 0.2 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "circOut" // Gives a feeling of energy collapsing into the center
            }}
            className="absolute center w-32 h-32 rounded-full bg-primary-aqua blur-3xl mix-blend-screen"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Ability Logo and Identity Statement Container */}
        {showLogo && (
          <motion.div
            key="ability-logo-container"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)", y: 0 }}
            animate={{ 
              // Fade logo gently during website reveal
              opacity: isWebsiteReveal ? 0 : 1, 
              scale: isWebsiteReveal ? 1.05 : 1, // Subtle push toward camera as it dissolves
              filter: "blur(0px)",
              // A microscopic composition adjustment upward when the identity text reveals
              y: showIdentityText ? -10 : 0
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: isWebsiteReveal ? 2.5 : 1.5, 
              ease: isWebsiteReveal ? "easeOut" : [0.16, 1, 0.3, 1] 
            }}
            className="relative flex flex-col items-center w-full"
          >
            {/* The Logo */}
            <div className="w-[30%] max-w-[400px] min-w-[200px]">
              <Image
                src="/assets/logo_svg.svg"
                alt="Ability Logo"
                width={400}
                height={100}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* The Identity Statement */}
            <AnimatePresence>
              {showIdentityText && (
                <motion.div
                  key="identity-statement"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeOut" } }}
                  transition={{ 
                    duration: 1.2, 
                    ease: "easeOut"
                  }}
                  className="absolute top-full mt-8 md:mt-12 text-center"
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-primary text-slate-200 tracking-wide font-normal drop-shadow-lg">
                    Ability begins here.
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
