import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Play, Pause, Volume2, Loader2, Headphones } from "lucide-react";
import { generateSpeech } from "../services/gemini";

export default function TTSDemo() {
  const [text, setText] = useState("Welcome to the Listening Project. Experience crystal clear audio synthesis.");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setAudioSrc(null);
    
    const base64Audio = await generateSpeech(text);
    
    if (base64Audio) {
      const src = `data:audio/mp3;base64,${base64Audio}`;
      setAudioSrc(src);
      // Auto play when ready
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
    
    setIsLoading(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[64px] -translate-y-1/2 translate-x-1/2" />
          <Headphones className="absolute -bottom-12 -left-12 w-64 h-64 text-white/[0.03] rotate-12 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-6 h-6 text-brand-400" />
              <h2 className="text-2xl font-bold font-display">Experience Our Voice</h2>
            </div>
            
            <p className="text-gray-400 mb-8">
              Type anything below to hear our advanced text-to-speech engine in action. 
              This is the same technology that powers the Listening Project's accessibility features.
            </p>

            <div className="space-y-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors h-32 resize-none"
                placeholder="Type something to listen..."
                aria-label="Text to speech input"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !text.trim()}
                  className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Generate Speech
                    </>
                  )}
                </button>

                {audioSrc && (
                  <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full">
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>
                    <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: isPlaying ? "100%" : "0%" }}
                        transition={{ duration: 3, ease: "linear", repeat: isPlaying ? Infinity : 0 }}
                        className="h-full bg-brand-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={audioSrc || undefined}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
