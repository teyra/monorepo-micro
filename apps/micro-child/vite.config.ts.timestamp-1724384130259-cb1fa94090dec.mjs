// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/code/common/monorepo-micro/node_modules/.pnpm/vite@5.4.2_@types+node@20.16.1_sass@1.77.8/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/code/common/monorepo-micro/node_modules/.pnpm/@vitejs+plugin-vue@5.1.2_vite@5.4.2_@types+node@20.16.1_sass@1.77.8__vue@3.4.38_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/code/common/monorepo-micro/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.4.2_@types+node@20.16.1_sass@1.77.8__vue@3.4.38_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/code/common/monorepo-micro/node_modules/.pnpm/unplugin-auto-import@0.18.2_@vueuse+core@11.0.1_vue@3.4.38_typescript@5.4.5___rollup@4.21.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/code/common/monorepo-micro/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.25.3_rollup@4.21.0_vue@3.4.38_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/code/common/monorepo-micro/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.25.3_rollup@4.21.0_vue@3.4.38_typescript@5.4.5_/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///D:/code/common/monorepo-micro/apps/micro-child/vite.config.ts";
var vite_config_default = defineConfig({
  server: {
    port: 4e3,
    host: "0.0.0.0",
    open: true
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXGNvbW1vblxcXFxtb25vcmVwby1taWNyb1xcXFxhcHBzXFxcXG1pY3JvLWNoaWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RlXFxcXGNvbW1vblxcXFxtb25vcmVwby1taWNyb1xcXFxhcHBzXFxcXG1pY3JvLWNoaWxkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jb2RlL2NvbW1vbi9tb25vcmVwby1taWNyby9hcHBzL21pY3JvLWNoaWxkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA0MDAwLFxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBvcGVuOiB0cnVlXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV1cbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV1cbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxTQUFTLGVBQWUsV0FBVztBQUMzVyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBTjJLLElBQU0sMkNBQTJDO0FBT2hRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
