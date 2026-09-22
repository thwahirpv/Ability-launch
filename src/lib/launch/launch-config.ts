export const LaunchConfig = {
  // Video options to be decided later
  assets: {
    videoMp4: "/assets/hi_mp4.mp4",
    videoMov: "/assets/hi_mov.mov",
    logoSvg: "/assets/logo_svg.svg",
    ministerPhoto: "/assets/minister/minister_photo.png"
  },
  
  // Future development controls
  controls: {
    enableDevControls: process.env.NODE_ENV === "development",
    skipToWebsiteKey: "s",
    restartKey: "r"
  }
};
