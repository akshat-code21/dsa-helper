import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";

const loader = new DirectoryLoader(
	"./data",
	{
		".md": (path: string) => new TextLoader(path),
	},
);

export const docs = await loader.load();

console.log(`Successfully loaded ${docs.length} documents.`);
