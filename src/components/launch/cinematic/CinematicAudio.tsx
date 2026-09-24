"use client";

import { useEffect } from "react";
import { LaunchState } from "@/lib/launch/launch-state";
import { launchAudio } from "@/lib/launch/launch-audio";

interface CinematicAudioProps {
  currentState: LaunchState;
}

export default function CinematicAudio({ currentState }: CinematicAudioProps) {
  useEffect(() => {
    // Initialize audio architecture cleanly on first user interaction
    const handleFirstInteraction = () => {
      launchAudio.init();
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      launchAudio.cleanup();
    };
  }, []);

  useEffect(() => {
    launchAudio.handleStateChange(currentState);
  }, [currentState]);

  return null;
}
