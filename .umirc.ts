import { defineConfig } from 'umi';
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const chainWebpack = (config, { webpack }) => {
  config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
    {
      languages: ['javascript', 'typescript', 'json', 'html', 'css']
    }
  ])
};
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
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
