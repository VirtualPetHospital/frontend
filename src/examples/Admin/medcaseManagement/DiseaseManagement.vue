<template>
    <div class="py-4 container sectionHeight">
      <div class="row">
        <div class="col-12">
          <div class="user-management-container">
            <div class="role-play-title">疾病管理</div>
            <DiseaseManagementCard />
          </div>
          
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DiseaseManagementCard from "../../../views/components/DiseaseManagementCard.vue";
  import { useStore } from "vuex";
  import { onBeforeRouteLeave } from "vue-router";
  
  export default {
    name: "Cosplay",
    components: {
        DiseaseManagementCard,
    },
    setup() {
      const store = useStore();
  
      // 在组件被挂载后，设置 showSidenavAdmin 为 true
      store.commit("setShowSidenavAdmin", true);
      onBeforeRouteLeave((to, from, next) => {
        // 在离开此页前关闭sidenavadmin
        store.commit("setShowSidenavAdmin", false);
        next();
      });
      return {};
    },
  };
  </script>
  
  <style scoped>
  .container.sectionHeight {
    background-color: white; /* 设置背景色为白色 */
    border-radius: 20px;
    margin-left: 10px;
    padding: 20px;
    padding-bottom: 20px;
  }
  
  .user-management-container {
    width: 100%; /* 设置容器宽度为100% */
  }
  
  .role-play-title {
    font-size: 36px;
    font-weight: bold;
    color: black;
    margin-bottom: 20px; /* 添加一些底部间距 */
  }
  
  /* 修改表格样式 */
  .user-table {
    max-width: 100%; /* 设置表格最大宽度为容器的100% */
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 20px;
  }
  </style>
  