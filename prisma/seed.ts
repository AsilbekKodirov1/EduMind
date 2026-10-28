import { PrismaClient, Role, QuestionType, Difficulty } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
 const school = await prisma.school.upsert({where:{id:"demo-school"},update:{name:"EduMind Demo School"},create:{id:"demo-school",name:"EduMind Demo School"}});
 const accounts = [
  {name:"EduMind Admin",email:"admin@edumind.uz",password:"Admin123!",role:Role.ADMIN},
  {name:"Maya Karimova",email:"teacher@edumind.uz",password:"Teacher123!",role:Role.TEACHER},
  {name:"Aziz Rahimov",email:"student@edumind.uz",password:"Student123!",role:Role.STUDENT}
 ];
 const users = new Map<string,string>();
 for(const a of accounts){const u=await prisma.user.upsert({where:{email:a.email},update:{name:a.name,role:a.role,passwordHash:await hash(a.password,12)},create:{name:a.name,email:a.email,role:a.role,passwordHash:await hash(a.password,12),schoolId:school.id}});users.set(a.email,u.id);}
 const teacher=users.get("teacher@edumind.uz")!;const student=users.get("student@edumind.uz")!;
 const tp=await prisma.teacherProfile.upsert({where:{userId:teacher},update:{},create:{userId:teacher}});
 const studentProfile=await prisma.studentProfile.upsert({where:{userId:student},update:{},create:{userId:student,grade:8}});
 const classData=[] as {id:string;name:string;grade:number}[];
 for(const [id,name,grade] of [["class-8a","Grade 8 · A",8],["class-8b","Grade 8 · B",8],["class-9a","Grade 9 · A",9]] as const){const c=await prisma.class.upsert({where:{id},update:{name,grade,teacherId:tp.id},create:{id,name,grade,schoolId:school.id,teacherId:tp.id}});classData.push(c);}
 await prisma.enrollment.upsert({where:{studentId_classId:{studentId:studentProfile.id,classId:"class-8a"}},update:{},create:{studentId:studentProfile.id,classId:"class-8a"}});
 for(const name of ["Integrated Humanities","Natural Systems","World Languages","Creative Computing"]){await prisma.subject.upsert({where:{schoolId_name:{schoolId:school.id,name}},update:{},create:{name,schoolId:school.id}})}
 const subject=await prisma.subject.findUniqueOrThrow({where:{schoolId_name:{schoolId:school.id,name:"Integrated Humanities"}}});
 const lessons=[
 {id:"lesson-cause",title:"Seeing Cause and Effect",description:"Trace how connected events shape the world around us.",content:"Causes are the actions or conditions that lead to an outcome. Effects are the results that follow. A single effect can have multiple causes, and one cause can produce several effects. Evidence helps us distinguish a direct cause from a coincidence. Use sequence, context, and comparison to build a supported explanation.",objectives:["Identify causes and effects in a source","Use evidence to support a causal explanation","Distinguish correlation from causation"]},
 {id:"lesson-systems",title:"How Systems Stay in Balance",description:"Explore the relationships that help complex systems adapt.",content:"A system is a set of connected parts that interact. Feedback occurs when a change in one part influences the rest of the system. Positive feedback amplifies change while negative feedback tends to stabilize it. Boundaries define what belongs to the system, and a model helps us test how changes may affect its behavior.",objectives:["Describe relationships within a system","Compare stabilizing and amplifying feedback","Use a model to predict system behavior"]},
 {id:"lesson-patterns",title:"Patterns, Rules, and Predictions",description:"Find a rule in repeated observations and use it carefully.",content:"Patterns help us summarize repeated observations. A rule describes a relationship that may explain a pattern. Predictions apply a rule to a new situation, while testing checks how well the prediction fits. Patterns are useful evidence, but exceptions and limited samples can affect confidence.",objectives:["Recognize a pattern across examples","Express a rule in clear language","Evaluate a prediction with new evidence"]}
 ];
 const seededLessons=[];
 for(const l of lessons){const row=await prisma.lesson.upsert({where:{id:l.id},update:{...l,teacherId:teacher,classId:"class-8a",subjectId:subject.id,published:true},create:{...l,teacherId:teacher,classId:"class-8a",subjectId:subject.id,published:true}});seededLessons.push(row)}
 const concepts=["Cause and effect","System feedback","Pattern recognition"];
 for(let i=0;i<seededLessons.length;i++){
   const lesson=seededLessons[i];const topic=await prisma.topic.upsert({where:{id:`topic-${i+1}`},update:{name:concepts[i],subjectId:subject.id,lessonId:lesson.id},create:{id:`topic-${i+1}`,name:concepts[i],subjectId:subject.id,lessonId:lesson.id}});
   const sub=await prisma.subtopic.upsert({where:{id:`subtopic-${i+1}`},update:{name:"Core ideas",topicId:topic.id},create:{id:`subtopic-${i+1}`,name:"Core ideas",topicId:topic.id}});
   const qs=[
    {prompt:`Which statement best describes ${concepts[i].toLowerCase()}?`,options:["A supported relationship between ideas","A list with no connection","A personal preference","A repeated word"],answer:"A supported relationship between ideas",explanation:"A useful explanation connects ideas and is supported by evidence."},
    {prompt:"Why is evidence useful when explaining a pattern or relationship?",options:["It supports or challenges an explanation","It guarantees every prediction","It removes the need to compare","It makes every cause direct"],answer:"It supports or challenges an explanation",explanation:"Evidence allows us to check whether an explanation fits the observations."},
    {prompt:"A new observation does not fit a proposed rule. What is a useful next step?",options:["Review the rule against the evidence","Ignore the new observation","Assume the rule cannot change","Replace evidence with a guess"],answer:"Review the rule against the evidence",explanation:"New evidence is a reason to test and refine an explanation."}
   ];
   for(let q=0;q<qs.length;q++){await prisma.question.upsert({where:{id:`q-${i+1}-${q+1}`},update:{...qs[q],topicId:topic.id,subtopicId:sub.id,approved:true},create:{id:`q-${i+1}-${q+1}`,...qs[q],type:QuestionType.MULTIPLE_CHOICE,difficulty:q===2?Difficulty.HARD:Difficulty.MEDIUM,topicId:topic.id,subtopicId:sub.id,approved:true}})}
   await prisma.revisionMaterial.upsert({where:{id:`revision-${i+1}`},update:{title:`Review: ${concepts[i]}`,kind:"NOTE",url:`/dashboard#lesson-${lesson.id}`,topicId:topic.id,lessonId:lesson.id},create:{id:`revision-${i+1}`,title:`Review: ${concepts[i]}`,kind:"NOTE",url:`/dashboard#lesson-${lesson.id}`,topicId:topic.id,lessonId:lesson.id}});
   await prisma.lessonAnalysis.upsert({where:{lessonId:lesson.id},update:{concepts:[concepts[i]],objectives:lesson.objectives,terms:concepts[i].split(" "),subtopics:["Core ideas"],difficulty:"MEDIUM",confusions:["Confusing a pattern with proof"],assessmentAreas:["Evidence use","Concept explanation"]},create:{lessonId:lesson.id,concepts:[concepts[i]],objectives:lesson.objectives,terms:concepts[i].split(" "),subtopics:["Core ideas"],difficulty:"MEDIUM",confusions:["Confusing a pattern with proof"],assessmentAreas:["Evidence use","Concept explanation"]}});
   if(i===0){
    const assessment=await prisma.assessment.upsert({where:{id:"assessment-cause"},update:{title:"Cause and Effect · Check-in",status:"PUBLISHED",lessonId:lesson.id},create:{id:"assessment-cause",title:"Cause and Effect · Check-in",status:"PUBLISHED",lessonId:lesson.id}});
    for(let q=1;q<=3;q++)await prisma.assessmentQuestion.upsert({where:{assessmentId_questionId:{assessmentId:assessment.id,questionId:`q-1-${q}`}},update:{order:q},create:{assessmentId:assessment.id,questionId:`q-1-${q}`,order:q}});
    await prisma.studentTopicMastery.createMany({data:[{studentId:studentProfile.id,topicId:topic.id,mastery:62,status:"DEVELOPING"}],skipDuplicates:true});
    const existing=await prisma.assessmentAttempt.findFirst({where:{id:"attempt-demo"}});
    if(!existing){const attempt=await prisma.assessmentAttempt.create({data:{id:"attempt-demo",userId:student,assessmentId:assessment.id,status:"SUBMITTED",score:67,mastery:67,submittedAt:new Date(Date.now()-86400000)}});await prisma.studentAnswer.createMany({data:[{attemptId:attempt.id,questionId:"q-1-1",answer:"A supported relationship between ideas",correct:true},{attemptId:attempt.id,questionId:"q-1-2",answer:"It guarantees every prediction",correct:false},{attemptId:attempt.id,questionId:"q-1-3",answer:"Review the rule against the evidence",correct:true}]})}
   }
 }
 for(const [id,title,days] of [["exam-oct","Term learning review",10],["exam-nov","Topic connections mock exam",37]] as const)await prisma.exam.upsert({where:{id},update:{},create:{id,title,schoolId:school.id,scheduledAt:new Date(Date.now()+days*86400000)}});
 for(const email of ["student@edumind.uz"]) await prisma.notification.createMany({data:[{userId:users.get(email)!,title:"A new lesson is ready",body:"Seeing Cause and Effect is ready to explore."},{userId:users.get(email)!,title:"A topic to revisit",body:"Review the ideas behind cause and effect."}],skipDuplicates:true});
 console.log("EduMind demo school and accounts seeded.");
}
main().finally(()=>prisma.$disconnect());
