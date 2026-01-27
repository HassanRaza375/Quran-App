<template lang="">
  <v-container class="py-4">
    <v-row dense>
      <v-col cols="12"> Quran Juz </v-col>
      <v-col cols="12">
        <v-card class="mx-auto pa-4" outlined>
          <v-chip
            color="green"
            class="ma-2"
            v-for="n in 30"
            :key="n"
            :title="'Item ' + n"
            @click="goto(`/juz/${n}`)"
          >
            Juz# {{ n }}
          </v-chip>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const router = useRouter();
const goto = (path) => {
  router.push(path);
};
</script>
<style scoped></style>
