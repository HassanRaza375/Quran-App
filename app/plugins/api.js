export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.quranApiBase,
  });

  const api2 = $fetch.create({
    baseURL: config.public.quranApiBase2,
  });
  return {
    provide: {
      api,
      api2,
    },
  };
});
