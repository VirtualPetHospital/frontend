<template>
  <div class="card card-carousel overflow-hidden h-100 p-0 position-relative">
    <button
      class="carousel-control-prev top-50 start-0 translate-middle-y w-5"
      type="button"
      data-bs-target="#yzLunbo2ExampleCaptions"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next top-50 end-0 translate-middle-y w-5"
      type="button"
      data-bs-target="#yzLunbo2ExampleCaptions"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
    <div id="yzLunbo2ExampleCaptions" class="carousel slide h-100" data-bs-ride="yzLunbo2">
      <div class="carousel-inner border-radius-lg h-100">
        <div
          class="carousel-item h-100 active"
          :style="{backgroundImage: 'url(' + require('@/assets/img/mazui1.jpg') + ')',
      backgroundSize: 'cover'}"
        >
          <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
            
            <h5 class="text-white mb-1">麻醉前评估</h5>
          
          </div>
          
        </div>
        <div
          class="carousel-item h-100"
          :style="{backgroundImage: 'url(' + require('@/assets/img/mazui2.jpg') + ')',
      backgroundSize: 'cover'}"
        >
          <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
           
            <h5 class="text-white mb-1">麻醉前用药</h5>
  
          </div>
        </div>
        <div
          class="carousel-item h-100"
          :style="{backgroundImage: 'url(' + require('@/assets/img/mazui3.jpg') + ')',
      backgroundSize: 'cover'}"
        >
          <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
           
            <h5 class="text-white mb-1">麻醉诱导</h5>
           
          </div>
        </div>
        <div
          class="carousel-item h-100"
          :style="{backgroundImage: 'url(' + require('@/assets/img/mazui4.jpg') + ')',
      backgroundSize: 'cover'}"
        >
          <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
           
            <h5 class="text-white mb-1">麻醉维持</h5>
            
          </div>
        </div>
        <div
          class="carousel-item h-100"
          :style="{backgroundImage: 'url(' + require('@/assets/img/mazui5.jpg') + ')',
      backgroundSize: 'cover'}"
        >
          <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
            <h5 class="text-white mb-1">麻醉苏醒</h5>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";

export default {
  name: "yzLunbo2",
  setup() {
    const store = useStore();

    // 在组件被挂载后，设置 showSidenavStudent 为 true
    store.commit('setShowSidenavStudent', true);
    onBeforeRouteLeave((to, from, next) => {
      // 在离开此页前关闭sidenavadmin
      store.commit('setShowSidenavStudent', false);
      next();
    });
    return {};
  }
};
</script>
