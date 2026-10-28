import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, CalendarDays, GraduationCap, LayoutDashboard, LogOut, Sparkles, Target, UsersRound } from "lucide-react";
import type { SessionUser } from "@/lib/auth";

type Props = { user: SessionUser; active: string; children: ReactNode };

export default function WorkspaceShell({ user, active, children }: Props) {
  const isStudent = user.role === "STUDENT";
  const isTeacher = user.role === "TEACHER";
  const roleLabel = isStudent ? "O‘quvchi" : isTeacher ? "O‘qituvchi" : "Administrator";
  const links = isStudent
    ? [
        { key: "overview", label: "Bosh sahifa", href: "/dashboard", icon: LayoutDashboard },
        { key: "lessons", label: "Darslar", href: "/dashboard#lessons", icon: BookOpenCheck },
        { key: "map", label: "Bilim xaritasi", href: "/dashboard#map", icon: BrainCircuit },
        { key: "progress", label: "Natijalarim", href: "/dashboard#progress", icon: BarChart3 },
        { key: "prep", label: "Imtihonga tayyorgarlik", href: "/dashboard#analysis", icon: Target },
        { key: "assistant", label: "AI yordamchi", href: "/dashboard/assistant", icon: Sparkles },
      ]
    : isTeacher
      ? [
          { key: "overview", label: "Bosh sahifa", href: "/dashboard", icon: LayoutDashboard },
          { key: "classes", label: "Sinflar", href: "/dashboard#classes", icon: UsersRound },
          { key: "lessons", label: "Darslar", href: "/dashboard#lessons", icon: BookOpenCheck },
          { key: "students", label: "O‘quvchilar", href: "/dashboard#students", icon: GraduationCap },
          { key: "analytics", label: "Tahlillar", href: "/dashboard#analysis", icon: BarChart3 },
          { key: "assistant", label: "AI yordamchi", href: "/dashboard/assistant", icon: Sparkles },
        ]
      : [
          { key: "overview", label: "Bosh sahifa", href: "/dashboard", icon: LayoutDashboard },
          { key: "classes", label: "Sinflar", href: "/dashboard#classes", icon: UsersRound },
          { key: "students", label: "O‘quvchilar", href: "/dashboard#students", icon: GraduationCap },
          { key: "analytics", label: "Tahlillar", href: "/dashboard#analysis", icon: BarChart3 },
          { key: "assistant", label: "AI yordamchi", href: "/dashboard/assistant", icon: Sparkles },
        ];

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <Link className="workspace-brand" href="/"><span><Sparkles size={17} /></span>EduMind</Link>
        <div className="workspace-school"><div className="school-mark">E</div><span><strong>EduMind maktabi</strong><small>{roleLabel} paneli</small></span><span className="school-chevron">⌄</span></div>
        <div className="workspace-caption">ISH MAYDONI</div>
        <nav className="workspace-nav" aria-label="Asosiy menyu">
          {links.map(({ key, label, href, icon: Icon }) => <Link key={key} href={href} className={active === key ? "active" : ""}><Icon size={17} /><span>{label}</span>{key === "assistant" && <i className="nav-ai-dot" />}</Link>)}
        </nav>
        <div className="workspace-sidebar-bottom">
          <div className="sidebar-tip"><span><Sparkles size={15} /></span><strong>Yaxshi o‘rganish — to‘g‘ri qadamdan</strong><p>Keyingi tavsiyangizni EduMind’dan oling.</p><Link href={isStudent ? "/dashboard#map" : "/dashboard#analysis"}>Ko‘rib chiqish <ArrowRight size={12} /></Link></div>
          <form action="/api/auth/logout" method="post"><button className="workspace-user"><span className="workspace-avatar">{user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span className="workspace-user-copy"><strong>{user.name}</strong><small>{roleLabel}</small></span><LogOut size={15} /></button></form>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-header"><div className="workspace-crumb"><span>EduMind</span><i>/</i>{active === "assistant" ? "AI yordamchi" : "Bosh sahifa"}</div><div className="workspace-header-right"><span><CalendarDays size={15} />{new Date().toLocaleDateString("uz-UZ", { weekday: "long", month: "long", day: "numeric" })}</span><span className="workspace-header-avatar">{user.name[0]}</span></div></header>
        {children}
      </div>
    </div>
  );
}
