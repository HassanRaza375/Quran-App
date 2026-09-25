<!-- Top-of-page notices shared by every /fiqh page: the Sunni banner (Q4) and
     the "Not scholar-reviewed" label (Q10). Rendered after mount because the
     fiqh setting is read client-side — avoids flashing the Sunni banner at
     Ja'fari users during hydration. -->
<template>
  <div v-if="mounted" class="d-flex flex-column ga-2">
    <v-alert v-if="isSunni" type="info" variant="tonal" density="compact" icon="mdi-information-outline">
      <strong>Fiqh Ja'fari only for now.</strong> Your setting is Sunni. You can still read this
      module, but every ruling in it is from a Ja'fari marja'. Sunni fiqh content is planned for later.
    </v-alert>
    <div v-if="showReviewLabel">
      <v-chip size="small" variant="outlined" color="warning" prepend-icon="mdi-account-alert-outline">
        Not scholar-reviewed
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { usePrayerStore } from "~/stores/prayer";

defineProps({
  showReviewLabel: { type: Boolean, default: false },
});

const prayer = usePrayerStore();
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const isSunni = computed(() => prayer.fiqh !== "jafari");
</script>
