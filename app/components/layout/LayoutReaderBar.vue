<template>
  <v-app-bar app flat class="d-flex align-center">
    <NuxtLink to="/surah-listing">
      <v-btn icon>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </NuxtLink>
    <v-app-bar-title>Reader</v-app-bar-title>
  </v-app-bar>
</template>
<style scoped>
body {
  font-family: serif !important;
}
a {
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
