"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LaunchState } from "@/lib/launch/launch-state";
import AbilityBrand from "./AbilityBrand";
import CommunicationPrompt from "./CommunicationPrompt";
import CommunicationInput from "./CommunicationInput";
import InaugurationAttribution from "./InaugurationAttribution";

interface LaunchOpeningProps {
  currentState: LaunchState;
  onStateChange: (newState: LaunchState) => void;
}

export default function LaunchOpening({ currentState, onStateChange }: LaunchOpeningProps) {
  const isIdleOrInput = currentState === LaunchState.IDLE || currentState === LaunchState.INPUT_ACTIVE;
  const isSubmitted = currentState === LaunchState.HI_SUBMITTED;
  const isTransforming = currentState === LaunchState.HI_TRANSFORMING;
  
  const isVisible = isIdleOrInput || isSubmitted || isTransforming;

  const handleInputComplete = () => {
    onStateChange(LaunchState.HI_SUBMITTED);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="opening-layer"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center"
        >
          {/* Top Header: Logo + MUDRA 26 + Prompt positioned toward top */}
          <motion.div
            animate={{ 
              opacity: isSubmitted || isTransforming ? 0 : 1,
              y: isSubmitted || isTransforming ? -15 : 0
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute top-8 sm:top-10 md:top-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none w-full max-w-xl px-4 text-center"
          >
            <AbilityBrand />
            <CommunicationPrompt />
          </motion.div>

          {/* Central Main Focus: Input field and Enter Button in True Center */}
          <div className="flex flex-col mt-16 items-center justify-center w-full max-w-5xl px-4 md:px-8 z-30 pointer-events-auto">
            <CommunicationInput 
              currentState={currentState} 
              onComplete={handleInputComplete} 
            />
          </div>

          {/* Minister Attribution */}
          <motion.div
            animate={{ 
              opacity: isSubmitted || isTransforming ? 0 : 1,
              y: isSubmitted || isTransforming ? 20 : 0
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-12 right-12 z-30"
          >
            <InaugurationAttribution />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
