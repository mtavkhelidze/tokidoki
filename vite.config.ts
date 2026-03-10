import { defineConfig } from "vitest/config";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            name: "tokidoki",
            fileName: (format) => `tokidoki.${format}.js`,
            formats: ["es", "cjs", "umd"],
        },
        target: "es2015",
        sourcemap: true,
        rollupOptions: {
            output: {
                exports: "named",
            },
        },
    },
    test: {
        globals: true,
    },
});
