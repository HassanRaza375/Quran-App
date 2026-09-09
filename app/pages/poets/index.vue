<template>
  <v-container>
    <v-sheet elevation="0" rounded="lg" class="pa-4 mb-6">
      <h1 class="text-h4 mb-1">Literary Modules</h1>
      <p class="text-body-2 text-medium-emphasis">
        Source-verified study modules on Urdu/Islamic poets. Each verse and fact carries a
        verification level (A–E) so you always know how confirmed it is — see
        <NuxtLink to="/about">About</NuxtLink> for the methodology.
      </p>
    </v-sheet>

    <v-row>
      <v-col v-for="m in modules" :key="m.slug" cols="12" sm="6" md="4">
        <v-card rounded="xl" class="pa-4 h-100" :to="`/poets/${m.slug}`">
          <div class="d-flex align-center justify-space-between mb-1">
            <span class="text-h6">{{ m.name }}</span>
            <v-chip size="small" variant="tonal">{{ statusLabel(m.status) }}</v-chip>
          </div>
          <div class="text-subtitle-2 text-medium-emphasis mb-2">{{ m.nameUrdu }}</div>
          <p class="text-body-2">{{ m.tagline }}</p>
        </v-card>
      </v-col>
    </v-row>

    <v-alert type="info" variant="tonal" class="mt-6">
      More modules — from other contributors' research — will appear here over time.
    </v-alert>
  </v-container>
</template>

<script setup>
useHead({ title: "Literary Modules — Quran App" });
useSeoMeta({ robots: "noindex, follow" });

const { modules } = usePoetModules();

const statusLabel = (status) =>
  ({ seed: "Seed data", "in-progress": "In progress", complete: "Complete" })[status] ?? status;
</script>
