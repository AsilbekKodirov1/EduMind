import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const schema = z.object({ title: z.string().min(2), description: z.string().min(3), content: z.string().min(5), objectives: z.array(z.string()).default([]), subjectId: z.string(), classId: z.string() });
export async function POST(request: Request) {
  const user = await getSession();
  if (!user || !["ADMIN", "TEACHER"].includes(user.role)) return NextResponse.json({ error: "You do not have permission to create lessons." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the lesson fields and try again." }, { status: 400 });
  const [schoolUser, classroom, subject] = await Promise.all([prisma.user.findUnique({where:{id:user.id},select:{schoolId:true}}),prisma.class.findUnique({where:{id:parsed.data.classId},select:{schoolId:true,teacherId:true}}),prisma.subject.findUnique({where:{id:parsed.data.subjectId},select:{schoolId:true}})]);
  if(!schoolUser||!classroom||!subject||classroom.schoolId!==schoolUser.schoolId||subject.schoolId!==schoolUser.schoolId||(user.role==="TEACHER"&&classroom.teacherId!== (await prisma.teacherProfile.findUnique({where:{userId:user.id},select:{id:true}}))?.id))return NextResponse.json({error:"Choose a class and subject in your school that you are allowed to teach."},{status:403});
  const lesson = await prisma.lesson.create({ data: { ...parsed.data, teacherId: user.id, published: true } });
  return NextResponse.json(lesson, { status: 201 });
}

