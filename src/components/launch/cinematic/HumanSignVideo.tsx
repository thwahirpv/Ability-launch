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
      className="absolute inset-0 z-15 pointer-events-none flex flex-col bg-white opacity-0 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8"
    >
      <div className="w-full max-w-[1360px] mx-auto flex flex-col min-h-full">
        
        {/* 1. YouTube-style Search Box with Search Sentence */}
        <div className="w-full max-w-xl md:max-w-2xl h-11 md:h-12 mb-6 rounded-full border border-[#cccccc] bg-white flex items-center overflow-hidden shadow-sm mx-auto flex-shrink-0">
          <div className="flex-1 px-5 text-sm md:text-base font-normal text-slate-800 flex items-center tracking-normal select-none">
            <span>WELCOME TO ABILITY</span>
          </div>
          <div className="w-14 md:w-16 h-full bg-[#f8f8f8] hover:bg-[#f0f0f0] border-l border-[#cccccc] flex items-center justify-center transition-colors">
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
              {/* <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" /> */}
            </svg>
          </div>
        </div>

        {/* 2. Breadcrumbs Skeleton (Word Library > Canteen > Biscuit) */}
        <div className="flex items-center gap-2 mb-3.5 text-xs select-none">
          <div className="h-3.5 w-20 rounded bg-slate-200 animate-pulse" />
          <span className="text-slate-300">›</span>
          <div className="h-3.5 w-16 rounded bg-slate-200 animate-pulse" />
          <span className="text-slate-300">›</span>
          <div className="h-3.5 w-14 rounded bg-slate-200 animate-pulse" />
        </div>

        {/* 3. Main Player & Meta Row */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 items-start w-full">
          
          {/* Left Column: Video Card */}
          <div className="w-full lg:w-[65%] flex flex-col">
            <div className="w-full aspect-[16/9.5] rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-black relative">
              <video
                ref={videoRef}
                src="/assets/welcomevideo.mp4"
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />

              {/* YouTube Embed Controls Overlay matching screenshot */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3.5">
                {/* Top Overlay Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#00897B] text-white flex items-center justify-center text-xs font-semibold">
                      A
                    </div>
                    <div className="flex flex-col">
                      <div className="h-3.5 w-20 rounded bg-white/70 animate-pulse" />
                      <div className="h-2.5 w-24 rounded bg-white/40 animate-pulse mt-0.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    {/* Audio icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    {/* CC icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15h3M14 15h3"/></svg>
                    {/* Settings icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </div>
                </div>

                {/* Center Replay Icon (exact same as screenshot) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-full bg-black/35 flex items-center justify-center text-white/90 backdrop-blur-[2px]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.57L21 8" />
                      <polyline points="21 3 21 8 16 8" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Overlay Controls */}
                <div className="flex flex-col gap-1.5">
                  {/* YouTube Red Progress Bar */}
                  <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[#FF0000]" />
                  </div>
                  <div className="flex items-center justify-between text-white text-[11px] pt-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono">0:02 / 0:02</span>
                      <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <svg className="w-3.5 h-3.5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                      <div className="flex items-center gap-1 font-bold text-xs tracking-tighter select-none">
                        <span className="w-3.5 h-2.5 bg-[#FF0000] rounded-sm flex items-center justify-center"><svg className="w-1.5 h-1.5 text-white fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></span>
                        YouTube
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Meta Skeletons matching screenshot */}
          <div className="w-full lg:w-[35%] flex flex-col pt-1">
            {/* Badge & Bookmark/Share Row */}
            <div className="flex items-center justify-between w-full">
              {/* Category Badge Skeleton (CANTEEN) */}
              <div className="h-7 w-20 rounded-md bg-[#2A2DBB]/80 animate-pulse" />
              
              {/* Action Buttons Skeletons (Bookmark & Share) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </div>
              </div>
            </div>

            {/* Title Skeleton (matching "Biscuit" in screenshot) */}
            <div className="h-9 w-44 rounded-lg bg-slate-200 animate-pulse mt-5" />
          </div>

        </div>

        {/* 4. Related Content Section (Skeletons matching screenshot) */}
        <div className="w-full flex flex-col mt-2">
          {/* Section Header Skeleton */}
          <div className="h-5 w-36 rounded-md bg-slate-200 animate-pulse mb-4" />

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-slate-200/80 bg-white">
                {/* Card Thumbnail Skeleton matching dark navy signer background */}
                <div className="w-full aspect-[16/10] bg-[#0d2238]/75 animate-pulse relative" />
                
                {/* Card Body Skeleton */}
                <div className="p-3 bg-white flex items-center justify-between">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3.5 w-20 rounded bg-slate-200 animate-pulse" />
                    <div className="h-2.5 w-14 rounded bg-slate-100 animate-pulse" />
                  </div>
                  <div className="w-5 h-5 flex items-center justify-center text-slate-300">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
