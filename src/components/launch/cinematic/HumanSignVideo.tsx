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
              videoRef.current.play().catch(() => {});
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
      className="absolute inset-0 z-15 pointer-events-none flex flex-col bg-white opacity-0 overflow-y-auto overflow-x-hidden"
    >
      {/* 1. YouTube Top Navigation Bar */}
      <header className="w-full h-14 border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between bg-white flex-shrink-0 sticky top-0 z-20">
        {/* Left: Hamburger & YouTube Logo */}
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Menu" className="p-1.5 text-slate-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <div className="flex items-center gap-1.5 select-none">
            {/* YouTube Red Icon */}
            <div className="w-7 h-5 bg-[#FF0000] rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-slate-900 font-sans">
              YouTube
            </span>
          </div>
        </div>

        {/* Center: YouTube Search Bar with Search Sentence */}
        <div className="flex items-center flex-1 max-w-xl md:max-w-2xl mx-4 justify-center">
          <div className="w-full h-10 rounded-full border border-[#cccccc] bg-white flex items-center overflow-hidden shadow-inner focus-within:border-blue-500">
            <div className="flex-1 px-4 text-sm font-normal text-slate-800 flex items-center tracking-normal select-none">
              <span>WELCOME TO ABILITY</span>
            </div>
            <div className="w-14 h-full bg-[#f8f8f8] hover:bg-[#f0f0f0] border-l border-[#cccccc] flex items-center justify-center transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-slate-700"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
          
          {/* Voice Search Icon */}
          <div className="w-10 h-10 rounded-full bg-[#f2f2f2] ml-3 hidden sm:flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </div>
        </div>

        {/* Right: Skeletons for Action Buttons & Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 hidden sm:block animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-100 hidden sm:block animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </header>

      {/* 2. Main Content Grid (YouTube Watch Layout) */}
      <main className="w-full max-w-[1720px] mx-auto px-4 md:px-8 py-5 flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: Real Video Player + Skeletons */}
        <section className="flex-1 min-w-0 flex flex-col">
          {/* The Video Player */}
          <div className="w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg bg-black relative border border-slate-200/80">
            <video
              ref={videoRef}
              src="/assets/welcomevideo.mp4"
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Video Title Skeleton */}
          <div className="h-6 md:h-7 w-3/4 rounded-md bg-slate-200/90 animate-pulse mt-4 mb-3" />

          {/* Channel Row Skeleton */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-32 rounded bg-slate-200/90 animate-pulse" />
                <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
              </div>
              <div className="h-9 w-24 rounded-full bg-slate-900/10 animate-pulse ml-3 hidden sm:block" />
            </div>

            {/* Like, Share, Save Skeletons */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-28 rounded-full bg-slate-100 animate-pulse hidden sm:block" />
              <div className="h-9 w-20 rounded-full bg-slate-100 animate-pulse hidden md:block" />
              <div className="h-9 w-20 rounded-full bg-slate-100 animate-pulse hidden lg:block" />
            </div>
          </div>

          {/* Description Box Skeleton */}
          <div className="w-full h-24 rounded-xl bg-slate-100/90 p-4 mt-4 flex flex-col gap-2.5">
            <div className="h-3.5 w-1/4 rounded bg-slate-200/80 animate-pulse" />
            <div className="h-3.5 w-3/4 rounded bg-slate-200/60 animate-pulse" />
            <div className="h-3.5 w-1/2 rounded bg-slate-200/50 animate-pulse" />
          </div>
        </section>

        {/* Right Sidebar: Video Suggestions (Skeletons) */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 flex flex-col gap-3">
          {/* Top Filter Chips */}
          <div className="flex items-center gap-2 pb-2 overflow-hidden select-none">
            <div className="h-8 px-3.5 rounded-lg bg-slate-900 text-white text-xs font-medium flex items-center justify-center">
              All
            </div>
            <div className="h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-8 w-16 rounded-lg bg-slate-100 animate-pulse hidden sm:block" />
          </div>

          {/* Suggested Video Cards (Skeletons) */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex gap-3 w-full">
              {/* Thumbnail Skeleton */}
              <div className="w-36 sm:w-40 aspect-video rounded-xl bg-slate-200/90 animate-pulse flex-shrink-0" />
              
              {/* Text Meta Skeletons */}
              <div className="flex-1 flex flex-col justify-start pt-0.5">
                <div className="h-3.5 w-full rounded bg-slate-200/90 animate-pulse mb-1.5" />
                <div className="h-3.5 w-4/5 rounded bg-slate-200/80 animate-pulse mb-2" />
                <div className="h-3 w-1/2 rounded bg-slate-200/60 animate-pulse mb-1" />
                <div className="h-2.5 w-1/3 rounded bg-slate-200/40 animate-pulse" />
              </div>
            </div>
          ))}
        </aside>

      </main>
    </div>
  );
}
