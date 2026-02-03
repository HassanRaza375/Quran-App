import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,

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

    // Load saved theme
    const savedTheme = localStorage.getItem("themeMode");

    if (savedTheme) {
      if (savedTheme === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        theme.name.value = isDark ? "dark" : "light";
      } else {
        theme.name.value = savedTheme;
      }
    } else {
      // fallback to system
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      theme.name.value = isDark ? "dark" : "light";
    }

    // React to OS changes IF system selected
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const current = localStorage.getItem("themeMode") || "system";
        if (current === "system") {
          theme.name.value = e.matches ? "dark" : "light";
        }
      });
  }

  nuxtApp.vueApp.use(vuetify);
});
