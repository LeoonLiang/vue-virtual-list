import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.module, format: 'es', sourcemap: true },
    { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'named' },
  ],
  external: ['vue', 'vue-demi'],
  plugins: [
    nodeResolve({ extensions: ['.js', '.ts', '.vue'] }),
    vue({
      target: 'browser',
      css: true,            // 内联 CSS
      compileTemplate: true, 
      exposeFilename: false,
      preprocessStyles: true,
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist',
          emitDeclarationOnly: false,
        },
      },
    }),
  ],
}
