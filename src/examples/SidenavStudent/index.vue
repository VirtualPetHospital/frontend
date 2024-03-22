<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import logo from "@/assets/img/logo-ct-dark.png";
import logoWhite from "@/assets/img/logo-ct.png";
import SidenavListStudent from "@/examples/SidenavStudent/SidenavListStudent.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);

</script>
<template>
  <div
      v-show="layout === 'default'"
      class="min-height-300 position-absolute w-100"
      :class="`${darkMode ? 'bg-transparent' : 'background-container'}`"
  >
  </div>



  <aside
      class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
      :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'me-3 rotate-caret fixed-end'}
      ${
        layout === 'landing' ? 'bg-transparent shadow-none' : '  '
      } ${sidebarType}`"
      id="sidenavStudent-main"
  >
    <div class="sidenav-header">
      <i
          class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
      ></i>

      <router-link class="m-0 navbar-brand" to="/">
        <img
            :src="darkMode || sidebarType === 'bg-default' ? logoWhite : logo"
            class="navbar-brand-img h-100"
            alt="main_logo"
        />

        <span class="ms-2 font-weight-bold me-2">虚拟宠物医院学习系统</span>
      </router-link>
    </div>

    <hr class="mt-0 horizontal dark" />

    <sidenav-list-student />
  </aside>
</template>
<style>
.background-container {
  background-image: url('../../assets/img/background.jpg');
  background-size: cover; /* 背景图片将被缩放以填充整个容器 */
  background-position: center; /* 背景图片在容器中居中显示 */
  height: 300px; /* 背景容器的高度 */
}
</style>