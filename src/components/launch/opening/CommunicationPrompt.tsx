"use client";

import { motion } from "framer-motion";

export default function CommunicationPrompt() {
  return (
    <div className="flex flex-col items-center mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-2xl md:text-3xl lg:text-8xl font-bold text-[#2A2DBB] tracking-wider uppercase mb-3 md:mb-4 text-center font-primary select-none"
      >
        MUDRA 26
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl md:text-4xl lg:text-5xl font-medium text-primary-text font-primary text-center tracking-tight"
      >
        What would you like to communicate?
      </motion.h1>
    </div>
  );
}

