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
              opacity: isSignComplete ? 0.35 : 0, 
              scale: isSignComplete ? 0.2 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "circOut"
            }}
            className="absolute center w-32 h-32 rounded-full bg-[#0191D7]/30 blur-2xl pointer-events-none"
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
              opacity: isWebsiteReveal ? 0 : 1, 
              scale: isWebsiteReveal ? 1.05 : 1,
              filter: "blur(0px)",
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
                className="w-full h-auto drop-shadow-xl"
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
                  className="absolute top-full mt-6 md:mt-8 text-center flex flex-col items-center"
                >
                  <h1 className="text-3xl md:text-5xl font-bold font-primary text-[#2A2DBB] tracking-wider uppercase mb-1.5 select-none">
                    MUDRA 26
                  </h1>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-primary text-slate-800 tracking-wide font-normal">
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
