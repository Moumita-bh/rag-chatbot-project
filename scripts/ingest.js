// ingest.js
import fs from 'fs';
import path from 'path';
import glob from 'glob';
import pdfParse from 'pdf-parse';
import { encoding_for_model } from '@dqbd/tiktoken';
import { OpenAI } from 'openai';
import chroma from 'chromadb';

const CHUNK_SIZE = 750;
const DATA_DIR = path.resolve('data/sample-documents');
const client = new chroma.Client();
const collection = await client.getOrCreateCollection('rag_faq');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function chunkText(text) {
  const enc = encoding_for_model('text-embedding-3-small');
  const tokens = enc.encode(text);
  const out = [];
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    out.push(enc.decode(tokens.slice(i, i + CHUNK_SIZE)));
  }
  return out;
}

async function ingestFile(filepath) {
  let text = '';
  if (filepath.endsWith('.pdf')) {
    const data = await pdfParse(fs.readFileSync(filepath));
    text = data.text;
  } else {
    text = fs.readFileSync(filepath, 'utf-8');
  }
  const chunks = chunkText(text);
  for (const [i, chunk] of chunks.entries()) {
    const res = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk,
    });
    const emb = res.data[0].embedding;
    await collection.add({
      ids: [`${path.basename(filepath)}_${i}`],
      embeddings: [emb],
      metadatas: [{ text: chunk }],
    });
    console.log(`Ingested chunk ${i} from ${filepath}`);
  }
}

(async () => {
  const files = glob.sync(`${DATA_DIR}/*.{txt,md,pdf}`);
  for (const f of files) await ingestFile(f);
  console.log('✅ Ingestion complete');
})();
