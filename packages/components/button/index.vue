<template>
  <el-button :type><slot></slot></el-button>
</template>

<script setup lang="ts">
import { type ButtonType } from 'element-plus'
withDefaults(defineProps<{ type: ButtonType }>(), {
  type: 'primary',
})
</script>
