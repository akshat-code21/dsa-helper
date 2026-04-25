import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, UIMessage, tool } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT_V1 } from "@/prompts";
import { auth, prisma } from "@/lib/auth";
import { getLastUserMessage, getTextFromUIMessage } from "@/lib/ui-message-content";
import { Role } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

const openRouter = createOpenRouter();

type ChatRequestBody = {
  messages?: UIMessage[];
  conversationId?: string | null;
  trigger?: "submit-message" | "regenerate-message";
};

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages, conversationId: clientConversationId, trigger = "submit-message" } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Request body must include a non-empty messages array." },
      { status: 400 }
    );
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return new NextResponse(null, { status: 403 });
  }

  const userId = session.user.id;

  let activeConversationId: string;

  if (clientConversationId) {
    const existing = await prisma.conversation.findFirst({
      where: { id: clientConversationId, userId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Conversation not found or access denied." },
        { status: 404 }
      );
    }
    activeConversationId = existing.id;
  } else {
    const latest = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    if (latest) {
      activeConversationId = latest.id;
    } else {
      const created = await prisma.conversation.create({
        data: { userId },
      });
      activeConversationId = created.id;
    }
  }

  if (trigger === "submit-message") {
    const lastUser = getLastUserMessage(messages);
    if (lastUser) {
      const content = getTextFromUIMessage(lastUser).trim();
      if (content) {
        await prisma.message.create({
          data: {
            conversationId: activeConversationId,
            role: Role.USER,
            content,
          },
        });
        await prisma.conversation.update({
          where: { id: activeConversationId },
          data: { updatedAt: new Date() },
        });
      }
    }
  }

  const result = streamText({
    model: openRouter("openai/gpt-oss-120b:free:online"),
    system: SYSTEM_PROMPT_V1,
    messages: await convertToModelMessages(messages),
    tools: {
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        inputSchema: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
    providerOptions: {
      openrouter: {
        reasoning_effort: "medium",
        stream: true,
        temperature: 0.1,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "feedback_hint_output_schema",
            description:
              "Structured response containing evaluation of the user's latest attempt and a single guided hint. The system must enforce strict hint eligibility: a new hint is only provided if the user makes a meaningful attempt based on the previous hint. Otherwise, the hint should be a nudge or rephrased version of the previous hint without advancing. Hints must follow a progressive learning path (brute-force → better → optimal) and must not reveal the full solution, code, or exact implementation details.",
            schema: {
              type: "object",
              properties: {
                feedback: {
                  type: "string",
                  description:
                    "Brief evaluation of the user's latest attempt. Confirm correct reasoning, acknowledge partial progress and guide missing pieces, or gently redirect incorrect thinking. Do not provide full explanations or reveal the solution.",
                },
                hint: {
                  type: "string",
                  description:
                    "A single concise hint that helps the user progress. Must respect hint eligibility and solution progression rules. If the user has not made a meaningful attempt, this should NOT advance the solution and instead contain a nudge or a rephrased version of the previous hint. Must remain abstract and avoid revealing full solution steps, exact data structures, or implementation details.",
                },
              },
              required: ["feedback", "hint"],
              additionalProperties: false,
            },
          },
        },
        plugins: [
          {
            id: "web",
            max_results: 1,
            search_prompt:
              "You need to get the problem details from the specific leetcode problem.",
            include_domains: ["leetcode.com"],
            exclude_domains: ["reddit.com"],
          },
        ],
      },
    },
    onFinish: async (event) => {
      const text = event.text?.trim() ?? "";
      if (!text) return;
      try {
        await prisma.message.create({
          data: {
            conversationId: activeConversationId,
            role: Role.ASSISTANT,
            content: text,
          },
        });
        await prisma.conversation.update({
          where: { id: activeConversationId },
          data: { updatedAt: new Date() },
        });
      } catch (e) {
        console.error("Failed to persist assistant message", e);
      }
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Conversation-Id": activeConversationId,
    },
  });
}
