import { createVuetify } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
    },

    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            background: "#F3F8F9",
            surface: "#FFFFFF",
            primary: "#13547A",
            secondary: "#80D0C7",
            accent: "#4DB6AC",
          },
        },

        dark: {
          dark: true,
          colors: {
            background: "#0F2A33",
            surface: "#102F3A",
            primary: "#80D0C7",
            secondary: "#4DB6AC",
            accent: "#9FE3DC",
          },
        },
      },
    },

    defaults: {
      global: {
        style: {
          fontFamily: "Sansation, system-ui, sans-serif",
        },
      },
    },
  });
  if (process.client) {
    const theme = vuetify.theme.global;

    const apply = () => {
      const saved = localStorage.getItem("themeMode") || "system";

      if (saved === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        theme.name.value = isDark ? "dark" : "light";
      } else {
        theme.name.value = saved;
      }
    };

    // Applied after mount, not synchronously here: the server always renders
    // the "light" default (it has no way to know the client's OS preference
    // or localStorage), so switching the theme before hydration finishes
    // causes every themed class on the page to hydration-mismatch against
    // the server HTML. Deferring to `app:mounted` means the first paint
    // matches the server, then swaps to the real theme right after — a
    // brief flash for dark-mode users instead of a hydration warning +
    // fighting the DOM Vue just hydrated.
    nuxtApp.hook("app:mounted", apply);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
      const current = localStorage.getItem("themeMode") || "system";
      if (current === "system") {
        theme.name.value = e.matches ? "dark" : "light";
      }
    });
  }

  nuxtApp.vueApp.use(vuetify);
});
