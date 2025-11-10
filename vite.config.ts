import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [cloudflare()],
    server: {
        cors: false, // https://hono.dev/docs/middleware/builtin/cors#using-with-vite
    },
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
        },
        sourcemap: true,
    },
    clearScreen: false,
});
