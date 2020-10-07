import pkg from "./package.json";
import {terser} from 'rollup-plugin-terser';

export default [
  {
    input: "src/ElementScrollWatcher.js",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "auto",
      },
      {
        file: `dist/${pkg.name}.cjs.min.js`,
        format: "cjs",
        exports: "auto",
        sourcemap: true,
        plugins: [terser()]
      },
      {
        name: "ElementScrollWatcher",
        file: pkg.browser,
        format: "umd"
      },
      {
        name: "ElementScrollWatcher",
        sourcemap: true,
        file: `dist/${pkg.name}.umd.min.js`,
        format: "umd",
        plugins: [terser()]
      },
      {
        file: pkg.module,
        format: "es"
      },
      {
        file: `dist/${pkg.name}.esm.min.js`,
        sourcemap: true,
        format: "es",
        plugins: [terser()]
      }
    ]
  }
]