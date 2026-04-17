import { motion } from "motion/react";
import { ADMOB_CONFIG } from "@/src/lib/ads";

export default function AdBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="w-full max-w-[1600px] mx-auto px-8 py-12"
    >
      <div 
        className="w-full h-32 bg-secondary/20 border border-border flex flex-col items-center justify-center relative overflow-hidden group"
        data-ad-app-id={ADMOB_CONFIG.appId}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
        <div className="relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground opacity-50 mb-2 block">Advertisement</span>
          <div className="text-xs font-light italic text-muted-foreground group-hover:text-primary transition-colors">
            AdMob Mediation Space • {ADMOB_CONFIG.appId}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
        </div>
      </div>
    </motion.div>
  );
}
