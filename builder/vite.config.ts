import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			lib: path.resolve(__dirname, "../lib"),
		},
	},
	optimizeDeps: {
		include: ["lib"],
	},
});
