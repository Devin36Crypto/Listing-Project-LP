import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Settings, Log, Session, AppMode } from '../types';
import { saveSession } from '../services/db';

interface UseAudioSessionProps {
  settings: Settings;
}

export function useAudioSession({ settings }: UseAudioSessionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const logsRef = useRef<Log[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<any>(null); // GoogleGenAI Session
  const currentSessionIdRef = useRef<string | null>(null);
  const lastVolumeUpdateRef = useRef<number>(0);

  // Helper to update logs state and ref
  const addLog = useCallback((log: Log) => {
    setLogs(prev => {
      const newLogs = [...prev, log];
      logsRef.current = newLogs;
      return newLogs;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    logsRef.current = [];
  }, []);

  // Initialize Audio Context
  const initAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: settings.noiseCancellationLevel !== 'off',
          autoGainControl: true
        } 
      });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.audioWorklet.addModule(new URL('../workers/audio.processor.ts', import.meta.url));

      const source = audioContext.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioContext, 'audio-processor');

      worklet.port.onmessage = (event) => {
        const float32Data = event.data;
        // Convert Float32 to Int16 for Gemini
        const int16Data = new Int16Array(float32Data.length);
        for (let i = 0; i < float32Data.length; i++) {
          const s = Math.max(-1, Math.min(1, float32Data[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Calculate volume for visualizer
        // Throttle updates to ~60fps (16ms)
        const now = Date.now();
        if (now - lastVolumeUpdateRef.current > 30) {
            let sum = 0;
            for (let i = 0; i < float32Data.length; i++) {
                sum += float32Data[i] * float32Data[i];
            }
            const rms = Math.sqrt(sum / float32Data.length);
            setVolume(Math.min(1, rms * 5)); // Boost a bit for visualizer
            lastVolumeUpdateRef.current = now;
        }

        // Send to Gemini if connected
        if (sessionRef.current && isRecording) {
            // Convert to base64
            const base64Data = btoa(String.fromCharCode(...new Uint8Array(int16Data.buffer)));
            sessionRef.current.then((session: any) => {
                session.sendRealtimeInput({
                    media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
            });
        }
      };

      source.connect(worklet);
      // worklet.connect(audioContext.destination); // Don't connect to destination to avoid feedback loop

      audioContextRef.current = audioContext;
      workletNodeRef.current = worklet;
      sourceNodeRef.current = source;
      
      // Initialize Playback Context
      if (!playbackContextRef.current) {
        playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      return true;
    } catch (err) {
      console.error("Audio init error:", err);
      setError("Failed to access microphone. Please check permissions.");
      return false;
    }
  };

  const disconnect = useCallback(async () => {
    // Close session
    if (sessionRef.current) {
        sessionRef.current.then((session: any) => {
            try {
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
        });
        sessionRef.current = null;
    }
    
    if (audioContextRef.current) {
        audioContextRef.current.suspend();
    }

    setIsConnected(false);
    setIsRecording(false);

    // Save session to DB using ref to avoid stale closure
    if (currentSessionIdRef.current && logsRef.current.length > 0) {
        const sessionToSave: Session = {
            id: currentSessionIdRef.current,
            startTime: logsRef.current[0].timestamp,
            endTime: new Date(),
            logs: logsRef.current,
            mode: AppMode.VOICE_CONVERSATION,
            targetLanguage: settings.targetLanguage,
            speakerRegistry: {}
        };
        await saveSession(sessionToSave, null);
    }
  }, [settings.targetLanguage]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
        setIsOffline(true);
        if (isConnected) {
            disconnect();
            setError("Internet connection lost. Session paused.");
        }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [isConnected, disconnect]);

  const connect = useCallback(async () => {
    if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
        return;
    }

    try {
      setError(null);
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key not found. Please set VITE_GEMINI_API_KEY in environment variables.");
      }

      const client = new GoogleGenAI({ apiKey });
      
      // Start a new session log
      const newSessionId = crypto.randomUUID();
      currentSessionIdRef.current = newSessionId;
      clearLogs();

      const sessionPromise = client.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
            onopen: () => {
                setIsConnected(true);
                setIsRecording(true);
            },
            onmessage: (message: LiveServerMessage) => {
                // Handle audio output
                const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData) {
                    playAudio(audioData);
                }

                // Handle text transcription
                const textPart = message.serverContent?.modelTurn?.parts?.find(p => p.text);
                if (textPart && textPart.text) {
                     const newLog: Log = {
                        id: crypto.randomUUID(),
                        role: 'model',
                        text: textPart.text,
                        timestamp: new Date()
                    };
                    addLog(newLog);
                }
            },
            onclose: () => {
                setIsConnected(false);
                setIsRecording(false);
            },
            onerror: (err: any) => {
                console.error("Gemini Live Error:", err);
                setError("Connection error: " + (err.message || String(err)));
                disconnect();
            }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voice || "Puck" } }
            },
            systemInstruction: `You are a helpful translator and assistant. Your target language is ${settings.targetLanguage}. Translate what you hear or answer questions.`
        }
      });

      sessionRef.current = sessionPromise;

      // Initialize audio if not already
      if (!audioContextRef.current) {
        await initAudio();
      } else {
        audioContextRef.current.resume();
      }
      
      if (playbackContextRef.current?.state === 'suspended') {
        playbackContextRef.current.resume();
      }

    } catch (err: any) {
      console.error("Connection failed:", err);
      setError(err.message || "Failed to connect");
      setIsConnected(false);
    }
  }, [settings, addLog, clearLogs, disconnect]);

  const playAudio = async (base64Data: string) => {
    if (!settings.autoSpeak) return;
    
    try {
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        if (!playbackContextRef.current) {
            playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
        }
        const audioCtx = playbackContextRef.current;
        
        const buffer = audioCtx.createBuffer(1, bytes.length / 2, 24000);
        const channelData = buffer.getChannelData(0);
        const int16 = new Int16Array(bytes.buffer);
        
        for (let i = 0; i < int16.length; i++) {
            channelData[i] = int16[i] / 32768.0;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        
        // Schedule playback
        const currentTime = audioCtx.currentTime;
        if (nextStartTimeRef.current < currentTime) {
            nextStartTimeRef.current = currentTime;
        }
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += buffer.duration;
        
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  const toggleRecording = useCallback(() => {
    if (isConnected) {
        disconnect();
    } else {
        connect();
    }
  }, [isConnected, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (playbackContextRef.current) {
        playbackContextRef.current.close();
      }
      if (sessionRef.current) {
        sessionRef.current.then((session: any) => {
            try {
                session.close();
            } catch (e) {
                console.error("Error closing session on unmount:", e);
            }
        });
        sessionRef.current = null;
      }
    };
  }, []);

  return {
    isConnected,
    isRecording,
    logs,
    volume,
    error,
    isOffline,
    toggleRecording
  };
}
