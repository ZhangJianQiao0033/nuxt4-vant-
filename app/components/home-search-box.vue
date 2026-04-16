<!-- app/components/home-search-box.vue -->
<script setup lang="ts">
import { useCityStore } from '~/store/city'

const router = useRouter()
const cityStore = useCityStore()

function handleCityClick() {
  router.push('/city')
}
function handleLocationClick() {
  console.log('点击了获取位置')
}
</script>

<template>
  <div class="home-search-box px-20px">
    <!-- 1. 位置选择区域 -->
    <div class="location flex h-44px items-center">
      <!-- 左侧：城市名称 -->
      <div class="city text-15px text-gray-700 flex-1" @click="handleCityClick">
        {{ cityStore.currentCity.cityName }}
      </div>

      <!-- 右侧：我的位置 -->
      <div class="my-location flex items-center" @click="handleLocationClick">
        <span class="text-12px text-gray-600 mr-8px">我的位置</span>

        <van-icon name="aim" class="text-orange-400 text-20px!" />
      </div>
    </div>

    <!-- 预留接下来的：日期、价格、搜索按钮等 -->
  </div>
</template>

<style scoped>
/* 这里的橙色你可以根据设计稿微调 */
.text-orange-400 {
  color: #ff9854;
}
</style>
