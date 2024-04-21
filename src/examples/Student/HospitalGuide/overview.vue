<script setup>
import { default as mapApp } from "./utils/init";
import { ref, onMounted } from "vue";

let clickShadeSign = ref(true);

onMounted(() => {
  // 初始化地图
  mapApp.initMap();
  window.mapApp = mapApp; // 测试环境中开发此对象方便调试，生产环境可以注释

  mapApp.clickShadeSign = clickShadeSign;
});
</script>



<style scoped>
.container {
  width: 100%;
  height: 100%;

  .clickShade {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    cursor: wait;
  }

  #map-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.loading_shade {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.8);
}

.triangle {
  animation: grow-and-fade 2000ms linear infinite;
  height: 150px;
  left: 0;
  opacity: 0;
  width: 150px;
  position: absolute;
  top: 0;
  transform: translatez(0);
  transform-origin: 50% 60%;
  will-change: opacity, transform;
}

.triangle-wrapper {
  height: 150px;
  position: relative;
  width: 150px;
  margin: 0 auto;
  top: 40%;
}
.triangle-loading {
  color: white;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 300;
  left: 50%;
  letter-spacing: 2px;
  opacity: 0.8;
  position: absolute;
  top: 100%;
  transform: translate3d(-50%, -50%, 0);
}

.triangle-svg {
  margin-top: -20px;
  opacity: 0.5;
  overflow: visible;
}

.triangle-polygon {
  stroke-width: 5px;
}

.triangle-1 {
  animation-delay: 0ms;
}

.triangle-1 .triangle-polygon {
  stroke: hotpink;
}

.triangle-2 {
  animation-delay: 400ms;
}

.triangle-2 .triangle-polygon {
  stroke: aqua;
}

.triangle-3 {
  animation-delay: 800ms;
}

.triangle-3 .triangle-polygon {
  stroke: cornflowerblue;
}

.triangle-4 {
  animation-delay: 1200ms;
}

.triangle-4 .triangle-polygon {
  stroke: yellow;
}

.triangle-5 {
  animation-delay: 1600ms;
}

.triangle-5 .triangle-polygon {
  stroke: white;
}

@keyframes grow-and-fade {
  0% {
    opacity: 0;
    transform: scale(0.1) translatez(0);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1) translatez(0);
  }
}
@keyframes pulsing-fade {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 0;
  }

  40% {
    opacity: 0.8;
  }

  60% {
    opacity: 0;
  }
}
</style>