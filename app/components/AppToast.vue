<template>
    <v-snackbar v-model="show" :color="color" :timeout="timeout" location="top right" elevation="6">
        {{ message }}
        <template #actions>
            <v-btn icon="mdi-close" @click="show = false" />
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
const { show, message, color, timeout } = useToast()
</script>
