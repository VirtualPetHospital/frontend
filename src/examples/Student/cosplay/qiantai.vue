<template>

  <div class="py-4 container-fluid">

    <div class="row">
      <div class="col-lg-12">

        <el-card style="border-radius: 20px">
          <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
         <h3 style="margin-left: 20px">前台</h3>
        <div class="row" style='margin-top:20px'>
          <div class="col-lg-4 mb-lg">
          <el-card style="border-radius: 20px;height:350px" >
            <el-carousel indicator-position="outside" style="height:200px;width:300px;margin-top:40px">
              <el-carousel-item v-for="(index, item) in imagesForQT" :key="item">
                <el-image :src=index />
              </el-carousel-item>
            </el-carousel>
          </el-card>
          </div>
          <div class="col-lg-8">
            <el-card style="border-radius: 20px; height: 350px">
              <h4>接待与咨询</h4>
              前台员工负责接待进入医院的宠物主人和宠物，为他们提供咨询服务，包括解答关于医院服务、宠物护理、预防接种等常见问题。在紧急情况下，前台员工需要快速有效地响应，指导客户如何应对，同时通知医生和相关工作人员。
              处理来电询问，回答客户的问题，或通过电子邮件与客户交流相关信息，如预约确认、治疗提醒等。负责登记宠物及其主人的信息，包括宠物的健康记录、主人的联系方式等。同时，前台也需要确保所有数据的准确性和隐私保护。
            </el-card>
          </div>
        </div>
      
        <div class="row mt-4">
          <div class="col-lg-8">
            <el-card style="border-radius: 20px">
              <h4>协调流程</h4>
              保持等候区的整洁和舒适，确保所有等待的宠物和宠物主人感到安心。这包括维持秩序、提供必要的信息与帮助，以及确保等候区的卫生。
              前台员工常常需要与医院内的其他部门（如诊疗室、手术室、实验室）保持密切的沟通和协作，以确保信息的及时传递和服务的连贯性。
              维护和加强与客户的关系，通过定期跟踪和满意度调查来提升服务质量。有时，前台还需要处理客户投诉和解决问题，确保客户满意并愿意再次访问。
            </el-card>
          </div>
          <div class="col-lg-4 mb-lg">
            <el-card style="border-radius: 20px">
              <el-carousel indicator-position="outside"  style="height:200px;width:300px;margin-top:20px">
                <el-carousel-item v-for="(index, item) in imagesForQT2" :key="item">
                  <el-image :src=index />
                </el-carousel-item>
              </el-carousel>
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
          require('@/assets/img/qiantai/qiantai1.jpg'),
        require('@/assets/img/qiantai/qiantai2.jpg'),
        require('@/assets/img/qiantai/qiantai3.jpg'),
      ],
      imagesForQT2:[
        require('@/assets/img/qiantai/qiantai4.jpg'),
        require('@/assets/img//qiantai/qiantai5.jpg'),
        require('@/assets/img/qiantai/qiantai6.jpg'),
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
