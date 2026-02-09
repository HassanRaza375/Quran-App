<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="h-100vh">
          <h1 class="text-h4">Tasbeeh</h1>
          <p>Surah {{ route.params.id }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.h-100vh {
  height: calc(100vh - 130px);
}
</style>
