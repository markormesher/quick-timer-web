import { defineConfig } from "vite";

export default defineConfig(({}) => {
  return {
    root: "./src",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          app: "src/index.html",
          sw: "src/sw.ts",
        },
        output: {
          entryFileNames: (chunk) => (chunk.name === "sw" ? "sw.js" : "assets/[name]-[hash].js"),
        },
      },
    },
    define: {
      "process.env": {},
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
  };
});
