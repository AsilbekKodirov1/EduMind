import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, CheckCircle2, GraduationCap, Lightbulb, Plus, Sparkles, Target, UsersRound, ClipboardList } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LessonManager from "@/components/lesson-manager";
import WorkspaceShell from "@/components/workspace-shell";

export default async function Dashboard() {
  const user = await getSession();
  if (!user) redirect("/login");
  const isStudent = user.role === "STUDENT";
  const isTeacher = user.role === "TEACHER";
  const [lessons, attempts, students, classes, subjects, weakTopics, exams, classList, subjectList] = await Promise.all([
    prisma.lesson.findMany({ where: isStudent ? { published: true } : {}, include: { subject: true, class: true, teacher: true }, orderBy: { scheduledAt: "desc" }, take: 5 }),
    prisma.assessmentAttempt.findMany({ where: isStudent ? { userId: user.id, status: "SUBMITTED" } : { status: "SUBMITTED" }, include: { user: true, assessment: true }, orderBy: { submittedAt: "desc" }, take: 6 }),
    prisma.studentProfile.count(), prisma.class.count(), prisma.subject.count(),
    prisma.studentTopicMastery.findMany({ where: isStudent ? { student: { userId: user.id }, status: "NEEDS_REVISION" } : { status: "NEEDS_REVISION" }, include: { topic: true, student: { include: { user: true } } }, orderBy: { recordedAt: "desc" }, take: 5 }),
    prisma.exam.findMany({ orderBy: { scheduledAt: "asc" }, take: 3 }),
    prisma.class.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.subject.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  const average = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.mastery ?? 0), 0) / attempts.length) : 0;
  const metrics = isStudent
    ? [
        { label: "O‘ZLASHTIRISH", value: average + "%", detail: "So‘nggi topshiriqlar bo‘yicha", icon: BrainCircuit, tone: "violet" },
        { label: "OCHIQ DARSLAR", value: String(lessons.length), detail: "O‘rganishni davom ettiring", icon: BookOpenCheck, tone: "blue" },
        { label: "TAKRORLASH KERAK", value: String(weakTopics.length), detail: "Sizga mos mavzular", icon: Target, tone: "amber" },
        { label: "TUGATILGAN ISHLAR", value: String(attempts.length), detail: "Yaxshi davom etyapsiz", icon: CheckCircle2, tone: "green" },
      ]
    : isTeacher
      ? [
          { label: "SINFLARIM", value: String(classes), detail: "Faol o‘quv guruhlari", icon: UsersRound, tone: "violet" },
          { label: "O‘QUVCHILAR", value: String(students), detail: "Maktab bo‘yicha", icon: GraduationCap, tone: "blue" },
          { label: "O‘RTACHA NATIJA", value: average + "%", detail: "Topshirilgan ishlardan", icon: BrainCircuit, tone: "green" },
          { label: "OCHIQ DARSLAR", value: String(lessons.length), detail: "Yaqinda yaratilgan", icon: BookOpenCheck, tone: "amber" },
        ]
      : [
          { label: "O‘QUVCHILAR", value: String(students), detail: "Barcha sinflarda", icon: GraduationCap, tone: "violet" },
          { label: "SINFLAR", value: String(classes), detail: "Faol o‘quv guruhlari", icon: UsersRound, tone: "blue" },
          { label: "FANLAR", value: String(subjects), detail: "Platformada mavjud", icon: BookOpenCheck, tone: "green" },
          { label: "O‘RTACHA NATIJA", value: average + "%", detail: "So‘nggi topshiriqlardan", icon: BrainCircuit, tone: "amber" },
        ];
  return (
    <WorkspaceShell user={user} active="overview">
      <main className="workspace-content">
        <div className="workspace-welcome"><div><div className="workspace-eyebrow"><i /> SHAXSIY O‘QUV MAYDONI</div><h1>Xush kelibsiz, {user.name.split(" ")[0]} <span>✦</span></h1><p>{isStudent ? "Bugungi o‘qishingiz va keyingi qadamingiz shu yerda." : isTeacher ? "Sinfingizdagi o‘quv jarayonini bir joydan boshqaring." : "Maktabdagi o‘quv jarayoni bo‘yicha umumiy ko‘rinish."}</p></div>{!isStudent && <Link className="workspace-primary" href="#create-lesson"><Plus size={16} /> Dars yaratish</Link>}</div>
        <section className="workspace-metrics">{metrics.map(({ label, value, detail, icon: Icon, tone }) => <article className="workspace-metric" key={label}><div className="metric-label">{label}<span className={"metric-glyph " + tone}><Icon size={16} /></span></div><strong>{value}</strong><small>{detail}</small><div className="metric-meter"><i style={{ width: Math.max(8, Math.min(100, Number.parseInt(value, 10) || 12)) + "%" }} /></div></article>)}</section>
        {!isStudent && <div id="create-lesson"><LessonManager classes={classList} subjects={subjectList} lessons={lessons.map((lesson) => ({ id: lesson.id, title: lesson.title }))} /></div>}
        <div className="workspace-grid">
          <section className="workspace-card workspace-lessons" id="lessons"><div className="workspace-card-head"><div><span className="workspace-eyebrow">DAVOM ETING</span><h2>{isStudent ? "Mening darslarim" : "So‘nggi darslar"}</h2></div><Link href="#lessons">Barchasi <ArrowRight size={14} /></Link></div>
            <div className="workspace-lesson-list">{lessons.map((lesson, index) => <article className="workspace-lesson" key={lesson.id}><span className={"lesson-glyph glyph-" + (index % 4)}><BookOpenCheck size={17} /></span><div><small>{lesson.subject.name} <i>·</i> {lesson.class.name}</small><strong>{lesson.title}</strong><p>{lesson.description}</p></div><Link href={"/lessons/" + lesson.id} aria-label={lesson.title + " darsini ochish"}><ArrowRight size={16} /></Link></article>)}{lessons.length === 0 && <div className="workspace-empty"><BookOpenCheck size={24} /><strong>Hozircha dars yo‘q</strong><span>{isStudent ? "O‘qituvchi dars joylaganda shu yerda ko‘rinadi." : "Yangi dars yaratib, sinfingizga ulashing."}</span></div>}</div>
            <div className="workspace-note"><Sparkles size={14} /> Har bir dars — yangi imkoniyat.</div>
          </section>
          <section className="workspace-card" id={isTeacher ? "students" : "map"}><div className="workspace-card-head"><div><span className="workspace-eyebrow">{isTeacher ? "E’TIBOR KERAK" : "KEYINGI QADAM"}</span><h2>{isTeacher ? "Takrorlash kerak bo‘lgan mavzular" : "Bilim xaritam"}</h2></div><BrainCircuit size={18} className="workspace-heading-icon" /></div>
            <div className="workspace-topic-list">{weakTopics.map((item) => <article className="workspace-topic" key={item.id}><span className="topic-marker" /><div><strong>{item.topic.name}</strong><small>{isStudent ? "Yana bir bor ko‘rib chiqing" : item.student.user.name + " uchun takrorlash tavsiyasi"}</small></div><b>{Math.round(item.mastery)}%</b></article>)}{weakTopics.length === 0 && <div className="workspace-empty compact"><Target size={23} /><strong>Hozircha tavsiya yo‘q</strong><span>Yangi natijalar paydo bo‘lganda mavzular shu yerda chiqadi.</span></div>}</div>
            <Link className="workspace-recommend" href="/dashboard/assistant"><span><Lightbulb size={17} /></span><div><strong>AI yordamchidan maslahat oling</strong><small>Keyingi foydali qadamni birga toping.</small></div><ArrowRight size={15} /></Link>
          </section>
        </div>
        <div className="workspace-grid workspace-grid-bottom">
          <section className="workspace-card" id={isTeacher ? "classes" : "progress"}><div className="workspace-card-head"><div><span className="workspace-eyebrow">{isTeacher ? "SINFLAR" : "SO‘NGGI FAOLLIK"}</span><h2>{isTeacher ? "Sinf ko‘rsatkichlari" : "Oxirgi natijalarim"}</h2></div><BarChart3 size={18} className="workspace-heading-icon" /></div>
            {isTeacher ? <div className="class-summary"><div><strong>{classes}</strong><span>faol sinf</span></div><div><strong>{students}</strong><span>o‘quvchi</span></div><div><strong>{subjects}</strong><span>fan</span></div><Link href="#analysis">Tahlilni ochish <ArrowRight size={13} /></Link></div> : <div className="workspace-results">{attempts.map((attempt) => <article key={attempt.id}><span><ClipboardList size={15} /></span><div><strong>{attempt.assessment.title}</strong><small>{attempt.submittedAt?.toLocaleDateString("uz-UZ") ?? "Yaqinda"} · {Math.round(attempt.mastery ?? 0)}% natija</small></div><b>{Math.round(attempt.mastery ?? 0)}%</b></article>)}{attempts.length === 0 && <div className="workspace-empty compact"><ClipboardList size={23} /><strong>Natijalar hali yo‘q</strong><span>Birinchi topshiriqni bajarganingizdan keyin natijalar shu yerda ko‘rinadi.</span></div>}</div>}
          </section>
          <section className="workspace-card" id="analysis"><div className="workspace-card-head"><div><span className="workspace-eyebrow">{isTeacher ? "SINF TAHLILI" : "TAYYORGARLIK"}</span><h2>{isTeacher ? "O‘quvchilarga yordam" : "Yaqinlashayotgan imtihonlar"}</h2></div><Target size={18} className="workspace-heading-icon" /></div>
            {exams.length ? exams.map((exam) => <article className="workspace-exam" key={exam.id}><span><small>{exam.scheduledAt.toLocaleDateString("uz-UZ", { month: "short" })}</small><strong>{exam.scheduledAt.getDate()}</strong></span><div><strong>{exam.title}</strong><small>Tayyorgarlikni mavzular bo‘yicha davom ettiring</small></div><ArrowRight size={15} /></article>) : <div className="workspace-empty compact"><Target size={23} /><strong>{isTeacher ? "Tahlil uchun ko‘proq natija kerak" : "Rejada imtihon yo‘q"}</strong><span>{isTeacher ? "O‘quvchilar ishlari topshirilgach, sinf bo‘yicha ko‘rsatkichlar shu yerda chiqadi." : "Imtihon sanalari belgilanganda bu yerda ko‘rasiz."}</span></div>}
            <Link href="/dashboard/assistant" className="workspace-chat-link"><Sparkles size={15} /> AI yordamchiga savol bering <ArrowRight size={14} /></Link>
          </section>
        </div>
        <footer className="workspace-footer"><span>EduMind · Ta’lim natijasi ko‘rinib tursin.</span><span>{isStudent ? "O‘qishdagi navbatdagi qadamingizni tanlang." : "Sinfingiz uchun foydali ma’lumotlar bir joyda."}</span></footer>
      </main>
    </WorkspaceShell>
  );
}
