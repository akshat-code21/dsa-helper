import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CohereEmbeddings } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// export const model = new ChatOpenAI({
// 	model: "gpt-5.4-nano",
// 	apiKey: process.env.OPENAI_API_KEY,
// });

// export const embeddings = new OpenAIEmbeddings({
// 	model: "text-embedding-3-small",
// 	apiKey: process.env.OPENAI_API_KEY,
// });


export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY
});

export const embeddings = new CohereEmbeddings({
	model: "embed-english-v3.0",
	apiKey: process.env.COHERE_API_KEY
});