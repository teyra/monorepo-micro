<template>
  <a-button :type><slot></slot></a-button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: "primary",
  },
});
</script>
