import React, { useRef, useEffect } from 'react';
import { Log } from '../types';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatListProps {
  logs: Log[];
}

const ChatList: React.FC<ChatListProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
        <Bot size={48} className="opacity-20" />
        <p>Start speaking to translate...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {logs.map((log) => (
        <div 
            key={log.id} 
            className={`flex gap-4 ${log.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center ${
            log.role === 'user' ? 'bg-brand-500/20 text-brand-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {log.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          <div className={`flex-1 max-w-[80%] rounded-2xl p-4 ${
            log.role === 'user' 
                ? 'bg-brand-500/10 text-brand-100 rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none'
          }`}>
            <div className="markdown-body text-sm leading-relaxed">
                <ReactMarkdown>{log.text}</ReactMarkdown>
            </div>
            <div className="mt-2 text-[10px] opacity-50">
                {log.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatList;
