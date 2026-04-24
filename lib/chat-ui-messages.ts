import type { UIMessage } from "ai";
import type { Message as DbMessage, Role } from "@/app/generated/prisma/client";

const roleToUi: Record<Role, "user" | "assistant"> = {
  USER: "user",
  ASSISTANT: "assistant",
};

export function dbMessageToUIMessage(row: DbMessage): UIMessage {
  return {
    id: row.id,
    role: roleToUi[row.role],
    parts: [{ type: "text", text: row.content }],
  };
}
