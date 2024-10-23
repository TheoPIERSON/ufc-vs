// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "UFC Versus",
      link: [
        { rel: "icon", type: "image/x-icon", href: "favicon.ico" }, // Chemin correct pour le favicon dans static/
        // Tu peux ajouter d'autres tailles d'icônes si nécessaire
        { rel: "apple-touch-icon", sizes: "180x180", href: "/images/apple-touch-icon.png" }, // Exemple d'icône pour mobile
      ],
    },
  },
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },
  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false,
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@nuxt/icon", "@nuxt/fonts"],
});
