"use client";

import { LaunchState } from "@/lib/launch/launch-state";
import LaunchOpening from "./opening/LaunchOpening";

interface LaunchUIProps {
  currentState: LaunchState;
  onStateChange: (newState: LaunchState) => void;
}

export default function LaunchUI({ currentState, onStateChange }: LaunchUIProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="w-full h-full pointer-events-auto">
        <LaunchOpening currentState={currentState} onStateChange={onStateChange} />
      </div>
    </div>
  );
}
