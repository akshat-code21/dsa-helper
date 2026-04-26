import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { embeddings } from "@/rag/models";

export const vectorStore = await NeonPostgres.initialize(embeddings, {
	connectionString: process.env.DATABASE_URL!,
});
