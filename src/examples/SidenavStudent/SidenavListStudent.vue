<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";

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
            :navText="isRTL ? 'Cosplay' : '角色扮演'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/HospitalGuide"
            :class="getRoute() === 'HospitalGuide' ? 'active' : ''"
            :navText="isRTL ? 'HospitalGuide ' : '医院导览'"
        >
          <template v-slot:icon>
            <i
                class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/Category"
            :class="getRoute() === 'Category' ? 'active' : ''"
            :navText="isRTL ? 'Case learning' : '病例学习'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/history/:id"
            :class="getRoute() === 'history/:id' ? 'active' : ''"
            :navText="isRTL ? 'Historical learning' : '学习历史'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/my-papers-student"
            :class="getRoute() === 'my-papers-student' ? 'active' : ''"
            :navText="isRTL ? 'My test paper' : '我的试卷'"
        >
          <template v-slot:icon>
            <i class="ni ni-juanzi text-warning text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/Myexam"
            :class="getRoute() === 'Myexam' ? 'active' : ''"
            :navText="isRTL ? 'My exam' : '我的考试'"
        >
          <template v-slot:icon>
            <i class="ni ni-kaoshi text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>


      <li class="nav-item">
        <sidenav-item
            to="/profile"
            :class="getRoute() === 'profile' ? 'active' : ''"
            :navText="isRTL ? 'profile' : '个人主页'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

    </ul>
  </div>
</template>
