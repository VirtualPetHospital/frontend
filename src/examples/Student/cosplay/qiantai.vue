<template>

  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="btn-group ">
          <button @click="gotocos" class="btn btn-success">返回</button>
          <button @click="gotoyizhu" class="btn btn-success">医助模式</button>
          <button @click="gotoyishi" class="btn btn-success">医师模式</button>
        </div>
        <div class="row">
          <div class="col-lg-4 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <h4 class="mt-2 text-center animation-slide-left">导览咨询服务</h4>
              <dl class="mt-1 mx-auto text-box-left" style="width: 300px;">
                <dt>3D智慧导览</dt>
                <dd><small>- 立体动态展示虚拟宠物医院科室结构、功能，能够充分展现宠物医院的实际工作流程及细节</small></dd>
                <dt>咨询服务</dt>
                <dd><small>- 服务台人员必须熟悉本院门诊各科医师的特点与专长、开展治疗项目、科室组成、医疗器械、设备等医院概况，以便能正确的引导病人。</small></dd>
                <dt>热线咨询</dt>
                <dd><small>- 解答网络线上咨询患者问题，打消患者疑虑，提供本院专家信息.预约挂号.就诊流程等服务。</small></dd>  
              </dl>     
            </div>
          </div>
          <div class="col-lg-8">
            <qtLunbo1 />
          </div>
        </div>
      
        <div class="row mt-4">
          <div class="col-lg-8">
            <qtLunbo2 />
          </div>
          <div class="col-lg-4 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2" >
              <h4 class="mt-2 text-center animation-slide-right">病历档案管理</h4>
              <dl class="mt-1 mx-auto text-box-right" style="width: 300px;">
                <dt>3D智慧导览</dt>
                <dd><small>- 立体动态展示虚拟宠物医院科室结构、功能，能够充分展现宠物医院的实际工作流程及细节</small></dd>
                <dt>咨询服务</dt>
                <dd><small>- 服务台人员必须熟悉本院门诊各科医师的特点与专长、开展治疗项目、科室组成、医疗器械、设备等医院概况，以便能正确的引导病人。</small></dd>
                <dt>热线咨询</dt>
                <dd><small>- 解答网络线上咨询患者问题，打消患者疑虑，提供本院专家信息.预约挂号.就诊流程等服务。</small></dd>
              </dl>     
            </div>
          </div>
          
        <div class="row mt-4">
          <div class="col-lg-4 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <h4 class="mt-2 text-center animation-slide-left">挂号收费服务</h4>
              <dl class="mt-1 mx-auto text-box-left" style="width: 300px;">
                <dt>人工挂号</dt>
                <dd><small>- 解答医院网络来访病人的咨询，熟悉本院医疗技术力量， 分析挂号者的需求，做好咨询及挂号等工作。</small></dd>
                <dt>收费服务</dt>
                <dd><small>- 门诊收费处负责办理门诊病员挂号和医药费收取工作。收费人员工作必须认真负责、态度和蔼、语言文明，耐心解释，不刁难，不推诿病人;熟练掌握计算机操作技术，努力提高工作效率，缩短病人等待时间。</small></dd>
                <dt>现场机器挂号</dt>
                <dd><small>- 现场机器挂号则是用自助服务机器完成挂号。</small></dd>
              </dl>     
            </div>
          </div>
          <div class="col-lg-8">
            <qtLunbo3 />
          </div>
        </div>
      
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qtLunbo1 from "../../../views/components/qtLunbo1.vue";
import qtLunbo2 from "../../../views/components/qtLunbo2.vue";
import qtLunbo3 from "../../../views/components/qtLunbo3.vue";
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";

export default {
  name: "qiantai",
  methods:{
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
    },
      gotocos(){
          this.$router.replace('/Cosplay')
      },
      gotoyizhu(){
          this.$router.replace('/yizhu')
      },
      gotoyishi(){
          this.$router.replace('/yishi')
      }
  },
  components: {
    qtLunbo1,
    qtLunbo2,
    qtLunbo3,
  },
};
</script>

<style scoped>
.text-box-left {
  animation: moveRight 1s forwards;
}

.text-box-right {
  animation: moveLeft 1s forwards;
}

.animation-slide-left {
  animation: slideLeft 1s forwards;
}

.animation-slide-right {
  animation: slideRight 1s forwards;
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0%);
  }
}

@keyframes moveRight {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0%);
  }
}

@keyframes moveLeft {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
}
.py-4 container-fluid {
  background-image: url('@/assets/img/background.jpg'); /* 替换 'your-background-image-url.jpg' 为你的背景图路径 */
  background-size: cover; /* 让背景图铺满整个容器 */
  background-position: center; /* 居中显示背景图 */
}
</style>
