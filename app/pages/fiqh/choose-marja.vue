<template>
  <v-container class="fiqh-container">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="backTo" class="mb-2">Back</v-btn>
    <v-sheet elevation="0" rounded="lg" class="hero pa-4 mb-4">
      <h1 class="hero-title">Choose your marja'</h1>
      <p class="hero-subtitle">
        Daily Fiqh shows only the rulings of the marja' you follow. Nothing is filled in from another
        marja'. You can change this at any time, here or in Settings.
      </p>
    </v-sheet>

    <div v-if="!loaded" class="py-6 text-center">
      <v-progress-circular indeterminate color="primary" aria-label="Loading your marja' preference" />
    </div>
    <MarjaPicker v-else :initial="marjaId" confirm-label="Save and continue" @chosen="goBack" />
  </v-container>
</template>

<script setup>
import MarjaPicker from "~/components/wajibat/MarjaPicker.vue";

useHead({ title: "Choose your marja' — Daily Fiqh" });

useUrduFont();
const route = useRoute();
const router = useRouter();
const { marjaId, loaded, load } = useFiqhPrefs();
onMounted(() => load());

// Only follow in-app /fiqh paths back, never an arbitrary URL from the query string.
const backTo = computed(() => {
  const from = String(route.query.from ?? "");
  return from.startsWith("/fiqh") && !from.startsWith("//") ? from : "/fiqh";
});
const goBack = () => router.push(backTo.value);
</script>

<style scoped>
.fiqh-container {
  max-width: 760px;
  margin: auto;
  padding-bottom: 60px;
}
.hero {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.06), rgba(var(--v-theme-secondary), 0.06));
}
.hero-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.hero-subtitle {
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin: 0;
}
</style>
