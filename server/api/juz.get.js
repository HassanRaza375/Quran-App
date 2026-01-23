export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const transaltionType = null;
  const { juzNo } = getQuery(event);

  if (!juzNo) {
    throw createError({
      statusCode: 400,
      statusMessage: "juzNo is required",
    });
  }
  return await $fetch(
    `${config.public.quranApiBase2}/juz/${juzNo}/${transaltionType || "quran-uthmani"}`,
  );
});
