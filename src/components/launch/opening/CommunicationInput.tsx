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
  const [value, setValue] = useState("WELCOME TO ABILITY");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSubmittedOrLater = 
    currentState === LaunchState.HI_SUBMITTED || 
    currentState === LaunchState.HI_TRANSFORMING ||
    currentState === LaunchState.SIGN_ACTIVE;
    
  const isTransforming = currentState === LaunchState.HI_TRANSFORMING;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const trimmed = value.trim().toUpperCase();
  const isWelcome = trimmed === "WELCOME TO ABILITY" || trimmed === "WELCOME";
  const canSubmit = isWelcome && !isSubmittedOrLater;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (canSubmit) {
      onComplete();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setTimeout(() => {
      if (inputRef.current) {
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center w-full relative z-40"
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
        {/* Cinematic Input Container */}
        <div className="relative mb-12 w-full max-w-[920px] flex justify-center">
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
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            animate={{
              scale: isTransforming ? 1.2 : 1,
              letterSpacing: isTransforming ? "0.26em" : "0.14em",
              opacity: isTransforming ? 0 : 1,
              filter: isTransforming ? "blur(8px)" : "blur(0px)",
              color: isSubmittedOrLater ? "#0093dd" : "#1E293B"
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`
              bg-transparent border-none outline-none
              text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-primary font-bold text-center
              w-full uppercase tracking-[0.10em] sm:tracking-[0.14em] md:tracking-[0.16em]
              placeholder:text-transparent px-2
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
              className="absolute top-0 left-0 h-full w-full bg-[#0278b3] origin-left"
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
              ? "border-[#0093dd] text-[#0093dd] hover:bg-[#0093dd] hover:text-white cursor-pointer shadow-sm hover:shadow" 
              : "border-border text-secondary-text opacity-50 cursor-not-allowed"}
          `}
        >
          Begin the Journey
        </motion.button>
      </form>
    </motion.div>
  );
}
