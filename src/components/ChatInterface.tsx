import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { ChatMessage, UserPreferences } from "@/types/job";

const QUESTIONS: { key: keyof UserPreferences; question: string; chips: string[] }[] = [
  { key: "role", question: "What job role are you looking for?", chips: ["Frontend Engineer", "Full Stack Developer", "Backend Engineer", "Product Designer"] },
  { key: "location", question: "What's your preferred location?", chips: ["San Francisco", "New York", "London", "Remote Anywhere"] },
  { key: "workType", question: "Do you prefer remote, hybrid, or onsite?", chips: ["Remote", "Hybrid", "Onsite", "No Preference"] },
  { key: "experience", question: "How many years of experience do you have?", chips: ["0-2 years", "3-5 years", "5-8 years", "8+ years"] },
  { key: "skills", question: "What are your key skills or technologies?", chips: ["React", "TypeScript", "Python", "Node.js"] },
  { key: "salary", question: "Any salary expectations? (Optional — you can skip)", chips: ["$80-120k", "$120-160k", "$160-200k", "Skip"] },
];

interface ChatInterfaceProps {
  onComplete: (preferences: UserPreferences) => void;
}

const ChatInterface = ({ onComplete }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show first question
    const q = QUESTIONS[0];
    setMessages([{ id: "q-0", role: "assistant", content: q.question, chips: q.chips }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleAnswer = (answer: string) => {
    const q = QUESTIONS[currentStep];
    const value = answer === "Skip" ? "" : answer;

    const newPrefs = { ...preferences, [q.key]: value };
    setPreferences(newPrefs);

    const userMsg: ChatMessage = { id: `u-${currentStep}`, role: "user", content: answer };
    setMessages((prev) => [...prev, userMsg]);

    const nextStep = currentStep + 1;

    if (nextStep >= QUESTIONS.length) {
      // Done
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: "done", role: "assistant", content: "Perfect! Let me find the best jobs for you... ✨" },
        ]);
        setTimeout(() => onComplete(newPrefs), 1200);
      }, 500);
    } else {
      setCurrentStep(nextStep);
      const next = QUESTIONS[nextStep];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `q-${nextStep}`, role: "assistant", content: next.question, chips: next.chips },
        ]);
      }, 500);
    }

    setInputValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleAnswer(inputValue.trim());
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="glass-panel sticky top-0 z-10 flex items-center gap-3 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold text-foreground">Job Search AI</h2>
          <p className="text-xs text-muted-foreground">Let's find your perfect role</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-lg space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 font-body text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass-panel rounded-bl-md"
                  }`}
                >
                  <p>{msg.content}</p>

                  {/* Suggestion chips */}
                  {msg.chips && msg.role === "assistant" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.chips.map((chip) => (
                        <motion.button
                          key={chip}
                          onClick={() => handleAnswer(chip)}
                          className="glass-panel rounded-xl px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {chip}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <div className="glass-panel sticky bottom-0 px-4 py-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your answer..."
            className="glass-panel flex-1 rounded-2xl px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <motion.button
            type="submit"
            className="gradient-btn flex h-11 w-11 items-center justify-center rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
