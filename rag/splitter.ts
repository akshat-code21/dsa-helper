import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { docs } from "./ingest";
import { vectorStore } from "./vectorStore";

export const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});

const allSplits = await splitter.splitDocuments(docs);

console.log(`Split blog post into ${allSplits.length} sub-documents.`);

await vectorStore.addDocuments(allSplits);
