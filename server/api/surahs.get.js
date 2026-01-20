export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  console.log("calling", config.public.quranApiBase);
  return await $fetch(`${config.public.quranApiBase}/surah.json`);
});
