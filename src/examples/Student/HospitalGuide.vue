<template>
    <div class="py-4 container-fluid">
      <div class=" row">
        <div class="col-12">
          <hospital-guide-card />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HospitalGuideCard from "../../views/components/HospitalGuideCard.vue";
  import {useStore} from "vuex";
  import {onBeforeRouteLeave} from "vue-router";
  
  export default {
    name: "HospitalGuide",
    components: {
      HospitalGuideCard
    },
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
  