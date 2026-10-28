import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson } from "@/lib/access";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Student access is required." }, { status: 403 });
  const { id } = await params;
  const assessment = await prisma.assessment.findFirst({ where: { id, status: "PUBLISHED" }, include: { questions: { include: { question: true } } } });
  if (!assessment) return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  if(!(await canAccessLesson(user,assessment.lessonId)))return NextResponse.json({error:"This assessment is not assigned to your class."},{status:403});
  const body = await request.json().catch(() => null) as { answers?: Record<string, string> } | null;
  if (!body?.answers || typeof body.answers !== "object") return NextResponse.json({ error: "Submit your answers to continue." }, { status: 400 });
  const attempt = await prisma.assessmentAttempt.create({ data: { userId: user.id, assessmentId: id, status: "SUBMITTED", submittedAt: new Date() } });
  let correct = 0;
  for (const item of assessment.questions) {
    const answer = body.answers[item.questionId] ?? "";
    const isCorrect = answer.trim().toLocaleLowerCase() === item.question.answer.trim().toLocaleLowerCase();
    if (isCorrect) correct++;
    await prisma.studentAnswer.create({ data: { attemptId: attempt.id, questionId: item.questionId, answer, correct: isCorrect } });
  }
  const score = assessment.questions.length ? Math.round(correct / assessment.questions.length * 100) : 0;
  const mastery = score;
  await prisma.assessmentAttempt.update({ where: { id: attempt.id }, data: { score, mastery } });
  const student = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
  if (student) {
    const topicIds = [...new Set(assessment.questions.map((q) => q.question.topicId))];
    for (const topicId of topicIds) await prisma.studentTopicMastery.create({ data: { studentId: student.id, topicId, mastery, status: mastery >= 80 ? "MASTERED" : mastery >= 55 ? "DEVELOPING" : "NEEDS_REVISION" } });
  }
  return NextResponse.json({ attemptId: attempt.id, score, mastery, correct, total: assessment.questions.length });
}


