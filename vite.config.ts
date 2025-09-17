import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";

export default defineConfig({
    plugins: [cloudflare(), ssrPlugin()],
    server: {
        cors: false, // https://hono.dev/docs/middleware/builtin/cors#using-with-vite
    },
    build: {
        sourcemap: true,
    },
    clearScreen: false,
});
