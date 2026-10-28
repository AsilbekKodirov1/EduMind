import { notFound, redirect } from "next/navigation";
import AssessmentRunner from "@/components/assessment-runner";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson } from "@/lib/access";
export default async function AssessmentPage({params}:{params:Promise<{id:string}>}){const user=await getSession();if(!user)redirect("/login");if(user.role!=="STUDENT")redirect("/dashboard");const {id}=await params;const assessment=await prisma.assessment.findFirst({where:{id,status:"PUBLISHED"},include:{questions:{include:{question:true},orderBy:{order:"asc"}}}});if(!assessment)notFound();if(!(await canAccessLesson(user,assessment.lessonId)))redirect("/dashboard");return <AssessmentRunner assessmentId={assessment.id} title={assessment.title} timeLimit={assessment.timeLimit} questions={assessment.questions.map(({question})=>({id:question.id,prompt:question.prompt,options:question.options,type:question.type}))}/>}

