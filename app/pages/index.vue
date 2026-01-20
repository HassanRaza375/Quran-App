<template>
  <v-container>
    <v-row dense>
      <v-col v-for="(surah, i) in data" :key="surah.id" cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card outlined hover @click="goto(i + 1)">
          <v-card-item>
            <v-card-title>
              <div class="d-flex justify-end">
                <span class="font-weight-black">{{ surah.surahNameArabicLong }}</span>
              </div>
            </v-card-title>

            <v-card-subtitle>
              Quran Aya {{ i + 1 }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text class="bg-surface-light pt-4">
            <div>
              English Name:({{ surah?.surahNameTranslation }})
            </div>
            <div>
              Revelation Place: {{ surah?.revelationPlace }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const router = useRouter();
const { data, pending, error } = await useFetch("/api/surahs");
const goto = (path) => {
  router.push("surah/" + path);
};
</script>