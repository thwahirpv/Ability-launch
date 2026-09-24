"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LaunchState } from "@/lib/launch/launch-state";
import { launchAudio } from "@/lib/launch/launch-audio";

interface CommunicationInputProps {
  currentState: LaunchState;
  onComplete: () => void;
}

export default function CommunicationInput({ currentState, onComplete }: CommunicationInputProps) {
  const [value, setValue] = useState("WELCOME");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSubmittedOrLater = 
    currentState === LaunchState.HI_SUBMITTED || 
    currentState === LaunchState.HI_TRANSFORMING ||
    currentState === LaunchState.SIGN_ACTIVE;
    
  const isTransforming = currentState === LaunchState.HI_TRANSFORMING;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (value.trim().length > 0 && !isSubmittedOrLater) {
      onComplete();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !isSubmittedOrLater;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center relative z-40"
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        {/* Cinematic Input */}
        <div className="relative mb-12">
          <motion.input
            ref={inputRef}
            type="text"
            value={value}
            readOnly={isSubmittedOrLater}
            onChange={(e) => {
              const prevValue = value;
              const newValue = e.target.value.toUpperCase();
              setValue(newValue);
              
              if (newValue.length > prevValue.length) {
                launchAudio.playKeyTap();
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            animate={{
              scale: isTransforming ? 1.4 : 1,
              letterSpacing: isTransforming ? "0.35em" : "0.18em",
              opacity: isTransforming ? 0 : 1,
              filter: isTransforming ? "blur(8px)" : "blur(0px)",
              color: isSubmittedOrLater ? "#2A2DBB" : "#1E293B"
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`
              bg-transparent border-none outline-none
              text-4xl md:text-6xl lg:text-7xl font-primary font-bold text-center
              w-72 sm:w-96 md:w-[500px] uppercase tracking-[0.18em]
              placeholder:text-transparent
            `}
            spellCheck={false}
            autoComplete="off"
            aria-label="Communication input"
          />
          
          {/* Custom minimal underline */}
          <motion.div 
            animate={{ opacity: isSubmittedOrLater ? 0 : 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-border overflow-hidden"
          >
            <motion.div 
              className="absolute top-0 left-0 h-full w-full bg-primary-blue origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (isFocused || value.length > 0) && !isSubmittedOrLater ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.button
          animate={{ opacity: isSubmittedOrLater ? 0 : 1, y: isSubmittedOrLater ? 10 : 0 }}
          type="submit"
          disabled={!canSubmit}
          className={`
            font-secondary text-sm tracking-widest uppercase
            px-8 py-3 rounded-full border transition-all duration-300
            ${canSubmit
              ? "border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white cursor-pointer shadow-sm hover:shadow" 
              : "border-border text-secondary-text opacity-50 cursor-not-allowed"}
          `}
        >
          Enter
        </motion.button>
      </form>
    </motion.div>
  );
}
