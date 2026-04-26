import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { embeddings } from "@/rag/models";

let _vectorStore: NeonPostgres | null = null;

export async function getVectorStore(): Promise<NeonPostgres> {
	if (!_vectorStore) {
		_vectorStore = await NeonPostgres.initialize(embeddings, {
			connectionString: process.env.DATABASE_URL!,
		});
	}
	return _vectorStore;
}
