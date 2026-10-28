import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeLesson } from "@/lib/services/ai";
const schema=z.object({lessonId:z.string()});
export async function POST(request:Request){const user=await getSession();if(!user||!(["TEACHER","ADMIN"] as string[]).includes(user.role))return NextResponse.json({error:"Teacher access is required."},{status:403});const body=schema.safeParse(await request.json().catch(()=>null));if(!body.success)return NextResponse.json({error:"Choose a lesson to analyze."},{status:400});const lesson=await prisma.lesson.findUnique({where:{id:body.data.lessonId}});if(!lesson)return NextResponse.json({error:"Lesson not found."},{status:404});if(user.role==="TEACHER"&&lesson.teacherId!==user.id)return NextResponse.json({error:"You can only analyze your own lessons."},{status:403});const analysis=analyzeLesson(lesson.content,lesson.objectives);const result=await prisma.lessonAnalysis.upsert({where:{lessonId:lesson.id},update:analysis,create:{lessonId:lesson.id,...analysis}});return NextResponse.json(result)}

