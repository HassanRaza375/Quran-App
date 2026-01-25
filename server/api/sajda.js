export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    return await $fetch(`${config.public.quranApiBase2}/sajda/quran-uthmani`);
});
