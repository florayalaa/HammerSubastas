import { motion } from "motion/react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#6A4F99] via-[#C9A063] to-[#A08C79] flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            HAMMER
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Tu plataforma de subastas de confianza
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
