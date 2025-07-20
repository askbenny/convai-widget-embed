import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * 
 * @author ${pkg.author}
 * @license ${pkg.license}
 */`;

const input = 'src/askbenny-widget.js';

export default [
  // ES Module build
  {
    input,
    output: {
      file: pkg.module,
      format: 'es',
      banner
    },
    plugins: [resolve()]
  },

  // CommonJS build
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      banner,
      exports: 'auto'
    },
    plugins: [resolve()]
  },

  // UMD build (for unpkg.com and browsers)
  {
    input,
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'AskBennyWidget',
      banner
    },
    plugins: [resolve()]
  },

  // Minified UMD build
  {
    input,
    output: {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name: 'AskBennyWidget',
      banner
    },
    plugins: [
      resolve(),
      terser({
        format: {
          comments: /^\/\*\*[\s\S]*?\*\//
        }
      })
    ]
  }
]; 