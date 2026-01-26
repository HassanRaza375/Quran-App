export const useApi = () => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.quranApiBase,
  });

  const api2 = $fetch.create({
    baseURL: config.public.quranApiBase2,
  });

  return { api, api2 };
};
