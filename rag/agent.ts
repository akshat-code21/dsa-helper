import { createAgent, SystemMessage } from "langchain";
import { retrieve } from "./retrieve";
import { model } from "./models";
import { SYSTEM_PROMPT_V2 } from "@/prompts";

const tools = [retrieve];
const systemPrompt = new SystemMessage(SYSTEM_PROMPT_V2);

export const agent = createAgent({ model, tools, systemPrompt });
