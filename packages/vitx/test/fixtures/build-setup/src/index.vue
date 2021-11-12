<template>
  <section>{{ obj }}</section>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
onMounted(() => {
  console.log('hello vitx!')
})

const count = ref(0)
const obj = reactive({
  count
})
</script>

<style>
</style>
