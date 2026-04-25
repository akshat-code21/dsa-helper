import { auth, prisma } from "@/lib/auth";
import { dbMessageToUIMessage } from "@/lib/chat-ui-messages";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new NextResponse(null, { status: 403 });
  }

  const conversationIdParam = new URL(req.url).searchParams.get("id");

  const conv = conversationIdParam
    ? await prisma.conversation.findFirst({
        where: { id: conversationIdParam, userId: session.user.id },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
      })
    : await prisma.conversation.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
      });

  if (!conv) {
    return NextResponse.json({
      conversationId: null,
      messages: [],
    });
  }

  return NextResponse.json({
    conversationId: conv.id,
    messages: conv.messages.map(dbMessageToUIMessage),
  });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new NextResponse(null, { status: 403 });
  }

  await prisma.conversation.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
