<!-- app/layouts/default.vue -->
<script setup lang="ts">
// 响应式记录当前选中的标签（开启 route 模式后，主要用于初始化匹配）
const active = ref(0)
</script>

<template>
  <div class="layout-container">
    <!-- 页面内容槽 -->
    <main class="pb-50px">
      <!-- pb-50px 是为了不让内容被底部导航挡住 -->
      <slot />
    </main>

    <!-- 底部导航栏 -->
    <!-- route: 开启路由模式 -->
    <van-tabbar v-model="active" route active-color="#ff9854">
      <van-tabbar-item replace to="/" icon="home-o">
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/favor" icon="like-o">
        收藏
      </van-tabbar-item>
      <van-tabbar-item replace to="/order" icon="orders-o">
        订单
      </van-tabbar-item>
      <van-tabbar-item replace to="/message" icon="chat-o">
        消息
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
/* 确保 main 区域至少占满全屏，防止背景色断层 */
.layout-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>
