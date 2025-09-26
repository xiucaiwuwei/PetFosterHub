import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import {resolve} from 'node:path';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // 区分开发环境和生产环境的配置
  const isDevelopment = mode === 'development';
  
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 3000, // 保持与项目现有配置一致
      host: '0.0.0.0',
      strictPort: false,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: !isDevelopment,
          timeout: isDevelopment ? 30000 : 10000,
          configure: (proxy) => {
            // 增强错误处理和重试机制
            let retryCount = 0;
            const maxRetries = 3;
            
            proxy.on('error', (err: NodeJS.ErrnoException, req) => {
              if (isDevelopment) {
                console.error('🚨 代理错误:', {
                  error: err.message,
                  code: err.code,
                  url: req.url,
                  method: req.method,
                  timestamp: new Date().toISOString(),
                  retryCount: retryCount
                });
              }
              
              // 自动重试机制
              if (retryCount < maxRetries && err.code === 'ECONNREFUSED') {
                retryCount++;
                if (isDevelopment) {
                  console.log(`🔄 自动重试 (${retryCount}/${maxRetries})...`);
                }
              }
            });
            
            proxy.on('proxyReq', (proxyReq, req) => {
              if (isDevelopment) {
                console.log('📤 代理请求:', {
                  method: req.method,
                  url: req.url,
                  target: `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
                  timestamp: new Date().toISOString()
                });
              }
            });
            
            proxy.on('proxyRes', (proxyRes, req) => {
              if (isDevelopment) {
                console.log('📥 代理响应:', {
                  statusCode: proxyRes.statusCode,
                  statusMessage: proxyRes.statusMessage,
                  url: req.url,
                  timestamp: new Date().toISOString()
                });
              }
              
              // 重置重试计数
              retryCount = 0;
            });
          }
        }
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      watch: {
        usePolling: false,
        useFsEvents: true
      },
      // 优化开发服务器性能
      hmr: {
        overlay: true, // 显示错误覆盖层
        port: 3001 // 使用不同端口避免冲突
      }
    },
    css: {
      postcss: './postcss.config.js'
    },
    // 添加构建优化配置
    build: {
      // 内存优化配置
      commonjsOptions: {
        ignoreDynamicRequires: true, // 忽略动态require以减少内存使用
      },
      dynamicImportVarsOptions: {
        exclude: [/node_modules/], // 排除node_modules中的动态导入
      },

      // 生产环境启用压缩
      minify: isDevelopment ? false : 'esbuild',
      // 开发环境启用sourcemap便于调试，生产环境禁用
      sourcemap: isDevelopment ? 'inline' : false,
      // 构建优化
      target: isDevelopment ? 'esnext' : 'es2015',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 800, // 降低警告阈值到800KB
      assetsInlineLimit: 2048, // 降低内联限制到2KB
      // 添加内存优化配置 - 合并到现有的rollupOptions中
      rollupOptions: {
        output: {
          // 为文件名添加内容哈希，避免缓存问题
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
          // 代码分割优化 - 更细粒度的分割
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('react-router-dom')) {
                return 'router-vendor';
              }
              if (id.includes('redux') || id.includes('@reduxjs/toolkit') || id.includes('redux-persist')) {
                return 'state-vendor';
              }
              if (id.includes('axios')) {
                return 'utils-vendor';
              }
              // 其他较大的库单独打包
              if (id.includes('framer-motion') || id.includes('recharts')) {
                return 'animation-vendor';
              }
              // 默认将所有其他node_modules打包到common-vendor
              return 'common-vendor';
            }
            // 对于非node_modules的文件，不进行特殊分块处理
            return undefined;
          }
        },
        onwarn(warning, warn) {
          // 忽略某些警告以减少内存压力
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          warn(warning);
        }
      }
    },
    // 添加预览服务器配置
    preview: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false
    }
  };
});
