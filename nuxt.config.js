
export default defineNuxtConfig({
  compatibilityDate: '2026-09-27',

  devtools: {
    enabled: false,
  },

  modules: ['@pinia/nuxt', '@nuxt/image'],

  css: ['~/assets/css/global.css'],

  app: {
    head: {
      script: [
        {
          src: 'https://mcp.figma.com/mcp/html-to-design/capture.js',
          async: true,
        },
      ],
    },
  },
})
