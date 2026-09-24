"use client";

import { motion } from "framer-motion";

export default function CommunicationPrompt() {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-lg sm:text-xl md:text-5xl font-bold text-[#0093dd] tracking-wider uppercase mb-1 text-center font-primary select-none"
      >
        MUDRA 26
      </motion.div>
      {/* <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-sm sm:text-base md:text-2xl font-medium text-slate-500 font-primary text-center tracking-tight"
      >
        What would you like to communicate?
      </motion.h1> */}
    </div>
  );
}

