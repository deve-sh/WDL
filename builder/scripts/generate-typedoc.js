import fs from "fs";
import { execSync } from "child_process";

execSync("cd ../lib && npm install && npx typedoc api/index.ts");

fs.cpSync("../lib/docs", "./dist/docs", { recursive: true });
