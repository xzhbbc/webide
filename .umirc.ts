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
    { path: '/code', component: '@/pages/index', routes: [
        {
          path: '/',
          microApp: 'vue'
        }
      ] }
  ],
  // mfsu: {},
  antd: {},
  fastRefresh: {},
  sass: {},
  chainWebpack
});
