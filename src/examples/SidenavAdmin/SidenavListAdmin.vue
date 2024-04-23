<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "../Sidenav/SidenavItem.vue";
import SidenavCard from "../Sidenav/SidenavCard.vue";

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
      to="/dashboard-admin"
      :class="getRoute() === 'dashboard-admin' ? 'active' : ''"
      :navText="isRTL ? 'dashboard-admin' : '首页'"
      >
      <template v-slot:icon>
      <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
      </template>
      </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/UserManagement"
            :class="getRoute() === 'UserManagement' ? 'active' : ''"
            :navText="isRTL ? 'UserManagement' : '用户管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/CategoryManagement"
            :class="getRoute() === 'CategoryManagement' ? 'active' : ''"
            :navText="isRTL ? 'CategoryManagement' : '病种管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/DiseaseManagement"
            :class="getRoute() === 'DiseaseManagement' ? 'active' : ''"
            :navText="isRTL ? 'DiseaseManagement' : '疾病管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/MedcaseManagement"
            :class="getRoute() === 'MedcaseManagement' ? 'active' : ''"
            :navText="isRTL ? 'MedcaseManagement' : '病例管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      
      <li class="nav-item">
        <sidenav-item
            to="/InspectionManagement"
            :class="getRoute() === 'InspectionManagement' ? 'active' : ''"
            :navText="isRTL ? 'InspectionManagement' : '检查项目管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/MedicineManagement"
            :class="getRoute() === 'MedicineManagement' ? 'active' : ''"
            :navText="isRTL ? 'MedicineManagement' : '药品管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/OperationManagement"
            :class="getRoute() === 'OperationManagement' ? 'active' : ''"
            :navText="isRTL ? 'OperationManagement' : '手术管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      
      <li class="nav-item">
        <sidenav-item
            to="/RoomManagement"
            :class="getRoute() === 'RoomManagement' ? 'active' : ''"
            :navText="isRTL ? 'RoomManagement' : '科室管理'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

    
      <li class="nav-item">
        <sidenav-item
            to="/signin"
            :class="getRoute() === 'signin' ? 'active' : ''"
            :navText="isRTL ? 'signin' : '退出登录'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- <li class="nav-item">
        <sidenav-item
            to="/TTT"
            :class="getRoute() === 'RoomManagement' ? 'active' : ''"
            :navText="isRTL ? '测试' : 'test'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li> -->
      


    </ul>
  </div>

</template>
