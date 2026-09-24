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
          {/* Central Interaction Area */}
          <div className="flex flex-col items-center justify-center w-full max-w-4xl px-8">
            {/* Logo with reduced gap to MUDRA 26 */}
            <motion.div
              animate={{ 
                opacity: isSubmitted || isTransforming ? 0 : 1,
                y: isSubmitted || isTransforming ? -10 : 0
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="mb-3 md:mb-4"
            >
              <AbilityBrand />
            </motion.div>

            <motion.div
              animate={{ 
                opacity: isSubmitted || isTransforming ? 0 : 1,
                y: isSubmitted || isTransforming ? -10 : 0
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <CommunicationPrompt />
            </motion.div>
            
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
