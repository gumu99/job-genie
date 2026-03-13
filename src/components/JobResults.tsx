import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Zap } from "lucide-react";
import { Job, UserPreferences } from "@/types/job";
import { searchJobs } from "@/lib/jobSearch";
import JobCard from "./JobCard";

interface JobResultsProps {
  preferences: UserPreferences;
  onBack: () => void;
}

const JobResults = ({ preferences, onBack }: JobResultsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickApplyMode, setQuickApplyMode] = useState(false);

  useEffect(() => {
    searchJobs(preferences).then((results) => {
      setJobs(results);
      setLoading(false);
    });
  }, [preferences]);

  const handleQuickApply = () => {
    setQuickApplyMode(true);
    jobs.forEach((job, i) => {
      setTimeout(() => {
        window.open(job.applyUrl, "_blank");
      }, i * 1500);
    });
  };

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="glass-panel sticky top-0 z-10 px-5 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl glass-panel"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </motion.button>
            <div>
              <h2 className="font-display text-sm font-semibold text-foreground">Your Matches</h2>
              <p className="text-xs text-muted-foreground">
                {loading ? "Searching..." : `${jobs.length} jobs found`}
              </p>
            </div>
          </div>

          {!loading && jobs.length > 0 && (
            <motion.button
              onClick={handleQuickApply}
              disabled={quickApplyMode}
              className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="h-3.5 w-3.5" />
              Quick Apply
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-4 py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "var(--gradient-primary)" }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <p className="font-display text-sm font-medium text-muted-foreground">
                Finding your perfect matches...
              </p>
            </motion.div>
          ) : (
            <motion.div key="results" className="space-y-4">
              {jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JobResults;
