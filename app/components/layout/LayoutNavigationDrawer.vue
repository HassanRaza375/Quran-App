<template>
  <v-navigation-drawer app>
    <v-list>
      <v-list-item @click="goto('/')" title="Home" prepend-icon="mdi-home" />
      <v-list-item
        @click="goto('/search')"
        title="Search"
        prepend-icon="mdi-magnify"
      />
      <v-list-item
        @click="goto('/bookmarks')"
        title="Bookmarks"
        prepend-icon="mdi-bookmark"
      />
      <v-list-item
        @click="goto('/settings')"
        title="Settings"
        prepend-icon="mdi-cog"
      />
      <v-list-item
        @click="goto('/about')"
        title="About"
        prepend-icon="mdi-information"
      />
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
const router = useRouter();
const goto = (path) => {
  router.push(path);
};
</script>
