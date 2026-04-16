<!-- app/pages/city.vue -->
<script setup lang="ts">
import { useCityStore } from '~/store/city'

const router = useRouter()
const cityStore = useCityStore()

// 1. 状态控制
const searchValue = ref('')
const activeTab = ref(0)
const isMounted = ref(false)
const showHeavyList = ref(false) // 控制长列表渲染的开关

// 2. 页面挂载后的调度逻辑
onMounted(() => {
  isMounted.value = true

  // 核心优化：利用浏览器空闲时间渲染长列表
  // 这样可以确保：1.首屏水合极其快 2.搜索框和Tab立刻能点 3.长列表随后静默加载
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      showHeavyList.value = true
    })
  }
  else {
    // 兼容性降级：延迟 200ms 渲染
    setTimeout(() => {
      showHeavyList.value = true
    }, 200)
  }
})

// 3. 页面初始化获取数据 (SSR 友好)
const { status: _status } = useAsyncData('city-data', async () => {
  await cityStore.fetchAllCitiesData()
  return true
}, { lazy: true })

// 4. 事件处理
const onCancel = () => router.back()

function handleCitySelect(city: any) {
  cityStore.currentCity = city // 更新全局选中的城市
  router.back() // 返回首页
}

// 计算当前 Tab 下的索引列表
function getIndexList(groupData: any) {
  return groupData?.cities?.map((i: any) => i.group) || []
}
</script>

<template>
  <div class="city-page bg-white min-h-screen">
    <!-- 顶部固定区域 (优先级最高，立刻渲染) -->
    <div class="bg-white left-0 right-0 top-0 fixed z-20">
      <van-search
        v-model="searchValue"
        placeholder="城市/区域/位置"
        show-action
        shape="round"
        @cancel="onCancel"
      />

      <van-tabs v-model:active="activeTab" color="#ff9854" line-width="30px">
        <van-tab :title="cityStore.allCities?.cityGroup.title" :name="0" />
        <van-tab :title="cityStore.allCities?.cityGroupOverSea.title" :name="1" />
      </van-tabs>
    </div>

    <!-- 内容滚动区域 -->
    <div class="content pt-98px">
      <!-- 遍历国内/海外数据 -->
      <template v-for="(groupData, key, index) in cityStore.allCities" :key="key">
        <!-- 优化：使用 v-if 确保不处于当前 Tab 的 DOM 不被创建 -->
        <div v-if="activeTab === index">
          <van-index-bar
            :index-list="getIndexList(groupData)"
            highlight-color="#ff9854"
            :sticky-offset-top="98"
          >
            <!-- 1. 热门城市 (量小，优先渲染) -->
            <div class="hot-section px-15px pb-10px">
              <div class="text-14px text-gray-800 font-bold py-15px">
                热门
              </div>
              <div class="flex flex-wrap gap-12px">
                <div
                  v-for="city in groupData.hotCities"
                  :key="city.cityId"
                  class="text-12px text-orange-600 rounded-14px bg-orange-50 flex h-28px w-70px items-center justify-center active:opacity-70"
                  @click="handleCitySelect(city)"
                >
                  {{ city.cityName }}
                </div>
              </div>
            </div>

            <!-- 2. 字母分组长列表 (沉重组件，空闲渲染) -->
            <template v-if="showHeavyList">
              <template v-for="item in groupData.cities" :key="item.group">
                <van-index-anchor :index="item.group" />
                <van-cell
                  v-for="city in item.cities"
                  :key="city.cityId"
                  :title="city.cityName"
                  @click="handleCitySelect(city)"
                />
              </template>
            </template>

            <!-- 3. 列表未就绪时的加载状态 -->
            <div v-else class="text-gray-400 py-50px flex flex-col items-center justify-center">
              <van-loading color="#ff9854" size="24px" />
              <span class="text-12px mt-10px">正在初始化城市...</span>
            </div>
          </van-index-bar>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 确保顶部固定栏不被索引标题穿透 */
.pt-98px {
  padding-top: 98px;
}

/* 样式微调：让索引锚点更醒目 */
:deep(.van-index-anchor) {
  background-color: #f7f8fa;
  font-weight: 700;
  color: #333;
}

/* 调整侧边栏位置，避开顶部 Tab 区域 */
:deep(.van-index-bar__sidebar) {
  z-index: 30;
  padding-top: 40px;
}

/* 修复点击单元格时的背景色 */
:deep(.van-cell:active) {
  background-color: #f2f3f5;
}
</style>
