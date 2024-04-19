<script setup>
import { useStore } from "vuex";
const store = useStore();
</script>
<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div
            class="text-sm text-center copyright text-muted"
            :class="store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
            ©
            {{ new Date().getFullYear() }}
            <i class="fa fa-heart"></i> 来自
            <a
              href="https://github.com/VirtualPetHospital"
              class="font-weight-bold"
              target="_blank"
              >VPH</a
            >
            为了更先进的宠物医疗
          </div>
        </div>
        <div class="col-lg-6">
          <ul
            class="nav nav-footer justify-content-center justify-content-lg-end"
          >
            <li class="nav-item">
              <a
                href="https://github.com/VirtualPetHospital"
                class="nav-link text-muted"
                target="_blank"
                >VPH</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://github.com/VirtualPetHospital"
                class="nav-link text-muted"
                target="_blank"
                >关于我们</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://github.com/VirtualPetHospital"
                class="nav-link text-muted"
                target="_blank"
                >Blog</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
