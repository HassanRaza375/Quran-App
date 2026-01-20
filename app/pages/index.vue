<script setup>
const { data, pending, error } = await useFetch("/api/surahs");
console.log(data);
</script>
<template>
  <v-container>
    <main>
      <h1>Qur’an Surahs</h1>

      <p v-if="pending">Loading Surahs...</p>
      <p v-else-if="error">Failed to load data</p>

      <ul v-else>
        <li v-for="surah in data" :key="surah.id">
          {{ surah.surahName }}
        </li>
      </ul>
    </main>
  </v-container>
</template>
