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
      className="absolute inset-0 z-15 pointer-events-none flex flex-col bg-white opacity-0 overflow-hidden p-4 md:p-6 lg:p-8"
    >
      <div className="w-full max-w-[1360px] mx-auto flex flex-col h-full">

        {/* 1. YouTube-style Search Box with Search Sentence */}
        <div className="w-full max-w-xl md:max-w-2xl h-11 mb-4 rounded-full border border-[#cccccc] bg-white flex items-center overflow-hidden shadow-sm mx-auto flex-shrink-0">
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

        {/* 2. Breadcrumbs (Word Library > Greetings > Welcome to ability) */}
        <div className="flex items-center gap-2 mb-2 text-xs select-none text-slate-500 font-medium flex-shrink-0">
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Word Library</span>
          <span className="text-slate-400">›</span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Greetings</span>
          <span className="text-slate-400">›</span>
          <span className="text-slate-900 font-semibold">Welcome to ability</span>
        </div>

        {/* 3. Main Player & Meta Row */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-24 mb-4 items-start w-full flex-1 min-h-0">
          {/* Left Column: Video Card */}
          <div className="h-full flex-shrink-0 max-w-full">
            <div className="h-full aspect-[16/9.5] max-w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-[#0c233c] relative">
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

          {/* Right Column: Meta Details */}
          <div className="flex flex-col pt-1 lg:pt-3 max-w-sm w-full items-start">
            {/* Badge & Bookmark/Share Row */}
            <div className="flex items-center justify-between w-full">
              {/* Category Badge (GREETINGS) in Blue */}
              <div className="px-3.5 py-1.5 rounded-lg bg-[#2538BA] text-white text-xs font-bold tracking-wider uppercase select-none">
                GREETINGS
              </div>

              {/* Action Buttons (Bookmark & Share) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title: Selected sentence (Welcome to ability) */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight mt-4">
              Welcome to ability
            </h1>
            
            {/* Description */}
            <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-3">
              A warm greeting used to welcome someone to Ability and make them feel accepted and included.
            </p>
          </div>

        </div>

        {/* 4. Related Content Section */}
        <div className="w-full flex flex-col flex-shrink-0">
          {/* Section Header */}
          <h2 className="text-sm md:text-base font-bold text-slate-900 mb-2 select-none">
            Related Content
          </h2>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 w-full">
            {[
              {
                title: "Hello",
                category: "Greetings",
                image: "/assets/skeltonimages/suggestion_1.png",
              },
              {
                title: "Good Morning",
                category: "Greetings",
                image: "/assets/skeltonimages/suggestion_2.png",
              },
              {
                title: "Good Afternoon",
                category: "Greetings",
                image: "/assets/skeltonimages/suggestion_3.png",
              },
              {
                title: "Good Evening",
                category: "Greetings",
                image: "/assets/skeltonimages/suggestion_4.png",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-slate-200/90 bg-white hover:shadow-md transition-shadow"
              >
                {/* Card Thumbnail */}
                <div className="w-full aspect-[16/10] bg-[#0c233c] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Body */}
                <div className="p-2.5 md:p-3 bg-white flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-xs md:text-sm leading-snug truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] md:text-xs text-slate-400 font-medium mt-0.5 truncate">
                      {item.category}
                    </span>
                  </div>
                  <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
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
