import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://wattsettle.suriota.id',
  integrations: [react(), icon({ iconDir: 'src/icons' })],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
