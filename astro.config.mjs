import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Production origin, used for canonical and hreflang alternate URLs.
  // TODO: confirm the final production domain before launch.
  site: "https://www.millionwords.net",
  integrations: [react()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ca", "es", "de", "sv", "nl", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
