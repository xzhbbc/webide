import { defineConfig } from 'umi';
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// const WasmModuleWebpackPlugin = require('wasm-module-webpack-plugin');

const chainWebpack = (config, { webpack }) => {
  config.module.rule('wasm').test(/\.wasm$/).use('loaders').loader('wasm-loader')
  config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
    {
      languages: ['javascript', 'typescript', 'json', 'html', 'css']
    }
  ])
  // config.plugin('wasm-plugin').use(new WasmModuleWebpackPlugin.WebpackPlugin())
};
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImportSyntax: {},
  routes: [
    { path: '/', component: '@/pages/file/index' },
    { path: '/vue', component: '@/pages/code/vue/index' },
    { path: '/jsx', component: '@/pages/code/jsx/index' }
  ],
  // mfsu: {},
  antd: {},
  fastRefresh: {},
  sass: {},
  chainWebpack
});
