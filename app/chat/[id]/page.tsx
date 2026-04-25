import Chat from "@/app/pages/Chat";
import { auth, prisma } from "@/lib/auth";
import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/sign-in");
  }

  const { id } = await params;
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
    {
      headers: Object.fromEntries(await headers()),
      withCredentials: true,
    }
  );
  const conversations = data.conversations;
  return <Chat initialConversationId={id} conversations={conversations} />;
}
