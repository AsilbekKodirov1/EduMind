import type { Metadata } from "next";
import "./globals.css";
import "./workspace.css";
export const metadata: Metadata = { title: "EduMind — Ta'lim natijasi ko'rinib tursin", description: "O'qituvchi va o'quvchi uchun AI asosidagi ta'lim platformasi." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="uz"><body>{children}</body></html>; }


