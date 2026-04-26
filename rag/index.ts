import "./splitter";
import { agent } from "./agent";

// let inputMessage = `What is the standard method for Task Decomposition?
// Once you get the answer, look up common extensions of that method.`;

export const getAnswerUsingRag = async (inputMessage: string) => {
	let agentInputs = { messages: [{ role: "user", content: inputMessage }] };

	const stream = await agent.stream(agentInputs, {
		streamMode: "values",
	});

	for await (const step of stream) {
		const lastMessage = step.messages[step.messages.length - 1];
		if (!lastMessage) {
			break;
		}

		const type = lastMessage._getType();
		const content =
			typeof lastMessage.content === "string"
				? lastMessage.content
				: JSON.stringify(lastMessage.content);

		// AI tool-call messages have empty content but tool_calls data
		// @ts-ignore
		if (type === "ai" && !content && lastMessage.tool_calls?.length) {
			// @ts-ignore
			const toolNames = lastMessage.tool_calls
				.map((tc: any) => tc.name)
				.join(", ");
			console.log(`[ai]: Calling tool(s): ${toolNames}`);
			console.log("-----\n");
			continue;
		}

		// Skip messages with no content
		if (!content) continue;

		console.log(`[${type}]: ${content}`);
		console.log("-----\n");
	}
};
