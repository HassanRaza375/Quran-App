<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <Analytics />
    <NuxtPage />
  </NuxtLayout>
  <AppToast />
  <PwaUpdatePrompt />
  <VitePwaManifest />
</template>

<script setup>
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<style></style>
