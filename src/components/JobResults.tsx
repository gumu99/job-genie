import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { Job, UserPreferences } from "@/types/job";
import { searchJobs } from "@/lib/jobSearch";
import JobCard from "./JobCard";
import { toast } from "sonner";

interface JobResultsProps {
  preferences: UserPreferences;
  onBack: () => void;
}

const JobResults = ({ preferences, onBack }: JobResultsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchJobs(preferences);
      setJobs(results);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch jobs");
      toast.error(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [preferences]);

  const handleQuickApply = () => {
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
                {loading ? "Searching LinkedIn..." : `${jobs.length} jobs found`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={fetchJobs}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-muted-foreground hover:text-foreground disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </motion.button>

            {!loading && jobs.length > 0 && (
              <motion.button
                onClick={handleQuickApply}
                className="flex items-center gap-1.5 rounded-xl bg-accent/15 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-3.5 w-3.5" />
                Quick Apply
              </motion.button>
            )}
          </div>
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
                className="glow-accent mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "var(--gradient-primary)" }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <p className="font-display text-sm font-medium text-muted-foreground">
                AI is finding your perfect matches...
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Generating LinkedIn search results
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <p className="mb-2 font-display text-sm font-medium text-foreground">Something went wrong</p>
              <p className="mb-4 text-center text-xs text-muted-foreground">{error}</p>
              <motion.button
                onClick={fetchJobs}
                className="gradient-btn rounded-xl px-6 py-2 text-sm font-semibold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Try Again
              </motion.button>
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
