"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { launchAudio } from "@/lib/launch/launch-audio";
import { LaunchState } from "@/lib/launch/launch-state";

interface AudioMuteButtonProps {
  currentState: LaunchState;
}

export default function AudioMuteButton({ currentState }: AudioMuteButtonProps) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const unsubscribe = launchAudio.subscribeMute((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    launchAudio.toggleMute();
  };

  const isComplete = 
    currentState === LaunchState.WEBSITE_REVEAL || 
    currentState === LaunchState.EXPERIENCE_COMPLETE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ 
        opacity: isComplete ? 0 : 1, 
        y: isComplete ? 15 : 0,
        pointerEvents: isComplete ? "none" : "auto"
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-6 left-6 md:bottom-12 md:left-12 z-40"
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        title={isMuted ? "Unmute audio" : "Mute audio"}
        className={`
          flex items-center gap-2 px-3.5 py-2.5 rounded-full
          bg-white/85 dark:bg-slate-900/85 backdrop-blur-md
          border border-slate-200/80 dark:border-slate-700/80
          shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600
          text-slate-700 dark:text-slate-200
          transition-all duration-200 group active:scale-95 cursor-pointer
        `}
      >
        <span className="relative w-5 h-5 flex items-center justify-center">
          {isMuted ? (
            // Muted Speaker Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            // Active Speaker Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-[#2A2DBB] group-hover:scale-110 transition-transform"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </span>
        
      </button>
    </motion.div>
  );
}
