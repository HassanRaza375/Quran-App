<template>
  <v-container>
    <!-- Controls -->
    <v-row align="center">
      <v-col cols="12" md="4">
        <v-autocomplete
          v-model="page"
          :items="pages"
          item-title="title"
          item-value="value"
          label="Pages"
          variant="outlined"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </v-col>

      <v-col cols="12" md="8" class="d-flex justify-end gap">
        <v-btn
          variant="outlined"
          :disabled="page === 1 || isLoading"
          :loading="isLoading && navDir === 'prev'"
          @click="prevPage"
        >
          Prev
        </v-btn>

        <v-btn
          color="primary"
          :disabled="page === 604 || isLoading"
          :loading="isLoading && navDir === 'next'"
          @click="nextPage"
        >
          Next
        </v-btn>
      </v-col>
    </v-row>

    <!-- Skeleton Loader -->
    <v-row v-if="isLoading">
      <v-col cols="12" v-for="i in 6" :key="i">
        <v-skeleton-loader type="paragraph" />
      </v-col>
    </v-row>

    <!-- Verses -->
    <v-row v-else>
      {{ ayahs.length }}
      <v-col cols="12">
        <div v-for="(item, index) in ayahs" :key="index" class="verse-block">
          <section class="verse-text">
            <span class="ayah-number"> ﴿{{ item.surah.name }}﴾ </span>

            {{ item.text }}

            <span class="ayah-number"> ﴿{{ item.numberInSurah }}﴾ </span>
          </section>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { getPage } = usePage();

const page = ref(1);
const ayahs = ref([]);
const isLoading = ref(false);
const navDir = ref(null);

const TOTAL_PAGES = 604;

const fetchPage = async () => {
  isLoading.value = true;

  try {
    const res = await getPage(page.value);
    ayahs.value = res?.data?.ayahs || [];

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
    navDir.value = null;
  }
};

const nextPage = () => {
  if (page.value < TOTAL_PAGES) {
    navDir.value = "next";
    page.value++;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    navDir.value = "prev";
    page.value--;
  }
};

watch(page, fetchPage);

onMounted(fetchPage);

const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
  title: `Page - ${i + 1}`,
  value: i + 1,
}));
</script>

<style scoped>
.gap {
  gap: 12px;
}

.verse-block {
  margin-bottom: 2.5rem;
}

.verse-text {
  font-family: "Amiri Quran", serif;
  font-size: 2.1rem;
  line-height: 2.4;
  direction: rtl;
  text-align: right;
  color: #1b1b1b;
}

.ayah-number {
  font-size: 1rem;
  margin-inline-start: 8px;
  color: #777;
}
</style>
