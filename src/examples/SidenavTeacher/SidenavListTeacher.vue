<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "../Sidenav/SidenavItem.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
      class="collapse navbar-collapse w-auto h-auto h-100"
      id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
            to="/Cosplay"
            :class="getRoute() === 'Cosplay' ? 'active' : ''"
            :navText="isRTL ? 'Cosplay' : '我的试卷'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">

        <sidenav-item
            to="/Cosplay"
            :class="getRoute() === 'Cosplay' ? 'active' : ''"
            :navText="isRTL ? 'Cosplay' : '我的考试'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/Cosplay"
            :class="getRoute() === 'Cosplay' ? 'active' : ''"
            :navText="isRTL ? 'Cosplay' : '新增问题'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
