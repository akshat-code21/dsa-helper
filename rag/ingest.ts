import "dotenv/config";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "./vectorStore";
import path from "path";

async function ingest() {
	const dataPath = path.resolve(__dirname, "data");

	const loader = new DirectoryLoader(dataPath, {
		".md": (filePath: string) => new TextLoader(filePath),
	});

	const docs = await loader.load();
	console.log(`✅ Loaded ${docs.length} documents from ${dataPath}`);

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});

	const allSplits = await splitter.splitDocuments(docs);
	console.log(`Split into ${allSplits.length} chunks`);

	const vectorStore = await getVectorStore();
	await vectorStore.addDocuments(allSplits);
	console.log(`Added ${allSplits.length} chunks to the vector store`);
}

ingest().catch((err) => {
	console.error("Ingestion failed:", err);
	process.exit(1);
});
