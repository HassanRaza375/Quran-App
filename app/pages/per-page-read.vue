<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" sm="6">
        <v-autocomplete
          label="Pages"
          :items="[
            'California',
            'Colorado',
            'Florida',
            'Georgia',
            'Texas',
            'Wyoming',
          ]"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12">
        <v-skeleton-loader v-if="pending" type="paragraph" />
        <div v-else>{{ data.data.ayahs }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { getPage } = usePage();
const { data, pending } = useAsyncData("surahs", () => getPage(1));
console.log(data);
</script>

<style scoped></style>
