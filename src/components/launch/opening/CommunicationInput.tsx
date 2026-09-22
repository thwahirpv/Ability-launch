"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LaunchState } from "@/lib/launch/launch-state";

interface CommunicationInputProps {
  currentState: LaunchState;
  onComplete: () => void;
}

export default function CommunicationInput({ currentState, onComplete }: CommunicationInputProps) {
  const [value, setValue] = useState("");
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
    if (value.trim().toUpperCase() === "HI" && !isSubmittedOrLater) {
      onComplete();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

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
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            animate={{
              scale: isTransforming ? 1.5 : 1,
              letterSpacing: isTransforming ? "0.4em" : "0.2em",
              opacity: isTransforming ? 0 : 1,
              filter: isTransforming ? "blur(8px)" : "blur(0px)",
              color: isSubmittedOrLater ? "#42CFE3" : "#1E293B" // transitions to Ability Aqua
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`
              bg-transparent border-none outline-none
              text-5xl md:text-7xl font-primary font-bold text-center
              w-64 md:w-96 uppercase tracking-[0.2em]
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
              animate={{ scaleX: isFocused && !isSubmittedOrLater ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.button
          animate={{ opacity: isSubmittedOrLater ? 0 : 1, y: isSubmittedOrLater ? 10 : 0 }}
          type="submit"
          disabled={value.trim().toUpperCase() !== "HI" || isSubmittedOrLater}
          className={`
            font-secondary text-sm tracking-widest uppercase
            px-8 py-3 rounded-full border transition-all duration-300
            ${value.trim().toUpperCase() === "HI" && !isSubmittedOrLater
              ? "border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white" 
              : "border-border text-secondary-text opacity-50 cursor-not-allowed"}
          `}
        >
          Enter
        </motion.button>
      </form>
    </motion.div>
  );
}
