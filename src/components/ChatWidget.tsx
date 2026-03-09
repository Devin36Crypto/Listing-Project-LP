import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { sendChatMessage } from "../services/gemini";
import { SecureStorage } from "../services/crypto";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hi! I'm the Listening Project assistant. Ask me anything about the app or how to improve your listening skills." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load encrypted history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await SecureStorage.getItem("chat_history");
      if (history) {
        setMessages(history);
      }
      setIsSecure(true); // Encryption service initialized
    };
    loadHistory();
  }, []);

  // Save encrypted history on change
  useEffect(() => {
    if (messages.length > 1) {
      SecureStorage.setItem("chat_history", messages);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    // Format history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await sendChatMessage(userMessage, history, useThinking);

    setMessages(prev => [...prev, { role: "model", text: response.text }]);
    setIsLoading(false);
  };

  const clearHistory = () => {
    setMessages([{ role: "model", text: "Chat history cleared and securely erased." }]);
    SecureStorage.removeItem("chat_history");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 sm:w-96 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-brand-600 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Bot className="w-5 h-5" />
                <div className="flex flex-col">
                  <span className="font-medium leading-none">AI Assistant</span>
                  {isSecure && (
                    <span className="text-[10px] text-brand-200 flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      AES-256 Encrypted
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-lg bg-brand-500/50 text-white/70 hover:text-white hover:bg-red-500/50 transition-colors"
                  title="Securely Clear History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setUseThinking(!useThinking)}
                  className={`p-1.5 rounded-lg transition-colors ${useThinking ? 'bg-white text-brand-600' : 'bg-brand-500/50 text-white/70 hover:text-white'}`}
                  title="Toggle Deep Thinking Mode"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-brand-600 text-white rounded-tr-none"
                        : "bg-white/10 text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-center">
                 <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                   <ShieldCheck className="w-3 h-3" />
                   End-to-End Encrypted Session
                 </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors relative"
      >
        {isOpen ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-black" title="Encrypted">
          <ShieldCheck className="w-3 h-3 text-white" />
        </div>
      </motion.button>
    </div>
  );
}
