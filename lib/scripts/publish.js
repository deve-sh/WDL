const { execSync } = require("child_process");

execSync("cd ./dist && npm publish");
