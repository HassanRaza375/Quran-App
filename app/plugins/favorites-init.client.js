export default defineNuxtPlugin(() => {
  const { load } = useBookmarks()
  load()
})
