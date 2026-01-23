<template lang="">
  <v-container class="py-4">
    <v-row dense>
      <v-col cols="12"> Quran Juz </v-col>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="300">
          <v-list>
            <v-list-item
              v-for="n in 3"
              :key="n"
              :title="'Item ' + n"
              @click="goto(`/juz/${n}`)"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
            ></v-list-item>
          </v-list>
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
