

   <template>
    <div class="card card-carousel overflow-hidden h-100 p-0 position-relative">
      <div id="qtLunbo3ExampleCaptions" class="carousel slide h-100" data-bs-ride="qtLunbo1">
        <div class="carousel-inner border-radius-lg h-100">
          <div
            class="carousel-item h-100 active"
            :style="{backgroundImage: 'url(' + require('@/assets/img/passageway.jpg') + ')', backgroundSize: 'cover'}"
          >
            <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
              <div class="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3">
                <i class="ni ni-camera-compact text-dark opacity-10"></i>
              </div>
              <h5 class="text-white mb-1">挂号处</h5>
            </div>
          </div>
          <div
            class="carousel-item h-100"
            :style="{backgroundImage: 'url(' + require('@/assets/img/passageway.jpg') + ')', backgroundSize: 'cover'}"
          >
            <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
              <div class="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3">
                <i class="ni ni-bulb-61 text-dark opacity-10"></i>
              </div>
              <h5 class="text-white mb-1">门诊收费处</h5>
            </div>
          </div>
          <div
            class="carousel-item h-100"
            :style="{backgroundImage: 'url(' + require('@/assets/img/passageway.jpg') + ')', backgroundSize: 'cover'}"
          >
            <div class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5">
              <div class="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3">
                <i class="ni ni-trophy text-dark opacity-10"></i>
              </div>
              <h5 class="text-white mb-1">自助挂号机</h5>
            </div>
          </div>
        </div>
        <button
          class="carousel-control-prev w-5 me-3 position-absolute top-50 start-0 translate-middle-y"
          type="button"
          data-bs-target="#qtLunbo3ExampleCaptions"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next w-5 me-3 position-absolute top-50 end-0 translate-middle-y"
          type="button"
          data-bs-target="#qtLunbo3ExampleCaptions"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import {useStore} from "vuex";
  import {onBeforeRouteLeave} from "vue-router";

  export default {
    name: "qtLunbo3",
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
  
  