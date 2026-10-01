import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  UserCheck,
  AlertCircle,
  HelpCircle,
  BookOpen,
  CornerDownRight,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { queryAIDispatchAgent, INITIAL_KNOWLEDGE_DOCS } from '../services/ai/aiDispatchAgent';
import { AIChatMessage, KnowledgeDoc } from '../types';

export const AIDispatchBotView: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'MSG-001',
      sender: 'AI_BOT',
      text: 'Assalam-o-Alaikum! YourMart AI Customer Support Assistant mein khushamdeed. Main order tracking, shipping policies, COD advance fees aur return claims ke baray mein 24/7 aapki madad kar sakta hoon.',
      timestamp: '10:00 AM',
      confidenceScore: 0.99,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [escalated, setEscalated] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: AIChatMessage = {
      id: `USR-${Date.now()}`,
      sender: 'CUSTOMER',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentInput = inputText;
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = queryAIDispatchAgent(currentInput, INITIAL_KNOWLEDGE_DOCS);
      const botMsg: AIChatMessage = {
        id: `BOT-${Date.now()}`,
        sender: response.needsHumanEscalation ? 'HUMAN_AGENT' : 'AI_BOT',
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: response.confidenceScore,
        escalatedToHuman: response.needsHumanEscalation,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (response.needsHumanEscalation) {
        setEscalated(true);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/60 p-5 rounded-2xl border border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">AI Dispatch & Customer Support Bot</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Live RAG Knowledge Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomous Urdu & English customer support trained on return rules, delivery windows & COD policies
            </p>
          </div>
        </div>

        {escalated && (
          <div className="flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <UserCheck className="w-4 h-4" />
            <span>Human Handoff Active</span>
          </div>
        )}
      </div>

      {/* Main Bot Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[580px] shadow-2xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender !== 'CUSTOMER' && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      m.sender === 'HUMAN_AGENT' ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {m.sender === 'HUMAN_AGENT' ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1 shadow ${
                    m.sender === 'CUSTOMER'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : m.sender === 'HUMAN_AGENT'
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-200 rounded-bl-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className="flex justify-between items-center text-[10px] opacity-60 pt-1">
                    <span>{m.timestamp}</span>
                    {m.confidenceScore && (
                      <span>AI Confidence: {Math.round(m.confidenceScore * 100)}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-xs text-slate-400">
                <div className="w-8 h-8 rounded-full bg-indigo-600/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-300" />
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-xl text-slate-400 animate-pulse">
                  AI assistant sooch raha hai...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0">Quick Tests:</span>
            {[
              'Delivery kitne din mein aati hai?',
              'Agar parcel damaged ho to kya karein?',
              'Rs. 200 advance delivery fee kyun hai?',
              'Manager se baat karni hai complaint hai',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(prompt)}
                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything in Roman Urdu or English..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Knowledge Base Reference Card */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Active Training Knowledge Base</span>
            </div>
            <div className="space-y-3">
              {INITIAL_KNOWLEDGE_DOCS.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1 text-xs"
                >
                  <div className="font-semibold text-indigo-300">{doc.title}</div>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{doc.content}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.keywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded font-mono"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
