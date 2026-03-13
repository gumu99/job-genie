import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { UserPreferences } from "@/types/job";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInterface from "@/components/ChatInterface";
import JobResults from "@/components/JobResults";

type AppView = "welcome" | "chat" | "results";

const Index = () => {
  const [view, setView] = useState<AppView>("welcome");
  const [preferences, setPreferences] = useState<UserPreferences>({});

  const handleChatComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    setView("results");
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md">
      <AnimatePresence mode="wait">
        {view === "welcome" && <WelcomeScreen key="welcome" onStart={() => setView("chat")} />}
        {view === "chat" && <ChatInterface key="chat" onComplete={handleChatComplete} />}
        {view === "results" && (
          <JobResults key="results" preferences={preferences} onBack={() => setView("chat")} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
