import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const locales = ["en", "ca", "es", "de", "sv", "nl", "fr"];

export default defineConfig({
  // Production origin, used for canonical and hreflang alternate URLs.
  // www.millionwords.net redirects here, so the bare domain is canonical.
  site: "https://millionwords.net",
  integrations: [
    react(),
    // sitemap-index.xml, with each page's language versions listed as
    // alternates to match the hreflang tags. The 404 pages are left out.
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: Object.fromEntries(locales.map((code) => [code, code])),
      },
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
