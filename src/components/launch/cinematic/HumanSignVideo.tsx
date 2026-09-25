"use client";

import { useEffect, useRef } from "react";
import { LaunchState } from "@/lib/launch/launch-state";
import gsap from "gsap";
import { launchAudio } from "@/lib/launch/launch-audio";

interface HumanSignVideoProps {
  currentState: LaunchState;
  onComplete: () => void;
}

export default function HumanSignVideo({ currentState, onComplete }: HumanSignVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync video audio mute with master launch audio state
  useEffect(() => {
    const unsubscribe = launchAudio.subscribeMute((muted) => {
      if (videoRef.current) {
        videoRef.current.muted = muted;
      }
    });
    return unsubscribe;
  }, []);

  // Handle timeline entrance, playback and exit
  useEffect(() => {
    if (currentState === LaunchState.SIGN_ACTIVE) {
      if (containerRef.current && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = launchAudio.getMuted();

        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Video playback blocked, retrying muted:", err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => { });
            }
          });
        }

        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Safety Fallback: video is ~2.87s; watchdog guarantees transition
      const failsafe = setTimeout(() => {
        onComplete();
      }, 4500);
      return () => clearTimeout(failsafe);

    } else if (currentState === LaunchState.SIGN_COMPLETE) {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }
    } else if (currentState === LaunchState.IDLE) {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
        containerRef.current.style.opacity = "0";
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [currentState, onComplete]);

  const handleVideoEnded = () => {
    if (currentState === LaunchState.SIGN_ACTIVE) {
      onComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-15 pointer-events-none flex flex-col bg-white opacity-0 overflow-hidden p-6 md:p-8 lg:p-10"
    >
      <div className="w-full max-w-[1360px] mx-auto flex flex-col items-center h-full">

        {/* 1. YouTube-style Search Box with Search Sentence */}
        <div className="w-full max-w-xl md:max-w-2xl h-11 md:h-12 mb-4 md:mb-6 rounded-full border border-[#cccccc] bg-white flex items-center overflow-hidden shadow-sm flex-shrink-0">
          <div className="flex-1 px-5 text-sm md:text-base font-normal text-slate-800 flex items-center tracking-normal select-none">
            <span>WELCOME TO ABILITY</span>
          </div>
          <div className="w-12 md:w-14 h-full bg-[#f8f8f8] hover:bg-[#f0f0f0] border-l border-[#cccccc] flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 md:w-5 md:h-5 text-slate-700"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* 2. Main Video Player - Centered, Bigger, with Clean Padding */}
        <div className="w-full flex-1 min-h-0 flex items-center justify-center p-2 md:p-4">
          <div className="relative h-full max-h-full aspect-[16/9] max-w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-[#0c233c] flex items-center justify-center">
            <video
              ref={videoRef}
              src="/assets/welcomevideo2.mp4"
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover absolute inset-0"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
