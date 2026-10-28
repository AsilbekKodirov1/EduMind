import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BarChart3, BookOpenCheck, BrainCircuit,
  Check, ClipboardList, GraduationCap, Layers3, Lightbulb, Sparkles,
  Target, UsersRound,
} from "lucide-react";

const features = [
  { icon: BookOpenCheck, title: "Darslar", text: "Dars materiallari va o‘quv maqsadlari bir joyda, tushunarli tartibda." },
  { icon: ClipboardList, title: "Bilimni tekshirish", text: "Darsga mos savollar bilan mavzu qay darajada o‘zlashtirilganini biling." },
  { icon: BarChart3, title: "Aniq tahlil", text: "Natijalarni sinf, fan va mavzu kesimida ko‘rib boring." },
  { icon: BrainCircuit, title: "AI yordamchi", text: "Darsni tahlil qiling, savollar tayyorlang va keyingi qadamni rejalang." },
  { icon: Target, title: "Shaxsiy tavsiyalar", text: "Har bir o‘quvchiga aynan takrorlash kerak bo‘lgan mavzularni ko‘rsating." },
  { icon: UsersRound, title: "Sinf bilan ishlash", text: "O‘quvchilar rivojini kuzating va yordam kerak bo‘lgan joyni tez toping." },
];

export default function Home() {
  return (
    <main className="landing">
      <nav className="top-nav container">
        <Link className="brand" href="/"><span className="brand-icon"><Sparkles size={18} /></span>EduMind</Link>
        <div className="nav-links"><a href="#imkoniyatlar">Imkoniyatlar</a><a href="#qanday-ishlaydi">Qanday ishlaydi</a><a href="#kimlar-uchun">Kimlar uchun</a></div>
        <div className="nav-actions"><Link href="/login" className="sign-in">Kirish</Link><Link href="/login" className="button button-dark">Boshlash <ArrowRight size={15} /></Link></div>
      </nav>

      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> TA’LIM UCHUN YANGI YONDASHUV</div>
          <h1>Har bir darsni o‘lchanadigan <em>natijaga</em> aylantiramiz.</h1>
          <p>EduMind o‘qituvchiga sinfdagi bilimni ko‘rishga, o‘quvchiga esa aynan nimani o‘rganish kerakligini bilishga yordam beradi.</p>
          <div className="hero-actions"><Link href="/login" className="button button-dark">Platformani ko‘rish <ArrowRight size={16} /></Link><a href="#qanday-ishlaydi" className="button button-quiet"><span className="play-mark">▶</span> Qanday ishlaydi</a></div>
          <div className="hero-proof"><div className="proof-icons"><span><Check size={13} /></span><span><Check size={13} /></span><span><Check size={13} /></span></div><span>O‘qituvchi va o‘quvchi uchun yagona platforma</span></div>
        </div>
        <div className="hero-visual" aria-label="EduMind o‘quv tahlili namunasi">
          <div className="hero-dashboard-card">
            <div className="mock-top"><span><i /> EduMind</span><span className="mock-tag">O‘quvchi paneli</span><span className="mock-avatar">A</span></div>
            <div className="mock-welcome"><div><small>BUGUNGI NATIJANGIZ</small><strong>Yaxshi ketyapti, Azizbek!</strong></div><span className="mock-date">28-sentabr</span></div>
            <div className="mock-metrics"><div><small>O‘zlashtirish</small><strong>78%</strong><i><b style={{ width: "78%" }} /></i></div><div><small>O‘rganilgan mavzu</small><strong>12 ta</strong><span className="mock-green">↑ 3 ta yangi</span></div></div>
            <div className="mock-chart"><div className="mock-chart-head"><span>O‘sish dinamikasi</span><span>So‘nggi 7 kun⌄</span></div><div className="mock-bars">{[38, 56, 45, 68, 59, 82, 72, 100].map((n, i) => <i key={i} style={{ height: `${n}%` }} />)}</div><div className="mock-days"><span>Du</span><span>Se</span><span>Ch</span><span>Pa</span><span>Ju</span><span>Sh</span><span>Ya</span></div></div>
            <div className="mock-recommend"><span><Lightbulb size={16} /></span><div><small>KEYINGI QADAM</small><strong>Nyuton qonunlarini takrorlang</strong></div><ArrowUpRight size={16} /></div>
          </div>
          <div className="hero-float hero-float-top"><span className="float-icon"><BrainCircuit size={16} /></span><span><small>AI TAVSIYASI</small><strong>Shaxsiy o‘quv rejasi</strong></span><span className="float-check">✓</span></div>
          <div className="hero-float hero-float-bottom"><span className="float-icon blue"><BarChart3 size={16} /></span><span><small>SINF NATIJASI</small><strong>O‘sish davom etmoqda</strong></span><span className="float-trend">↗ 12%</span></div>
        </div>
        <div className="hero-bottomline"><span>BILIMNI KO‘RINARLI QILAMIZ</span><span>EDUMIND · TA’LIM UCHUN</span></div>
      </section>

      <section className="trust-strip"><div className="container trust-inner"><span className="muted">BARCHA ISHTIROKCHILAR UCHUN</span><span><GraduationCap size={18} /> O‘quvchilar</span><span><UsersRound size={17} /> O‘qituvchilar</span><span><BarChart3 size={17} /> Maktab rahbariyati</span><span><Layers3 size={17} /> Barcha fanlar</span></div></section>

      <section id="qanday-ishlaydi" className="section container"><div className="section-heading"><div><div className="eyebrow">SODDA O‘QUV JARAYONI</div><h2>Darsdan aniq <em>natijagacha.</em></h2></div><p>O‘rgating, tushunilganini aniqlang va keyingi qadamni belgilang.</p></div><div className="steps-grid"><article className="step-card"><div className="step-top"><span>01 / DARS</span><BookOpenCheck size={19} /></div><div className="step-icon"><BookOpenCheck size={20} /></div><h3>Darsni joylang</h3><p>Material, fan va o‘quv maqsadini bitta sahifada jamlang.</p></article><article className="step-card"><div className="step-top"><span>02 / TAHLIL</span><BrainCircuit size={19} /></div><div className="step-icon"><BrainCircuit size={20} /></div><h3>Tushunilganini biling</h3><p>O‘quvchi javoblari orqali kuchli va takrorlash kerak bo‘lgan mavzularni ko‘ring.</p></article><article className="step-card"><div className="step-top"><span>03 / RIVOJ</span><Target size={19} /></div><div className="step-icon"><Target size={20} /></div><h3>Keyingi qadamni tanlang</h3><p>Shaxsiy tavsiyalar bilan o‘rganishni davom ettiring.</p></article></div></section>

      <section className="feature-band" id="imkoniyatlar"><div className="container feature-inner"><div className="feature-copy"><div className="eyebrow light-eyebrow">EDUMIND IMKONIYATLARI</div><h2>O‘qitishni ham,<br /><em>o‘rganishni ham</em><br />osonlashtiramiz.</h2><p>Kerakli vositalar bir joyda. Ma’lumotlar ortiqcha murakkabliksiz, tushunarli ko‘rinishda.</p><ul><li><Check size={15} /> O‘zbek tilidagi sodda interfeys</li><li><Check size={15} /> O‘qituvchi va o‘quvchi uchun alohida panel</li><li><Check size={15} /> Darsga mos AI tahlil va tavsiyalar</li></ul><Link href="/login" className="button button-light">EduMind’ga kirish <ArrowRight size={16} /></Link></div><div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-tile" key={title}><span><Icon size={18} /></span><h3>{title}</h3><p>{text}</p><ArrowUpRight size={15} className="feature-arrow" /></article>)}</div></div></section>

      <section className="section role-section" id="kimlar-uchun"><div className="container role-inner"><div className="role-copy"><div className="eyebrow">HAR BIR ROL UCHUN</div><h2>Har kim o‘ziga kerakli narsani <em>ko‘radi.</em></h2><p>Rollar uchun moslangan bo‘limlar kundalik vazifalarni topishni osonlashtiradi.</p></div><div className="role-cards"><article><span className="role-icon"><GraduationCap size={20} /></span><small>O‘QUVCHI</small><h3>O‘z rivojlanishingizni kuzating</h3><p>Darslar, bilim xaritasi, tayyorgarlik rejasi va AI yordamchini toping.</p></article><article><span className="role-icon"><UsersRound size={20} /></span><small>O‘QITUVCHI</small><h3>Sinfingizdagi holatni biling</h3><p>Darslarni boshqaring, sinf natijalarini tahlil qiling va yordam kerak joyni aniqlang.</p></article></div></div></section>

      <section className="cycle-section"><div className="container cycle-inner"><div><div className="eyebrow light-eyebrow">EDUMIND O‘QUV SIKLI</div><h2>O‘rgatamiz.<br /><em>Tushunamiz.</em></h2></div><div className="cycle-flow"><div className="cycle-step"><span>01</span><BookOpenCheck size={19} /><strong>Dars</strong></div><div className="cycle-arrow">→</div><div className="cycle-step"><span>02</span><ClipboardList size={19} /><strong>Bilim</strong></div><div className="cycle-arrow">→</div><div className="cycle-step"><span>03</span><BarChart3 size={19} /><strong>Tahlil</strong></div><div className="cycle-arrow">→</div><div className="cycle-step"><span>04</span><Target size={19} /><strong>Rivoj</strong></div></div></div></section>

      <section className="final-cta container"><div><div className="eyebrow">BIRINCHI DARSINGIZDAN BOSHLANG</div><h2>O‘rganish natijasi<br /><em>ko‘rinib tursin.</em></h2></div><div><p>EduMind bilan darsdan keyingi natijani ham birga kuzating.</p><Link href="/login" className="button button-dark">Platformaga kirish <ArrowRight size={16} /></Link></div></section>
      <footer className="footer"><div className="container footer-inner"><Link className="brand" href="/"><span className="brand-icon"><Sparkles size={17} /></span>EduMind</Link><span>Ta’lim natijasi ko‘rinib tursin.</span><span>© 2026 EduMind</span></div></footer>
    </main>
  );
}
