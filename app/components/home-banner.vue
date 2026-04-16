<!-- app/components/home-banner.vue -->
<template>
  <div class="home-banner">
    <!-- 顶部标题 -->
    <div class="flex h-46px items-center justify-center">
      <h1 class="text-18px text-orange-500 font-700">
        逸尘旅途
      </h1>
    </div>

    <!-- Banner 图片 -->
    <div class="w-full relative overflow-hidden">
      <img
        src="~/assets/img/home/banner.webp"
        class="h-auto w-full block"
        alt="banner"
      >
      <!-- 如果图片里没字，可以在这里用 UnoCSS 定位写上 -->
    </div>
  </div>
</template>

<style scoped>
.text-orange-500 {
  color: #ff9854;
}
</style>
