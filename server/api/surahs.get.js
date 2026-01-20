export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return await $fetch(`${config.public.quranApiBase}/surah.json`);
});
