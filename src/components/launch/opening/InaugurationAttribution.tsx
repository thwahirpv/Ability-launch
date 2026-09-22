"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Use exact approved information
const MINISTER_NAME = "AP Anilkumar";
const MINISTER_DESIGNATION = "Minister for Land Revenue and Survey";

export default function InaugurationAttribution() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-12 right-12 z-30 flex items-center gap-5"
    >
      <div className="text-right whitespace-nowrap">
        <p className="text-xs uppercase tracking-widest text-secondary-text font-secondary mb-1">
          Inaugurated by
        </p>
        <h2 className="text-base font-semibold text-primary-text font-primary">
          {MINISTER_NAME}
        </h2>
        <p className="text-xs text-secondary-text font-secondary mt-0.5">
          {MINISTER_DESIGNATION}
        </p>
      </div>

      {/* Added shrink-0 to ensure flexbox doesn't squish it into an oval, guaranteeing a perfect circle. Increased size as requested. */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden border-2 border-slate-100 bg-surface shadow-sm">
        <Image
          src="/assets/minister_photo.png"
          alt="Inauguration Minister"
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 80px, 96px"
        />
      </div>
    </motion.div>
  );
}
