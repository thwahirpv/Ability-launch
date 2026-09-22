"use client";

export default function WebsiteRevealLayer() {
  return (
    // We match the background color of the destination website (#F8FAFC) to make the transition smooth before the redirect
    <div className="absolute inset-0 z-0 bg-[#F8FAFC]" />
  );
}
