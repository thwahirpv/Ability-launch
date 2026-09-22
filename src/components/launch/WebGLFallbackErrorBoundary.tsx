"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class WebGLFallbackErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL or Canvas failed to mount. Falling back to non-WebGL cinematic mode.", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Graceful fallback: render a dark background to replace the WebGL scene,
      // allowing the HTML overlays (video, text, logo) to still function perfectly.
      return <div className="absolute inset-0 bg-[#05081c] z-10" />;
    }

    return this.props.children;
  }
}
