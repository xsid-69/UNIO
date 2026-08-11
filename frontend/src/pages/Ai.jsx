import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, Brain, Info, Sparkle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const suggestions = ['Explain recursion simply', 'Plan a 45-minute revision session', 'Create a DSA practice checklist'];

const Ai = () => {
  const navigate = useNavigate();
  const endRef = useRef(null);
  const timeoutRef = useRef(null);
  const [messages, setMessages] = useState([{ id: 1, text: 'Tell me what you are studying. I can help you turn it into a clearer first step.', sender: 'ai' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }), [messages, typing]);
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);
  const send = (value) => {
    const text = value.trim();
    if (!text || typing) return;
    setMessages((current) => [...current, { id: Date.now(), text, sender: 'user' }]); setInput(''); setTyping(true);
    timeoutRef.current = window.setTimeout(() => { setMessages((current) => [...current, { id: Date.now() + 1, text: 'Study AI is currently a preview. Live subject-aware explanations will appear here when the learning service is connected.', sender: 'ai' }]); setTyping(false); }, 700);
  };
  return <section className="chat-shell">
    <header className="chat-header"><div className="page-header__lead"><button type="button" className="icon-button" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={20} /></button><div><p className="context-label">Learning assistant</p><h1>Study AI</h1><p>Turn a difficult topic into a practical next step.</p></div></div><span className="preview-badge"><Sparkle size={16} /> Preview</span></header>
    <div className="chat-feed app-scrollbar" aria-live="polite"><div className="assistant-intro"><span className="assistant-intro__icon"><Brain size={28} weight="duotone" /></span><h2>Start with the part that feels unclear.</h2><p>This is a UI preview; prompts stay in this browser session and are not sent to an AI service.</p><div className="assistant-notice"><Info size={17} /><span>No AI backend is connected yet.</span></div><div className="suggestion-list">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setInput(suggestion)}>{suggestion}</button>)}</div></div>{messages.map((message) => <div key={message.id} className={`chat-message chat-message--${message.sender}`}>{message.text}</div>)}{typing && <div className="chat-message chat-message--ai" role="status">Preparing preview…</div>}<div ref={endRef} /></div>
    <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send(input); }}><label htmlFor="study-question" className="sr-only">Ask the study assistant</label><input id="study-question" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a concept or study plan" /><button type="submit" disabled={!input.trim() || typing} aria-label="Send question"><ArrowUp size={19} weight="bold" /></button></form>
  </section>;
};

export default Ai;
