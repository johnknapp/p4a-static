import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from "astro-icon";
import vue from '@astrojs/vue';
import { plugin as formkitPlugin } from '@formkit/vue';
import formkitConfig from './src/formkit.config';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
    vue({
      appEntrypoint: '/src/vue-app',
    })
  ],
  output: 'static',
  outDir: './dist'
});