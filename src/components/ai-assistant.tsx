"use client";
import { FormEvent, useState } from "react";
import { ArrowUp, Bot, BrainCircuit, BookOpenCheck, Lightbulb, Plus, Sparkles, UserRound } from "lucide-react";
type ChatMessage = { role: "user" | "assistant"; content: string };
const suggestions = [
  { icon: BookOpenCheck, title: "Darsni tushuntiring", prompt: "Menga bugungi darsimni sodda qilib tushuntirib bering." },
  { icon: BrainCircuit, title: "Mavzuni takrorlaylik", prompt: "Men qaysi mavzularni takrorlashim kerakligini aniqlashga yordam bering." },
  { icon: Lightbulb, title: "O‘rganish rejasini tuzing", prompt: "Men uchun bir haftalik qisqa o‘quv rejasini tuzing." },
];
export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next); setDraft(""); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: clean, history: messages.slice(-10) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Javob olishda xatolik yuz berdi.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ulanishda xatolik yuz berdi. Qayta urinib ko‘ring.");
    } finally { setBusy(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void send(draft); }
  return (
    <main className="workspace-content assistant-content">
      <div className="assistant-heading"><div><div className="workspace-eyebrow"><i /> EDU MIND AI</div><h1>AI yordamchi</h1><p>Darslar, mavzular va o‘quv rejangiz bo‘yicha savol bering.</p></div><button className="assistant-new" type="button" onClick={() => { setMessages([]); setError(""); }}><Plus size={15} /> Yangi suhbat</button></div>
      <section className="assistant-window">
        <div className="assistant-chat-top"><span className="assistant-bot-icon"><Sparkles size={17} /></span><div><strong>EduMind yordamchisi</strong><small><i /> Onlayn · O‘zbek tilida</small></div><span className="assistant-context"><BrainCircuit size={14} /> O‘quv bo‘yicha yordam</span></div>
        <div className="assistant-scroll">
          {messages.length === 0 ? <div className="assistant-empty"><span className="assistant-welcome-icon"><Bot size={25} /></span><h2>Salom, qanday yordam beray?</h2><p>Qiyin mavzuni birga ko‘rib chiqamiz yoki siz uchun o‘rganish rejasini tuzamiz.</p><div className="assistant-suggestions">{suggestions.map(({ icon: Icon, title, prompt }) => <button type="button" key={title} onClick={() => void send(prompt)}><span><Icon size={17} /></span><strong>{title}</strong><small>{prompt}</small><span className="suggestion-arrow">↗</span></button>)}</div></div> : <div className="assistant-messages">{messages.map((message, index) => <article className={"assistant-message " + message.role} key={index}><span className="message-avatar">{message.role === "assistant" ? <Sparkles size={14} /> : <UserRound size={14} />}</span><div><small>{message.role === "assistant" ? "EDUMIND AI" : "SIZ"}</small><p>{message.content}</p></div></article>)}{busy && <article className="assistant-message assistant"><span className="message-avatar"><Sparkles size={14} /></span><div><small>EDUMIND AI</small><p className="typing-indicator"><i /><i /><i /></p></div></article>}</div>}
          {error && <div role="alert" className="assistant-error">{error}</div>}
        </div>
        <form className="assistant-composer" onSubmit={submit}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(draft); } }} placeholder="Savolingizni yozing..." maxLength={4000} rows={1} aria-label="AI yordamchiga xabar yozing" /><span className="composer-hint">Enter — yuborish · Shift + Enter — yangi qator</span><button type="submit" disabled={!draft.trim() || busy} aria-label="Xabarni yuborish"><ArrowUp size={17} /></button></form>
      </section>
      <p className="assistant-footnote"><Lightbulb size={14} /> AI javoblarini muhim qarorlar oldidan tekshirib oling.</p>
    </main>
  );
}
