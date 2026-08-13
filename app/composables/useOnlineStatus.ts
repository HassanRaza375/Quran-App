// Shared across the whole app (useState) — `init` is idempotent so it's
// safe to call from multiple components (app bar + downloads page) without
// attaching duplicate `online`/`offline` listeners.
let listenersAttached = false;

export const useOnlineStatus = () => {
  const isOnline = useState<boolean>("online-status", () => true);

  const init = () => {
    if (!import.meta.client) return;
    isOnline.value = navigator.onLine;
    if (listenersAttached) return;
    listenersAttached = true;
    window.addEventListener("online", () => (isOnline.value = true));
    window.addEventListener("offline", () => (isOnline.value = false));
  };

  return { isOnline, init };
};
