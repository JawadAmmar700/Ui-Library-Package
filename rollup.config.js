import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import packageJson from "./package.json" assert { type: "json" };

export default [
  // CommonJS Build
  {
    input: "src/index.ts",
    output: {
      dir: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist/cjs/types",
        rootDir: "src",
      }),
      postcss({ extensions: [".css"], inject: true, extract: false }),
    ],
  },
  // ESM Build
  {
    input: "src/index.ts",
    output: {
      dir: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist/esm/types",
        rootDir: "src",
      }),
      postcss({ extensions: [".css"], inject: true, extract: false }),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types, format: "esm" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
  {
    input: "src/styles/globals.css",
    output: [{ file: "dist/index.css", format: "es" }],
    plugins: [
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
];
