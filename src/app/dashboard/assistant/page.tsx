import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import WorkspaceShell from "@/components/workspace-shell";
import AiAssistant from "@/components/ai-assistant";
export default async function AssistantPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return <WorkspaceShell user={user} active="assistant"><AiAssistant /></WorkspaceShell>;
}
