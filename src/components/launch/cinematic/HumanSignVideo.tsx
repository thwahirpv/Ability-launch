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
            console.warn("Video unmuted autoplay blocked, retrying muted:", err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }

        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // Safety Fallback: video is ~2.87s; watchdog at 4.5s guarantees transition
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
      className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center bg-white opacity-0"
    >
      <video
        ref={videoRef}
        src="/assets/welcomevideo.mp4"
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
