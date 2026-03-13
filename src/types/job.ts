export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  logoUrl?: string;
  postedAt?: string;
  matchScore?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chips?: string[];
}

export interface UserPreferences {
  role?: string;
  location?: string;
  workType?: string;
  experience?: string;
  skills?: string;
  salary?: string;
}
