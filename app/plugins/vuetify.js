import { createVuetify } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  // Resolved ("light"/"dark", never "system") theme from the *previous*
  // visit, sent back to the server as a cookie — unlike localStorage, a
  // cookie is available during SSR, so the server can render the correct
  // theme on the very first paint instead of always defaulting to light.
  // This is what fixes the half-dark/half-light flash on refresh: without
  // it, the server always emits light-themed HTML and the client only
  // corrects it after the app finishes mounting.
  const themeCookie = useCookie("theme-resolved", {
    default: () => "light",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  const vuetify = createVuetify({
    icons: {
      defaultSet: "mdi",
    },

    theme: {
      defaultTheme: themeCookie.value === "dark" ? "dark" : "light",
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
  if (import.meta.client) {
    const theme = vuetify.theme.global;

    const resolve = (mode) =>
      mode === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : mode;

    const apply = () => {
      const resolved = resolve(localStorage.getItem("themeMode") || "system");
      theme.name.value = resolved;
      // Keep the cookie in sync so the *next* full page load/refresh has the
      // right theme available at SSR time, even if the mode is "system" and
      // resolution depends on matchMedia (which the server can't evaluate).
      themeCookie.value = resolved;
    };

    // Runs synchronously here, before the app mounts — the cookie already
    // matches this resolved value in the common case (the server used it to
    // pick `defaultTheme` above), so this is a no-op re-assignment and there
    // is no hydration mismatch. It only visibly changes anything on a first
    // visit (no cookie yet) or right after the OS-level preference changed
    // while on "system" mode — both rare, and both no worse than before.
    apply();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      const current = localStorage.getItem("themeMode") || "system";
      if (current === "system") {
        theme.name.value = e.matches ? "dark" : "light";
        themeCookie.value = e.matches ? "dark" : "light";
      }
    });
  }

  nuxtApp.vueApp.use(vuetify);
});
