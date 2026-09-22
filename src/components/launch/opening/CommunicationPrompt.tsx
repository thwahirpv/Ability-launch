"use client";

import { motion } from "framer-motion";

export default function CommunicationPrompt() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="text-3xl md:text-4xl lg:text-5xl font-medium text-primary-text font-primary text-center mb-16 tracking-tight"
    >
      What would you like to communicate?
    </motion.h1>
  );
}
