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
            to="/ProblemsManagement"
            :class="getRoute() === 'ProblemsManagement' ? 'active' : ''"
            :navText="isRTL ? 'ProblemsManagement' : '题库管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">

        <!-- <sidenav-item
            to="/PapersTeacher"
            :class="getRoute() === 'PapersTeacher' ? 'active' : ''"
            :navText="isRTL ? 'PapersTeacher' : '试卷管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item> -->
        <sidenav-item
    :to="{ name: '试卷管理' }"
    :class="getRoute() === '试卷管理' ? 'active' : ''"
    :navText="isRTL ? 'PapersTeacher' : '试卷管理'"
>
    <template v-slot:icon>
        <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
    </template>
</sidenav-item>
<!-- <sidenav-item
    :to="'/PapersTeacher'" 
    :class="getRoute() === '试卷管理' ? 'active' : ''"
    :navText="isRTL ? 'PapersTeacher' : '试卷管理'"
>
    <template v-slot:icon>
        <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
    </template>
</sidenav-item> -->

      </li>
      <li class="nav-item">
        <sidenav-item
    :to="{ name: '考试管理' }"
    :class="getRoute() === '考试管理' ? 'active' : ''"
    :navText="isRTL ? 'ExamsTeacher' : '考试管理'"
>
    <template v-slot:icon>
        <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
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
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
