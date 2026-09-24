"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AbilityBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-center items-center mb-2 md:mb-3"
    >
      <Image
        src="/assets/logo_svg.svg"
        alt="Ability Logo"
        width={70}
        height={70}
        priority
        className="w-[45px] sm:w-[52px] md:w-[100px] h-auto object-contain"
      />
    </motion.div>
  );
}

