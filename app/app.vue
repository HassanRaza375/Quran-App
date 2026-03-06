<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <Analytics />
    <NuxtPage />
  </NuxtLayout>
  <AppToast />
</template>

<script setup>
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<style></style>
