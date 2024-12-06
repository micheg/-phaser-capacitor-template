import path from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	root: "./src",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					// Copia solo se ci sono file nella directory assets/images
					src: "assets/images/**/*",
					dest: "assets/images",
				},
				{
					// Copia solo se ci sono file nella directory assets/sounds
					src: "assets/sounds/**/*",
					dest: "assets/sounds",
				},
			],
		}),
	],
});
