<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number;
    message?: string;
  };
}>();
console.error(props.error);

const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div class="min-h-screen flex items-center justify-center text-center">
    <div>
      <h1 class="text-4xl font-bold">
        {{ props.error.statusCode || 500 }}
      </h1>

      <p class="mt-4 text-lg">
        {{ props.error.message || "Something went wrong" }}
      </p>

      <button
        class="mt-6 px-4 py-2 bg-black text-white"
        @click="handleClearError"
      >
        Go Home
      </button>
    </div>
  </div>
</template>
