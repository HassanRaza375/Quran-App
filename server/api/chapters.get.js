export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const { chapterNo } = getQuery(event)

    if (!chapterNo) {
        throw createError({
            statusCode: 400,
            statusMessage: 'chapterNo is required',
        })
    }

    return await $fetch(
        `${config.public.quranApiBase}/${chapterNo}.json`
    )
})
