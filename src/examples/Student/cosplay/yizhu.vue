<template>

  <div class="py-4 container-fluid">

    <div class="row">
      <div class="col-lg-12">
        <el-card style="border-radius: 20px">
          <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
          <h3 style="margin-left: 20px">医助</h3>
          <div class="row" style='margin-top:20px'>
            <div class="col-lg-5 mb-lg">
              <el-card style="border-radius: 20px;height:350px" >
                <el-carousel indicator-position="outside" style="height:235px;width:330px;margin-top:30px;margin-left:30px">
                  <el-carousel-item v-for="(index, item) in imagesForQT" :key="item">
                    <el-image :src=index />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </div>
            <div class="col-lg-7">
              <el-card style="border-radius: 20px; height: 350px">
                <h4>临床协助与患者护理</h4>
                协助兽医在体检、治疗和手术过程中进行操作，如准备手术器材、持器和帮助固定宠物等。
                提供基础的护理，包括喂食、给药、清洁和舒适的住宿环境以及监测宠物的生命体征。
                负责收集血液、尿液、粪便等样本，并进行一些基础的实验室测试，如血液学检查、尿液分析等。
              </el-card>
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-lg-7">
              <el-card style="border-radius: 20px">
                <h4>设备和环境维护</h4>
                负责清洁和消毒医疗工具、手术台和治疗区，确保环境卫生和防止交叉感染。定期检查所有医疗器械，如X光机、超声设备、麻醉机等，确保它们处于良好的工作状态。
                确保所有电线和电源插座安全，避免宠物和工作人员的意外触电。设置紧急出口和安全标识，确保所有员工都知晓应急逃生路线和程序。
                安装和维护火灾报警系统和灭火器。确保所有物资、药品和消耗品按照推荐条件存放，避免过期或变质。
              </el-card>
            </div>
            <div class="col-lg-5 mb-lg">
              <el-card style="border-radius: 20px;height:300px">
                <el-carousel indicator-position="outside" style="height:220px;width:330px;margin-top:20px;margin-left:30px">
                  <el-carousel-item v-for="(index, item) in imagesForQT2" :key="item">
                    <el-image :src=index />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </div>

          </div>
          <div class="row mt-4">
            <div class="col-lg-5 mb-lg">
              <el-card style="border-radius: 20px">
                <el-carousel indicator-position="outside" style="height:300px">
                  <el-carousel-item v-for="(index, item) in imagesForQT3" :key="item" style="height:210px;width:300px;margin-top:40px;margin-left:40px" >
                    <el-image :src=index />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </div>
            <div class="col-lg-7">
              <el-card style="border-radius: 20px; height: 350px">
                <h4>手术准备和监控</h4>
                在手术过程中准备所需的器械、药品和其他物资，并监控宠物的麻醉和生命体征。
                准备手术台，包括铺设干净的手术巾和确保手术灯功能正常。检查所有手术设备，如麻醉机、监控设备和手术工具，确保它们工作正常。
                准备必要的手术消耗品，如手术线、缝合针、纱布和消毒液。监控动物的心率、血压、呼吸频率和体温，确保麻醉的稳定性。
                观察动物的反应，调整麻醉剂量以维持适当的麻醉深度。根据兽医的指示，协助进行手术操作，如递交手术器械、调整手术灯或管理手术场地。
              </el-card>
            </div>

          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {ElCard,ElCarousel, ElCarouselItem,ElImage} from "element-plus";

export default {
  name: "qiantai",
  data(){
    return{
      imagesForQT:[
        require('@/assets/img/yizhu/yizhu1.jpg'),
        require('@/assets/img/yizhu/yizhu3.jpg'),
      ],
      imagesForQT2:[
        require('@/assets/img/yizhu/yizhu4.jpg'),
        require('@/assets/img/yizhu/yizhu5.jpg'),
        require('@/assets/img/yizhu/yizhu6.jpg'),
      ],
      imagesForQT3:[
        require('@/assets/img/yizhu/yizhu7.jpg'),
        require('@/assets/img/yizhu/yizhu8.jpg'),
        require('@/assets/img/yizhu/yizhu9.jpg'),
      ],


    }
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
  },
  methods:{
    backto(){
      this.$router.go(-1);
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
    ElCard,
    ElCarousel,
    ElCarouselItem,
    ElImage
  },
};
</script>

<style scoped>
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
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
