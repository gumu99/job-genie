import { supabase } from "@/integrations/supabase/client";
import { Job, UserPreferences } from "@/types/job";

/**
 * Fetch jobs using GPT-powered search via edge function.
 */
export async function searchJobs(preferences: UserPreferences): Promise<Job[]> {
  const { data, error } = await supabase.functions.invoke("job-search", {
    body: { preferences },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Failed to search jobs");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.jobs || [];
}

/**
 * Build a structured query from user preferences (for display).
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
