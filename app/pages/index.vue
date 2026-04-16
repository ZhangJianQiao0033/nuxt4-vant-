<!-- app/pages/index.vue -->
<script setup lang="ts">
import { useCityStore } from '~/store/city'

const cityStore = useCityStore()

// 核心优化：在首页挂载后，趁用户还在看 Banner 时，悄悄把城市数据拿回来
onMounted(() => {
  // 即使现在不进城市页，也先把接口调了，存进 Pinia
  cityStore.fetchAllCitiesData()
})
</script>

<template>
  <div class="home-page">
    <HomeBanner />

    <HomeSearchBox />
  </div>
</template>
