"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="text-center mt-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-6"
      >
        Turn Dev Content into{" "}
        <span className="text-blue-500">Viral Threads & LinkedIn Posts</span>
      </motion.h1>

      <p className="text-gray-400">
        Paste a YouTube link. Get developer content instantly.
      </p>
    </div>
  );
}