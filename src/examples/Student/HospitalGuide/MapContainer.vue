<template>
  <div id="map-container">{{ mapID }}</div>
</template>

<script setup>
import { getCurrentInstance, onUnmounted, ref } from "vue-demi";
import MapApplication from "../utils/MapApplication";

let mapID = ref("test666");

const instance = getCurrentInstance();
const _this = instance.appContext.config.globalProperties;

// 初始化场景
MapApplication.initMap(_this);

// 销毁场景
onUnmounted(() => {
  MapApplication.destroyMap();
});
</script>

<style lang="scss" scoped>
html,
body,
#map-container {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
