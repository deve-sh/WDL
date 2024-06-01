const { execSync } = require("child_process");

execSync("npm run test", { stdio: "inherit" });
execSync("tsup api/index.ts --format cjs --dts", { stdio: "inherit" });

const fs = require("fs");
const path = require("path");

fs.cpSync(
	path.resolve(__dirname, "../package.json"),
	path.resolve(__dirname, "../dist/package.json")
);

fs.cpSync(
	path.resolve(__dirname, "../../README.md"),
	path.resolve(__dirname, "../dist/README.md")
);
