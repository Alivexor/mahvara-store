import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const publicDir = path.join(root, "public");

await rm(publicDir, { recursive: true, force: true });
await mkdir(path.join(publicDir, "assets"), { recursive: true });
for (const asset of ["vazirmatn.woff2", "mahvara-mark.svg", "mahvara-wordmark.svg"]) {
  await copyFile(path.join(root, "assets", asset), path.join(publicDir, "assets", asset));
}
for (const directory of ["audio", "captures"]) {
  await cp(path.join(root, directory), path.join(publicDir, directory), {
    recursive: true,
    force: true,
    filter: (source) => !source.includes(`${path.sep}.tmp`) && !source.includes(`${path.sep}previews`),
  });
}
console.log("Remotion public assets synchronized.");
