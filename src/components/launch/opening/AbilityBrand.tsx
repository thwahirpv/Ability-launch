"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AbilityBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic easing
      className="absolute top-16 left-1/2 -translate-x-1/2 z-30"
    >
      <Image
        src="/assets/logo_svg.svg"
        alt="Ability Logo"
        width={160}
        height={40}
        priority
        className="w-auto h-8 md:h-10 lg:h-12"
      />
    </motion.div>
  );
}
