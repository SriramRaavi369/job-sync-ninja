
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use import.meta.url to get the current module's URL, then convert to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically resolve the path to pdfjs-dist
const pdfjsDistPath = path.dirname(path.dirname(require.resolve('pdfjs-dist/package.json')));

const pdfWorkerSourcePath = path.join(pdfjsDistPath, 'build', 'pdf.worker.min.mjs');
const publicPath = path.resolve(__dirname, 'public');
const pdfWorkerDestinationPath = path.join(publicPath, 'pdf.worker.min.js');

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

fs.copyFileSync(pdfWorkerSourcePath, pdfWorkerDestinationPath);

console.log(`Copied ${pdfWorkerSourcePath} to ${pdfWorkerDestinationPath}`);
