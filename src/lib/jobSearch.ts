import { Job, UserPreferences } from "@/types/job";

// Mock job data - replace with real API integration
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Stripe",
    location: "San Francisco, CA (Remote)",
    description: "Build the future of online payments with cutting-edge React and TypeScript. Join a world-class team shipping products used by millions.",
    applyUrl: "https://stripe.com/jobs",
    postedAt: "2d ago",
    matchScore: 95,
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "Vercel",
    location: "Remote",
    description: "Work on Next.js and the future of web development. Help developers build faster, more reliable web applications.",
    applyUrl: "https://vercel.com/careers",
    postedAt: "1d ago",
    matchScore: 91,
  },
  {
    id: "3",
    title: "Software Engineer, Platform",
    company: "Figma",
    location: "New York, NY (Hybrid)",
    description: "Build the collaborative design platform used by millions of designers and developers worldwide.",
    applyUrl: "https://figma.com/careers",
    postedAt: "3d ago",
    matchScore: 87,
  },
  {
    id: "4",
    title: "React Developer",
    company: "Linear",
    location: "Remote (US/EU)",
    description: "Help build the fastest project management tool. We value craft, speed, and attention to detail.",
    applyUrl: "https://linear.app/careers",
    postedAt: "5h ago",
    matchScore: 84,
  },
  {
    id: "5",
    title: "Frontend Engineer",
    company: "Notion",
    location: "San Francisco, CA",
    description: "Create the all-in-one workspace that millions use daily. Work with a passionate team redefining productivity.",
    applyUrl: "https://notion.so/careers",
    postedAt: "1w ago",
    matchScore: 80,
  },
];

/**
 * Fetch jobs based on user preferences.
 * Currently returns mock data. Replace with real API call.
 */
export async function searchJobs(_preferences: UserPreferences): Promise<Job[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return MOCK_JOBS;
}

/**
 * Build a structured query from user preferences.
 * This would be sent to GPT in a real implementation.
 */
export function buildSearchQuery(preferences: UserPreferences): string {
  const parts: string[] = [];
  if (preferences.role) parts.push(preferences.role);
  if (preferences.location) parts.push(`in ${preferences.location}`);
  if (preferences.workType) parts.push(preferences.workType);
  if (preferences.experience) parts.push(`${preferences.experience} experience`);
  if (preferences.skills) parts.push(`skills: ${preferences.skills}`);
  return parts.join(" | ");
}
