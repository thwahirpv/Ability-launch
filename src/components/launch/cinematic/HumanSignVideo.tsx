"use client";

import { useEffect, useRef, useState } from "react";
import { LaunchState } from "@/lib/launch/launch-state";
import gsap from "gsap";
import { Lottie, LottieHandle } from "lottie-react";

interface HumanSignVideoProps {
  currentState: LaunchState;
  onComplete: () => void;
}

export default function HumanSignVideo({ currentState, onComplete }: HumanSignVideoProps) {
  const lottieRef = useRef<LottieHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationData, setAnimationData] = useState<any>(null);

  // Load the Lottie JSON dynamically to prevent initial bundle bloat
  useEffect(() => {
    fetch("/assets/hi_json.json")
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => {
        console.warn("Failed to load Lottie animation data:", err);
      });
  }, []);

  // Handle timeline entrance and exit
  useEffect(() => {
    if (currentState === LaunchState.SIGN_ACTIVE) {
      if (containerRef.current) {
        if (lottieRef.current) {
          lottieRef.current.stop();
          lottieRef.current.play();
        }

        gsap.to(containerRef.current, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
        });
      }

      // Safety Fallback: if animation hangs and never fires onComplete, force completion
      const failsafe = setTimeout(() => {
        console.warn("Animation watchdog triggered: onComplete did not fire.");
        onComplete();
      }, 5000); // Max 5 seconds for the animation
      return () => clearTimeout(failsafe);

    } else if (currentState === LaunchState.SIGN_COMPLETE) {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.3,
          delay: 0.5, // Brief hold on completed gesture before dissolving
          ease: "power2.inOut",
        });
      }
    } else if (currentState === LaunchState.IDLE) {
      // Reset logic
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
        containerRef.current.style.opacity = "0";
      }
      if (lottieRef.current) {
        lottieRef.current.stop();
      }
    }
  }, [currentState, onComplete, animationData]);

  const handleAnimationComplete = () => {
    if (currentState === LaunchState.SIGN_ACTIVE) {
      onComplete();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center opacity-0"
    >
      <div className="relative w-full h-[35vh] md:h-[45vh] max-h-full flex justify-center items-center">
        {animationData && (
          <Lottie
            lottieRef={lottieRef}
            src={animationData}
            loop={false}
            autoplay={false}
            subscriptions={{ complete: handleAnimationComplete }}
            className="h-full w-auto object-contain"
          />
        )}
      </div>
    </div>
  );
}
