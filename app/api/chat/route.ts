import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, UIMessage, tool } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT_V1 } from "@/prompts";

const openRouter = createOpenRouter({
  apiKey: process.env.NEXT_PUBLIC_GATEWAY_API_KEY,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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
  });

  return result.toUIMessageStreamResponse();
}
