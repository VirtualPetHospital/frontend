<template>
    <div class="card p-4" >
     <div class=" row">
         <div class="col-12">
           <div class="role-play-title">角色扮演</div>
             <cos-card />
         </div>
     </div>
     </div>
 </template>
 <script>
 import CosCard from "../../../views/components/CosCard.vue";
 import {useStore} from "vuex";
 import {onBeforeRouteLeave} from "vue-router";
 export default{
     name:"Cosplay",
     components:{
         CosCard
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

<style scoped>
.role-play-title {
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 36px;
  font-weight: bold;
  color: black;
}
.card p-4{
  margin-left: 5px;
}
</style>
 