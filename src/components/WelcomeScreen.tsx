import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="glass-panel glass-panel-hover w-full max-w-md rounded-3xl p-10 text-center"
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      >
        {/* Glow effect */}
        <div className="pointer-events-none absolute -inset-1 rounded-3xl opacity-30 blur-2xl"
          style={{ background: "var(--gradient-primary)" }}
        />

        <motion.div
          className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: "var(--gradient-primary)" }}
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </motion.div>

        <h1 className="relative mb-3 font-display text-3xl font-bold tracking-tight text-foreground">
          Find Your <span className="gradient-text">Dream Job</span>
        </h1>

        <p className="relative mb-8 font-body text-muted-foreground">
          Your AI-powered career companion. Tell me what you're looking for, and I'll find the perfect opportunities.
        </p>

        <motion.button
          onClick={onStart}
          className="gradient-btn relative inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-display text-lg font-semibold"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
