<template>
  <v-container class="reader-container">
    <v-row dense>
      <v-col cols="12" v-if="error">Error{{ error }}</v-col>
      <v-col cols="12" v-if="pending">Pending {{ pending }}</v-col>
      <v-col cols="12">
        Juz of Quran {{ juzNo }}
        <v-sheet class="pa-3">
          <p>{{ data.data.surahs["2"].name }}</p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();
const juzNo = route.params.id;
const { data, pending, error } = useFetch("/api/juz", {
  query: {
    juzNo,
  },
  key: `juz-${juzNo}`, // cache per juz
  lazy: true, // don't block navigation
  cache: true,
});
</script>
<style scoped></style>
