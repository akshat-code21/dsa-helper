import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Chat from "./pages/Chat"
import axios from "axios"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/auth/sign-in")
  }

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
    {
      headers: Object.fromEntries(await headers()),
      withCredentials: true,
    }
  );
  const conversations = data.conversations;
  return <Chat conversations={conversations} />
}