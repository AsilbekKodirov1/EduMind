import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAssessment } from "@/lib/services/ai";
const schema = z.object({ lessonId: z.string(), count: z.number().int().min(1).max(20).default(5) });
export async function POST(request: Request) {
  const user = await getSession();
  if (!user || !(["TEACHER", "ADMIN"] as string[]).includes(user.role)) return NextResponse.json({ error: "Teacher access is required." }, { status: 403 });
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Choose a lesson and a valid question count." }, { status: 400 });
  const lesson = await prisma.lesson.findUnique({ where: { id: body.data.lessonId }, include: { topics: true } });
  if (!lesson) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  if (user.role === "TEACHER" && lesson.teacherId !== user.id) return NextResponse.json({ error: "You can only generate questions for your own lessons." }, { status: 403 });
  let topic = lesson.topics[0];
  if (!topic) topic = await prisma.topic.create({ data: { name: lesson.title, subjectId: lesson.subjectId, lessonId: lesson.id } });
  const questions = generateAssessment(lesson.content, topic.name, body.data.count);
  const assessment = await prisma.assessment.create({
    data: {
      lessonId: lesson.id,
      title: `${lesson.title} · AI draft`,
      questions: {
        create: questions.map((q, i) => ({
          order: i + 1,
          question: {
            create: {
              prompt: q.prompt, type: "MULTIPLE_CHOICE", options: q.options, answer: q.answer,
              explanation: q.explanation, difficulty: "MEDIUM", approved: false, topicId: topic.id
            }
          }
        }))
      }
    }
  });
  return NextResponse.json({ id: assessment.id, title: assessment.title, questions: questions.map((q, i) => ({ order: i + 1, prompt: q.prompt, options: q.options, approved: false })) }, { status: 201 });
}
