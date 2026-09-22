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
        width={100}
        height={100}
        priority
        className="w-[60px] md:w-[90px] lg:w-[90px] h-auto object-contain"
      />
    </motion.div>
  );
}
