<template>

  <div class="py-4 container-fluid">

    <div class="row">

      <div class="col-lg-12">
        <el-card style="border-radius: 20px">

          <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
          <h3 style="margin-left:20px">医师</h3>
          <div class="row" style='margin-top:20px'>
            <div class="col-lg-6 mb-lg">
              <el-card style="border-radius: 20px;height:350px" >
                <el-carousel indicator-position="outside" style="height: 250px;width:370px;margin-top: 30px;margin-left:60px">
                  <el-carousel-item v-for="(index, item) in imagesForQT" :key="item">
                    <el-image :src=index />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </div>
            <div class="col-lg-6">
              <el-card style="border-radius: 20px; height: 350px">
                <h4>诊断与治疗</h4>
                医师需要对宠物进行全面的体检，诊断其健康问题，并根据诊断结果制定治疗计划。这包括开处方药、进行外科手术、提供紧急治疗等。
                医师负责正确开具处方，并指导宠物主人如何安全地给予宠物服药。他们还需要管理药物库存和确保药物使用的合规性。
                在宠物出现紧急情况时，医师需要提供迅速的医疗响应，这可能包括在非常规工作时间内工作。
              </el-card>
            </div>
          </div>

          <div class="row mt-4" style="margin-top:20px">
            <div class="col-lg-6">
              <el-card style="border-radius: 20px">
                <h4>实施手术与疾病预防</h4>
                医师需进行各种手术，包括绝育手术、紧急手术等，以治疗特定的健康问题或伤害。<br>
                医师负责为宠物提供定期的疫苗接种和健康检查，以预防各种疾病。此外，他们还会提供关于宠物饲养、营养和行为管理的建议，帮助预防可能的健康问题。<br>
                医师需与医院内的其他职员（如护士、前台、手术室工作人员）协作，确保医疗服务的高效与顺畅。同时，他们也可能需要与外部的专家或其他医疗机构合作，以获取特殊疾病的咨询或转诊。<br>
              </el-card>
            </div>
            <div class="col-lg-6 mb-lg">
              <el-card style="border-radius: 20px;height:350px">
                <el-carousel indicator-position="outside" style="height: 230px;margin-top: 30px;margin-left:80px;width:370px">
                  <el-carousel-item v-for="(index, item) in imagesForQT2" :key="item">
                    <el-image :src=index />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </div>

          </div>
          <div class="row mt-4">
            <div class="col-lg-6 mb-lg">
              <el-card style="border-radius: 20px;height:350px">
                <el-carousel indicator-position="outside" style="height: 230px;margin-top: 40px;width:400px;margin-left:50px">
                  <el-carousel-item v-for="(index, item) in imagesForQT3" :key="item">
                    <el-image :src=index />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </div>
            <div class="col-lg-6">
              <el-card style="border-radius: 20px; height: 350px">
                <h4>持续教育和专业发展</h4>
                医师需要持续学习最新的医疗知识和技术，参加专业培训和研讨会，以保持其专业能力的前沿性。
                宠物医院医师的职责不仅仅局限于医疗技术，还包括与宠物主人的沟通与教育，这有助于提升宠物的整体健康和生活质量。他们的专业技能、同情心和责任心是确保宠物及其主人满意度的关键。
                参加研讨会和会议：全国或国际性的兽医会议和研讨会是医师获取最新医疗信息和技术的重要渠道。
                在线课程和网络研讨会：随着技术的发展，许多教育平台和专业组织提供在线课程和网络研讨会，使医师能够在不离开工作岗位的情况下学习新知识。这些课程通常包括视频讲座、实时互动讨论和考试。
                学术研究和发表：参与科学研究并将研究成果发表在同行评审的期刊上，不仅可以提高医师的专业知识，也有助于兽医学科的发展。
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
        require('@/assets/img/yishi/yishi1.jpg'),
        require('@/assets/img/yishi/yishi2.jpg'),
        require('@/assets/img/yishi/yishi3.jpg'),
      ],
      imagesForQT2:[
        require('@/assets/img/yishi/yishi4.jpg'),
        require('@/assets/img/yishi/yishi5.jpg'),
        require('@/assets/img/yishi/yishi6.jpg'),
      ],
      imagesForQT3:[
        require('@/assets/img//yishi/yishi7.jpg'),
        require('@/assets/img/yishi/yishi8.jpg'),
        require('@/assets/img/yishi/yishi9.jpg'),
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
      this.$router.back();
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
