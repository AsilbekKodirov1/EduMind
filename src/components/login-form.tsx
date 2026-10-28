"use client";

import { useState } from "react";
import { ArrowRight, BookOpenCheck, BrainCircuit, Check, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";

const demos = [
  { label: "Administrator", email: "admin@edumind.uz", password: "Admin123!", icon: ShieldCheck },
  { label: "O‘qituvchi", email: "teacher@edumind.uz", password: "Teacher123!", icon: Users },
  { label: "O‘quvchi", email: "student@edumind.uz", password: "Student123!", icon: GraduationCap },
];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(userEmail: string, userPassword: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail.trim().toLowerCase(), password: userPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Kirish amalga oshmadi. Ma’lumotlarni tekshirib qayta urinib ko‘ring.");
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Serverga ulanib bo‘lmadi. Birozdan keyin qayta urinib ko‘ring.");
      setBusy(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void signIn(email, password);
  }

  return (
    <main className="login-layout">
      <section className="login-art">
        <a href="/" className="login-brand"><span><Sparkles size={18} /></span>EduMind</a>
        <div className="login-art-copy">
          <div className="login-eyebrow"><i /> TA’LIMNI AQILLIROQ QILAMIZ</div>
          <h1>Har bir dars.<br />Aniq natija.<br /><em>Yangi imkoniyat.</em></h1>
          <p>Darsda nimalar o‘zlashtirilganini biling. Keyingi o‘rganish qadamini birgalikda tanlang.</p>
          <div className="login-benefits">
            <div><span><Check size={13} /></span><strong>O‘qituvchi va o‘quvchi uchun alohida panel</strong></div>
            <div><span><Check size={13} /></span><strong>O‘zbek tilidagi sodda va tushunarli interfeys</strong></div>
            <div><span><Check size={13} /></span><strong>AI yordamida shaxsiy tavsiyalar</strong></div>
          </div>
        </div>
        <div className="login-art-bottom"><span><BookOpenCheck size={15} /> EduMind ta’lim platformasi</span><span>O‘RGANISH · TAHLIL · RIVOJ</span></div>
        <div className="login-art-orb login-art-orb-one" /><div className="login-art-orb login-art-orb-two" />
      </section>

      <section className="login-side">
        <div className="login-card">
          <a href="/" className="login-brand login-brand-mobile"><span><Sparkles size={17} /></span>EduMind</a>
          <div className="login-eyebrow login-eyebrow-light"><i /> SHAXSIY O‘QUV MAYDONI</div>
          <h2>Hisobingizga kiring</h2>
          <p className="login-lede">O‘qishni davom ettirish uchun ma’lumotlaringizni kiriting.</p>
          <form onSubmit={submit} className="login-form">
            <label htmlFor="login-email">Elektron pochta</label>
            <input id="login-email" type="email" placeholder="siz@maktab.uz" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            <div className="login-password-label"><label htmlFor="login-password">Parol</label><span>Kamida 8 ta belgi</span></div>
            <input id="login-password" type="password" placeholder="Parolingizni kiriting" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-submit" disabled={busy}>{busy ? "Tekshirilmoqda..." : "Kirish"}<ArrowRight size={16} /></button>
          </form>

          {process.env.NODE_ENV !== "production" && <div className="login-demo">
            <div className="login-demo-heading"><span>DEMO HISOBLAR</span><span>Bir bosishda kiring</span></div>
            <div className="login-demo-list">{demos.map(({ label, email: demoEmail, password: demoPassword, icon: Icon }) => <button key={label} type="button" disabled={busy} onClick={() => { setEmail(demoEmail); setPassword(demoPassword); void signIn(demoEmail, demoPassword); }}><span className="login-demo-icon"><Icon size={15} /></span><span><strong>{label}</strong><small>{demoEmail}</small></span><ArrowRight size={14} /></button>)}</div>
          </div>}
          <div className="login-note"><BrainCircuit size={15} /><span>Har bir foydalanuvchi o‘ziga kerakli bo‘limlarni ko‘radi.</span></div>
          <a className="login-back" href="/">← Bosh sahifaga qaytish</a>
        </div>
      </section>
    </main>
  );
}
