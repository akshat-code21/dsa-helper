import { agent } from "./agent";

// let inputMessage = `What is the standard method for Task Decomposition?
// Once you get the answer, look up common extensions of that method.`;

export const getContextUsingRag = async (inputMessage: string) => {
	let agentInputs = { messages: [{ role: "user", content: inputMessage }] };

	const stream = await agent.stream(agentInputs, {
		streamMode: "values",
	});

	let finalAnswer = "";
	for await (const step of stream) {
		const lastMessage = step.messages[step.messages.length - 1];
		if (!lastMessage) break;

		const type = lastMessage._getType();
		if (type === "ai") {
			const content =
				typeof lastMessage.content === "string"
					? lastMessage.content
					: JSON.stringify(lastMessage.content);
			if (content) finalAnswer = content;
		}
	}
    return finalAnswer;
};
