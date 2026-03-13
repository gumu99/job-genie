import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a job search assistant. Given user preferences, generate realistic LinkedIn job listings that match their criteria.

Return a JSON array of 6-8 job objects. Each object must have:
- "id": unique string
- "title": job title
- "company": real company name that would hire for this role
- "location": location matching user preference
- "description": 1-2 sentence compelling job description
- "applyUrl": a LinkedIn job search URL like "https://www.linkedin.com/jobs/search/?keywords=<encoded job title>&location=<encoded location>"
- "postedAt": random recent time like "2h ago", "1d ago", "3d ago", "1w ago"
- "matchScore": number 70-99 representing match quality

Make the results realistic and diverse. Use real company names known for hiring in the specified field. Return ONLY the JSON array, no markdown or explanation.`;

    const userMessage = `Find jobs matching these preferences:
- Role: ${preferences.role || "Software Engineer"}
- Location: ${preferences.location || "Remote"}
- Work Type: ${preferences.workType || "Remote"}
- Experience: ${preferences.experience || "3-5 years"}
- Skills: ${preferences.skills || "Not specified"}
- Salary: ${preferences.salary || "Not specified"}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the JSON from the response (strip markdown code fences if present)
    let jobs;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      jobs = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      jobs = [];
    }

    return new Response(JSON.stringify({ jobs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("job-search error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
