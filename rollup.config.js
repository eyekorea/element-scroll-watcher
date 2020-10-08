import pkg from "./package.json";
import {terser} from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const isProduction = process.env.NODE_ENV === 'production';



const devPlugin = () => [
  serve({
    open: true,
    openPage: "/demo/",
    host: 'localhost',
    port: 3000,
  }),
  livereload(),
];

const config = {
  input: "src/element-scroll-watcher.js",
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
      name: pkg.name,
      file: pkg.browser,
      format: "umd"
    },
    {
      name: pkg.name,
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
  ],
  plugins: isProduction ? [] : devPlugin()
}

export default [
  config
]