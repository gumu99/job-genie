import { motion } from "framer-motion";
import { MapPin, ExternalLink, Clock, Zap } from "lucide-react";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  index: number;
}

const JobCard = ({ job, index }: JobCardProps) => {
  return (
    <motion.div
      className="glass-panel glass-panel-hover rounded-2xl p-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.1 }}
    >
      <div className="flex items-start gap-4">
        {/* Company logo placeholder */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-lg font-bold text-primary">
          {job.company.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground leading-tight">{job.title}</h3>
              <p className="mt-0.5 font-body text-sm text-muted-foreground">{job.company}</p>
            </div>
            {job.matchScore && (
              <span className="flex shrink-0 items-center gap-1 rounded-lg bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
                <Zap className="h-3 w-3" />
                {job.matchScore}%
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            {job.postedAt && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.postedAt}
              </span>
            )}
          </div>

          <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          <div className="mt-4 flex justify-end">
            <motion.a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-btn inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Apply
              <ExternalLink className="h-3.5 w-3.5" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
