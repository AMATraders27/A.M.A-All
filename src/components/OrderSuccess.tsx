import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="relative inline-block">
          <CheckCircle className="w-24 h-24 text-primary animate-pulse" />
          <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-white opacity-40" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold italic tracking-tighter">Order Confirmed</h1>
          <p className="text-gray-400 font-light text-lg italic">
            Your selection has been verified and registered. Our concierge will contact you shortly to coordinate your legacy delivery.
          </p>
        </div>

        <div className="bg-white/5 p-8 border border-white/10 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">Transaction ID: RIC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <div className="h-[1px] w-12 bg-primary mx-auto" />
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Priority Processing Active</p>
        </div>

        <div className="pt-8">
          <Link to="/">
            <Button className="w-full h-16 rounded-none bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 uppercase tracking-[0.4em] font-bold text-xs group">
              Return to Boutique <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
