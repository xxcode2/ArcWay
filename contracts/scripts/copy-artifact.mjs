import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const artifactPath = join(
  __dirname,
  "..",
  "artifacts",
  "contracts",
  "ArcToken.sol",
  "ArcToken.json",
);

if (!existsSync(artifactPath)) {
  console.error(
    "Artifact not found. Run `npm run compile` inside /contracts first (requires `npm install`).",
  );
  process.exit(1);
}

const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));
const out = {
  abi: artifact.abi,
  bytecode: artifact.bytecode,
};

const destDir = join(__dirname, "..", "..", "src", "contracts");
mkdirSync(destDir, { recursive: true });
writeFileSync(join(destDir, "ArcToken.json"), JSON.stringify(out, null, 2));

console.log(`✔ Copied ArcToken ABI + bytecode to src/contracts/ArcToken.json`);
