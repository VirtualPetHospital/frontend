<template>
  <div class="card p-4">
  <div style="position:relative; height: 100%;">
    <div id="viewer" style="position:absolute;top:8%; left:2%; width:80%; height: 200%;"></div>
    <div style = "z-index:10;position:absolute;bottom:18%;left:12.5%;"></div>
    <div class="trapezoid" style="position:absolute;top:11%;left:2%;z-index:5555 " id="name"><h2 style="color: white; text-align: center;">{{ this.room }}</h2></div>
    <router-link to="/HospitalGuide">
      <div class="trapezoid" style="position:absolute;top:11%;right:3%;z-index:5555"><h3 style="color: white; text-align: center;">退出</h3></div>
    </router-link>
    <div id = "show" style="z-index:55; position:absolute;bottom:18%;right:3%">
      <div class="card " style="background-color: #b3d4fc">
        <div class="row">

          <div class="col-6 text-start">
            <argon-button variant="gradient">
              {{ this.item }}
            </argon-button>
          </div>
        </div>
        <div class="card-body p-4">
          <div class="row">
            <div class="col-4 ">
              <div
                  class="card card-body border card-plain border-radius-lg d-flex align-items-center flex-row" style="background-color: #b3d4fc" v-on:click="toggleFunc()">
                <h5 class="mb-0 text-white">功能说明</h5>
              </div>
            </div>

            <div class="col-4">
              <div
                  class="card  card-body border card-plain border-radius-lg d-flex align-items-center flex-row" style="background-color: #b3d4fc" v-on:click="toggleOperator()">
                <h5 class="mb-0 text-white">操作流程</h5>
              </div>
            </div>

            <div class="col-4">
              <div
                  class="card card-body border card-plain border-radius-lg d-flex align-items-center flex-row" style="background-color: #b3d4fc" v-on:click="toggleVideo()">
                <h5 class="mb-0 text-white">演示动画</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id = "show-video" style="display: inline-block;  position:absolute;left:5%; top:25%;z-index: 5555; max-height:50%;"  class="card  bg-gradient-dark move-on-hover align-items-start mt-4 col-lg-4 col-md-4 mt-sm-0">
      <div class="card-body">
        <h5 class="mb-0 text-black">演示动画</h5>
        <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"/>
      </div>


    </div>

    <div id = "show-card" class="card  bg-gradient-dark move-on-hover align-items-start mt-4 col-lg-4 col-md-4 mt-sm-0" style="z-index:55; position:absolute;left:5%; top:25%;
  max-height:50%; overflow-y: scroll;" >
      <div class="card-body">
        <h5 class="mb-0 text-black">{{ this.cardTitle }}</h5>
        <p class="text-sm text-black">{{ this.cardContent }}</p>
        <div class="mt-5 d-flex">
        </div>
      </div>
    </div>
    <div id = "show-photo" class="card  bg-gradient-dark move-on-hover align-items-start mt-4 col-lg-4 col-md-4 mt-sm-0" style="z-index:55; position:absolute;left:5%; top:25%;
  max-height:50%; overflow-y: scroll;" >
      <div class="card-body">
        <h5 class="mb-0 text-black">操作流程</h5>
        <el-image :src="this.operator">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </div>
  </div>
  </div>


</template>
<script>
import {Viewer} from 'photo-sphere-viewer'
import MarkersPlugin from 'photo-sphere-viewer/dist/plugins/markers'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import 'photo-sphere-viewer/dist/plugins/markers.css';
import ArgonButton from "@/components/ArgonButton.vue";
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {videoPlayer} from "vue-video-player";
import axios from "axios";
import {ElImage} from "element-plus";
export default {
  components: {
    videoPlayer,
    ArgonButton,
    ElImage
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
  data(){
    return{
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false,  // 如果为true,浏览器准备好时开始回放
        muted: false,     // 默认情况下将会消除任何音频。
        loop: false,      // 是否视频一结束就重新开始。
        preload: 'auto',  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9',  // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true,  // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4",  // 类型
          src: ""           // url地址
        }],
        poster: '',  // 封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试',  // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,           // 当前时间和持续时间的分隔符
          durationDisplay: true,       // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true       // 是否显示全屏按钮
        }
      },
      viewer:'',
      markersPlugin: '',
      room:'',
      doctor:'',
      item:'手术操作台',
      image: require('@/assets/image/arrow.png'),
      rooms: ["免疫室", "化验室", "档案室","诊室","处置室","手术室","病例剖检室","药房","手术准备室","专科检查室","影像室","注射室","前台","住院部"],
      doctors: ["助理 兽医", "助理 兽医", "前台","兽医","助理 兽医","兽医","兽医","助理 兽医","助理 兽医","兽医","助理 兽医","助理 兽医","前台","住院兽医或助理兽医"],
      show:'',
      showVideo:'',
      cardTitle:'aa',
      cardContent:'',
      showCard:'',
      showCard2:'',
      func:"bbb",
      operator:"aaa",
      video:"https://www.w3school.com.cn/example/html5/mov_bbb.mp4",
      imageArr: [
        {//免疫室
          img: require('@/assets/img/research.jpg'),
        },
        {//化验
          img: require('@/assets/img/check.jpg'),
        },
        {//档案室
          img: require('@/assets/img/archives.jpg'),
        },
        {//诊室
          img: require('@/assets/img/clinic.jpg'),
        },
        {//处置
          img: require('@/assets/img/surgery.jpg'),
        },
        {//手术
          img: require('@/assets/img/operation.jpg'),
        },
        {//病例刨析室
          img: require('@/assets/img/research.jpg'),
        },
        {//药房
          img: require('@/assets/img/medicine.jpg'),
        },
        {//手术准备
          img: require('@/assets/img/precheck.jpg'),
        },
        {//专科检查
          img: require('@/assets/img/checkroom.jpg'),
        },
        {//影像
          img: require('@/assets/img/xrayroom.jpg'),
        },
        {//注射
          img: require('@/assets/img/injection.jpg'),
        },
        {//前台
          img: require('@/assets/img/reception.png'),
        },
        {//住院部
          img: require('@/assets/img/hospitalization.jpg'),
        },

      ],
      index: this.$route.query.index - 1,
      dataList: [
        {
          //0
          markers: [
            {
              id:'toHuayanshi',
              tooltip:'化验室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 2.4,
              latitude: -0.31179146502439625,
              anchor: 'center right',
              jump: true,
              target: 1,
              angle: -45,
            },
            {
              id:'清洗槽',
              html: '<div class="bubble">清洗槽</div>',
              longitude:0.3368927313172293,
              latitude: -0.1478313488770011,
              anchor: 'center right',
              jump: false,
              asset_id:1,
              video: 'https://www.w3school.com.cn/example/html5/mov_bbb.mp4',
              func:'清洗器械：清洗槽可以通过水流和洗涤剂的作用，将医疗器械和设备表面的污垢和污染物去除，确保其在下一次使用前处于洁净的状态。这有助于防止交叉感染和保护患者的安全。去除血液和组织残留：手术后的器械可能附着有血液、组织残留等生物负荷，清洗槽能够有效去除这些生物负荷，避免其在器械上积聚和滋生细菌。减少污染：清洗槽通常配备有过滤系统和循环水处理设备，能够有效地过滤和去除清洗过程中产生的污染物，确保清洗过程中的水质清洁。提高效率：清洗槽通常具有多个清洗区域和自动化的清洗循环，可以提高清洗效率，减少人工清洗的工作量，提高医疗器械和设备的清洗质量。增强安全性：清洗槽通常具有安全措施，如温度控制、超声波清洗等，可以确保清洗过程中不会对医护人员和环境造成伤害。',
              operator: '准备工作：确保清洗槽和相关设备已经连接好并处于正常工作状态。检查清洗槽内是否有足够的洗涤剂和水，并按照清洗槽制造商的建议设置正确的清洗参数，如温度、时间、水流速度等。器械准备：将待清洗的医疗器械放置在清洗槽内，根据器械类型和清洗槽的容量进行合理排列，避免器械之间的重叠和交叉。如有需要，可以在清洗槽中放置器械篮、器械网篮等辅助装置，以便于清洗和保护器械。洗涤操作：启动清洗槽，按照预设的清洗参数进行洗涤操作。通常包括水流冲洗、洗涤剂注入、超声波清洗等步骤。确保清洗液充分覆盖器械表面，使洗涤剂能够彻底清洗器械的所有部位。清洗结束：根据预设的清洗时间，清洗槽会自动停止。此时，关闭清洗槽，并取出清洗完成的器械。注意使用安全防护措施，避免烫伤和受到器械的尖锐边缘伤害。检查和验收：检查器械表面是否干净，无残留物。如有需要，可以使用清水进行最终冲洗，确保器械干净无污染。验收合格的器械可以送往下一步的消毒或灭菌处理，或者直接使用。',
            },
            {
              id:'展览台',
              html: '<div class="bubble">展览台</div>',
              longitude: 4.730593408331794,
              latitude:  0.0014482872080976428,
              anchor: 'center right',
              asset_id:2,
              jump: false,
              video: 'https://www.w3school.com.cn/example/html5/mov_bbb.mp4',
              func:'展览台通常会配备展示信息的展示板、展示屏、标签等，用于介绍展品的相关信息，如展品的名称、作者、历史背景、科学原理、文化内涵等。这些信息可以帮助观众更好地理解展品的意义和价值，加深对展览主题的认知。',
              operator: '观众可以通过展览台近距离观赏展品。可以通过触摸、视觉等方式来欣赏展品的外观、细节和特点。观众可以根据展示台的设计，自行决定观看展品的角度、距离和方式，从而更好地了解展品。',
            }

          ],
        },
        {
          //1
          markers: [
            {
              id:'toDangAnShi',
              tooltip:'档案室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 0.5,
              latitude: -0.5952505913905668,
              anchor: 'center right',
              jump: true,

              target: 2,
              angle: -45,
            },
            {
              id:'水槽',
              html: '<div class="bubble">水槽</div>',
              longitude: 1,
              latitude:  -0.2,
              anchor: 'center right',
              jump: false,
              asset_id:3,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'演示厅是一种专门用于展示产品、服务、项目或理念的场所。企业、组织或个人可以在演示厅中展示他们的产品、技术或业务，以向客户、合作伙伴或投资者展示其优势和特点。演示厅通常配备了展示设施，如展示柜、展示板、投影设备、音响系统等，以便进行生动、直观的演示和展示。',
              operator: '根据演示或展示的内容，确定活动的需求，包括活动的日期、时间、时长、预计参与人数等。同时，还需要了解演示厅的规模、设施、设备和其他资源情况，确保演示厅能够满足活动需求。',
            },
            {
              id:'离心机',
              html: '<div class="bubble">离心机</div>',
              longitude: 5,
              latitude:  -0.2,
              anchor: 'center right',
              jump: false,
              asset_id:4,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'演示厅是一种专门用于展示产品、服务、项目或理念的场所。企业、组织或个人可以在演示厅中展示他们的产品、技术或业务，以向客户、合作伙伴或投资者展示其优势和特点。演示厅通常配备了展示设施，如展示柜、展示板、投影设备、音响系统等，以便进行生动、直观的演示和展示。',
              operator: '根据演示或展示的内容，确定活动的需求，包括活动的日期、时间、时长、预计参与人数等。同时，还需要了解演示厅的规模、设施、设备和其他资源情况，确保演示厅能够满足活动需求。',
            }

          ],
        },
        {
          //2
          markers: [
            {
              id:'toZhenShi',
              tooltip:'诊室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 4.9,
              latitude: -0.5,
              anchor: 'center right',
              jump: true,
              target: 3,
              angle: -45,
            },
            {
              id:'档案存放柜',
              html: '<div class="bubble">档案存放柜</div>',
              longitude: 5.8,
              latitude: 0.0014482872080976428,
              anchor: 'center right',
              jump: false,
              asset_id:5,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'档案存放柜的主要功能是提供文件储存空间。它们通常具有多个抽屉或架子，可以容纳文件夹、文件和其他办公资料，并保持其整洁有序。',
              operator: '文件归档：将文件放入正确的抽屉、架子或位置，并确保它们整洁有序。文件标识：使用标签、标签架等工具，对文件进行分类和标识，以便快速找到需要的文件。文件保护：根据需要使用柜子的锁定功能，确保文件的安全和保密性。',
            },

          ],
        },
        {
          //3
          markers: [
            {
              id:'toYaoFang',
              tooltip:'药房',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 0.6,
              latitude: -0.5,
              anchor: 'center right',
              jump: true,
              target: 7,
              angle: -45,
            },
            {
              id:'治疗台',
              html: '<div class="bubble">治疗台</div>',
              longitude: 0.1,
              latitude: 0.0015,
              anchor: 'center right',
              jump: false,
              asset_id:6,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'治疗台是医疗机构或诊所中用于诊断、治疗和护理患者的专用台床。它通常具有多种功能和配置，以满足医疗专业人员在进行诊断和治疗时的需求。',
              operator: '些治疗台还配备了可调节的床面高度，以方便医生或护士在不同高度的情况下进行诊断和治疗。治疗功能：治疗台通常具有多种功能，例如可以调整头部、腿部和背部的角度，以适应不同类型的治疗需求，如检查、诊断、物理疗法、针灸等。配件和设备：治疗台通常配备了各种配件和设备，例如轮椅滑道、侧扶手、可移动的扶手、脚踏板等，以便医疗专业人员在进行治疗时更加方便和安全。',
            },
            {
              id:'洗漱台',
              html: '<div class="bubble">洗漱台</div>',
              longitude: 8.3,
              latitude:  -0.1478313488770011,
              anchor: 'center right',
              jump: false,
              asset_id:7,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'洗漱台通常配备了水龙头或水龙头混合器，用于供应冷热水。用户可以通过旋转或拉动水龙头来控制水流的流量和温度。',
              operator: '打开水龙头，调节水流的流量和温度，确保合适的水温和水量。使用洗涤用品，如牙刷、牙膏、肥皂等，进行洗漱或刷牙。使用洗漱台上的储物空间，将个人洗漱用品放置整齐，以便使用时方便取用。使用洗漱台上的镜子，进行自我观察和整理。使用洗漱台上的水槽，将洗涤时产生的废水排放到下水道。',
            }

          ],
        },
        {
          //4
          markers: [
            {
              id:'toShoushuzhunbeishi',
              tooltip:'手术准备室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude:7,
              latitude: -0.6,
              anchor: 'center right',
              jump: true,
              target: 8,
              angle: -45,
            },
            {
              id:'处置台',
              html: '<div class="bubble">处置台</div>',
              longitude:5,
              latitude:  -0.3,
              anchor: 'center right',
              jump: false,
              asset_id:8,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'处置台是医疗机构或诊所中用于处理医疗废弃物和医疗设备的专用台。它通常具有特定的功能和配置，以满足医疗废弃物处理和医疗设备操作的需求。',
              operator: '医疗废弃物处理：处置台通常配备了用于处理医疗废弃物的设备和工具，如医疗废弃物容器、废弃物袋、尖锐器械容器、生物危险废物容器等。医疗专业人员可以将医疗废弃物放置在处置台上，并根据相应的处理规定将其分类和处理，以确保医疗废弃物的安全处置。医疗设备操作：处置台通常具有适合医疗设备操作的平坦工作面和设备悬挂点，以方便医疗专业人员进行医疗设备的操作和维护。例如，在进行手术时，医疗专业人员可以将手术器械放置在处置台上，以便进行操作和使用。',
            }

          ],
        },
        {
          //5
          markers: [
            {
              id:'toChuZhiShi',
              tooltip:'处置室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 1,
              latitude: -0.6501577651944035,
              anchor: 'center right',
              jump: true,
              target: 4,
              angle: -45,
            },
            {
              id:'手术台',
              html: '<div class="bubble">手术台</div>',
              longitude: 0,
              latitude: -0.2,
              anchor: 'center right',
              jump: false,
              asset_id:9,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'手术台的功能和操作主要是为了提供一个稳固、可调节和清洁的工作平台，以方便医疗专业人员进行手术和其他医疗操作，并确保手术环境的安全和卫生。',
              operator: '根据手术的类型和患者的需求，调整手术台的高度、角度和位置，以确保医疗专业人员的工作姿势舒适并符合手术操作的要求。在手术过程中，保持手术台的稳定和安全，确保患者在手术过程中的稳定和舒适。在手术前和手术后，对手术台进行清洁和消毒，以确保手术环境的安全和卫生，并遵循医疗机构的操作规程和卫生要求。',
            },
            {
              id:'监护器',
              html: '<div class="bubble">监护器</div>',
              longitude: 5,
              latitude: -0.2,
              anchor: 'center right',
              jump: false,
              asset_id:10,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'手术台的功能和操作主要是为了提供一个稳固、可调节和清洁的工作平台，以方便医疗专业人员进行手术和其他医疗操作，并确保手术环境的安全和卫生。',
              operator: '根据手术的类型和患者的需求，调整手术台的高度、角度和位置，以确保医疗专业人员的工作姿势舒适并符合手术操作的要求。在手术过程中，保持手术台的稳定和安全，确保患者在手术过程中的稳定和舒适。在手术前和手术后，对手术台进行清洁和消毒，以确保手术环境的安全和卫生，并遵循医疗机构的操作规程和卫生要求。',
            },
            {
              id:'无影灯',
              html: '<div class="bubble">无影灯</div>',
              longitude: 0.8,
              latitude:  0.4,
              anchor: 'center right',
              jump: false,
              asset_id:11,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'无影灯（也称为手术室特种照明设备或手术室照明灯）是一种用于手术和医疗操作时提供高亮度、无影响的照明设备。',
              operator: '无影灯的功能和操作主要是为了提供高亮度、无影响的照明，使医疗专业人员能够在手术和医疗操作中获得清晰的视野，提高手术的安全性和效果。',
            }

          ],
        },
        {
          //6
          markers: [
            {
              id:'toShouShushi',
              tooltip:'手术室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 0.2,
              latitude: -0.4,
              anchor: 'center right',
              jump: true,
              target: 5,
              angle: -45,
            },
            {
              id:'病理整理柜',
              html: '<div class="bubble">病理整理柜</div>',
              longitude: 5.7,
              latitude:  0.2,
              anchor: 'center right',
              jump: false,
              asset_id:12,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'病理整理柜（也称为病理标本整理柜）是一种专门用于处理病理标本（包括组织切片和细胞标本）的设备，通常用于医疗实验室和病理科中。',
              operator: '操作：在使用病理整理柜时，医疗专业人员通常需要注意以下几点：遵循正确的操作步骤，包括对标本进行分类、编号、打包、封存和记录等操作，确保标本的整理和保存过程符合标准操作规程。注意标本的质量和完整性，包括对组织切片和细胞标本进行检查，确保标本没有变质、污染或损坏，并采取必要的措施进行修复和处理。进行标本的追溯和管理，包括对标本进行编号、记录、存档和查询等操作，确保标本在整理和保存过程中的溯源和追溯能力。清洁和消毒病理整理柜，以确保设备的卫生和安全，并遵循医疗机构的操作规程和卫生要求。',
            }

          ],
        },
        {
          //7
          markers: [
            {
              id:'toBingLiPouJianshi',
              tooltip:'病理剖检室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 7,
              latitude:  -0.5,
              anchor: 'center right',
              jump: true,
              target: 6,
              angle: -45,
            },
            {
              id:'拿药处',
              html: '<div class="bubble">拿药处</div>',
              longitude: 4,
              latitude: 0.0014482872080976428,
              anchor: 'center right',
              jump: false,
              asset_id:13,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'药物存放：拿药处是负责存放药物的地方，确保药物的安全和储存条件符合规定。药物通常根据分类和储存要求进行摆放，例如，需要冷藏的药物会存放在专门的冰箱中。',
              operator: '拿药处根据医生或其他医疗专业人员的处方或医嘱，负责将患者需要的药物进行合理、安全地分发。这包括根据患者的个人信息、药物剂量和使用方式等，准备药物并提供给患者或其代表。',
            },
            {
              id:'药柜',
              html: '<div class="bubble">药柜</div>',
              longitude: 5.7,
              latitude:  -0.1478313488770011,
              anchor: 'center right',
              jump: false,
              asset_id:14,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'药柜是用于存放药物和药品的设备，通常在医疗机构、药店、实验室等地使用。药柜的操作需要遵循一定的规程和注意事项，以确保药物的安全、有效和合法使用。',
              operator: '药物分类：药柜内的药物应按照类别、用途、剂型等进行分类，并放置在相应的位置，以便于查找和管理。通常可以按照药物的通用名、药品编码、药物分类编码等进行分类。药物存放：药物应放置在干燥、通风、避光、凉爽和干净的环境中，避免暴露在阳光、高温、潮湿和污染的情况下。有些药物可能需要特殊的存放条件，例如冷藏药物、高毒性药物等，应按照药品说明书或药物管理规定进行存放。',
            }

          ],
        },
        {
          //8
          markers: [
            {
              id:'toZhuanke',
              tooltip:'专科检查室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude:  7,
              latitude:  -0.4,
              anchor: 'center right',
              jump: true,
              target: 9,
              angle: -90,
            },
            {
              id:'换衣处',
              html: '<div class="bubble">换衣处</div>',
              longitude:5.5,
              latitude: 0,
              anchor: 'center right',
              jump: false,
              asset_id:15,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'换衣处通常是指医疗机构、实验室、工厂、体育馆等场所中用于更换工作服、制服、实验服、运动服等的区域',
              operator: '进入换衣处前应先脱下外部衣物，例如外套、外鞋等，以便更换工作服或制服。根据规定的程序和要求，选择合适的工作服或制服，并穿上。通常应根据个人的尺码和工作要求来选择合适的服装，并确保穿戴整齐、干净。将个人的外部衣物、饰品、手机等放置在指定的存放位置，如衣柜、储物柜等，确保个人物品的安全。在更衣过程中应保持整洁、卫生，避免弄脏或污染工作服或制服。完毕后，应将个人外部衣物穿好，并整理好个人物品，确保没有遗漏。',
            },
            {
              id:'消毒区',
              html: '<div class="bubble">消毒区</div>',
              longitude: 4,
              latitude:  -0.2,
              anchor: 'center right',
              jump: false,
              asset_id:16,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'消毒区通常是指医疗机构、实验室、食品加工场所等需要进行消毒处理的区域。',
              operator: '穿戴个人防护装备：进入消毒区前，应穿戴个人防护装备，如手套、口罩、护目镜、防护服等，确保个人安全。准备消毒剂：根据所需消毒的对象和消毒剂的要求，准备适量的消毒剂，如酒精、氯溴素、过氧乙酸等，按照使用说明和剂量要求配制好消毒液。清洁和准备消毒器械：将需要消毒的器械、工具等放置在清洁的工作台上，并进行表面清洁，去除附着的污垢。',
            }

          ],
        },
        {
          //9
          markers: [
            {
              id:'toYingXiangShi',
              tooltip:'影像室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 2,
              latitude: -0.52,
              anchor: 'center right',
              jump: true,
              target: 10,
              angle: -90,
            },
            {
              id:'检查台',
              html: '<div class="bubble">检查台</div>',
              longitude: 0.4,
              latitude:  -0.4,
              anchor: 'center right',
              jump: false,
              asset_id:17,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'检查台是医疗机构或诊所中用于进行患者体格检查和医生诊断的设备。它通常由一个平面台面和一些配套的医疗器械组成。',
              operator: '患者体格检查：检查台提供了一个方便、舒适的平面台面，供患者躺卧、坐立或站立，以便医生进行各种体格检查，如听诊、触诊、视诊、量体温、量血压等。医生诊断：检查台上通常配备有医用灯、检查工具和仪器等，便于医生进行各种检查和诊断操作。',
            }

          ],
        },
        {
          //10
          markers: [
            {
              id:'toZhuSheshi',
              tooltip:'注射室',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 3.2,
              latitude: -0.6,
              anchor: 'center right',
              jump: true,
              target: 11,
              angle: -90,
            },
            {
              id:'影像台',
              html: '<div class="bubble">影像台</div>',
              longitude: 0.7,
              latitude:  0,
              anchor: 'center right',
              jump: false,
              asset_id:18,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'影像台是医疗机构中用于进行医学影像学检查的设备。它通常由一个平面台面和一些配套的医疗器械、设备组成。',
              operator: '患者检查：影像台提供了一个平坦的表面供患者躺卧或坐立，便于医生或技师进行各种医学影像学检查，如X射线检查、CT扫描、MRI检查、超声检查等。患者可以根据医生或技师的指示在影像台上采取相应的体位，以便获得高质量的医学影像。影像设备放置：影像台上通常配备有固定或可移动的支架、架子、夹具等，用于放置医学影像设备，如X射线机、CT机、MRI机、超声仪等。这些设备可以根据需要在影像台上进行定位、固定和调整，以便获取所需的影像。',
            }

          ],
        },
        {
          //11
          markers: [
            {
              id:'toZhuYuanBu',
              tooltip:'住院部',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 1.903334280522629 ,
              latitude: -0.3561951394225287,
              anchor: 'center right',
              jump: true,
              target: 13,
              angle: -90,
            },
            {
              id:'注射台',
              html: '<div class="bubble">注射台</div>',
              longitude: 4.730593408331794,
              latitude: 0.0014482872080976428,
              anchor: 'center right',
              jump: false,
              asset_id:19,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'注射台是医疗机构中用于进行注射操作的设备。',
              operator: '准备工作：在进行注射操作前，医生或护士应确保注射台的卫生状况良好，台面干净整洁。同时，准备好所需的注射器、针头、药物、消毒液等。患者准备：请患者坐在注射台上，或依据注射的部位和要求让患者采取适当的体位。确保患者舒适，并清洁注射部位。消毒处理：医生或护士应首先对注射部位进行消毒处理，以确保操作的无菌性。消毒液通常为酒精或碘酒，应按照规范的消毒方法和时间进行操作。技术操作：在消毒液干燥后，医生或护士可以进行注射操作。这包括选择合适的注射器和针头，抽取药物，以正确的角度和深度将针头插入注射部位，并缓慢注射药物。注射后处理：注射完成后，医生或护士应将注射器和针头安全地丢弃，并对注射部位进行适当的处理，例如轻轻按压注射部位，以减少出血和疼痛。同时，清理注射台并消毒，以备下一次使用。记录和报告：医生或护士应及时记录注射操作的相关信息，包括药物名称、剂量、注射部位、注射者、时间等，并报告给患者的医生或护理团队。',
            },

          ],
        },
        {
          //12
          markers: [
            {
              id:'toYaoFang',
              tooltip:'药房',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: -0.5,
              latitude: -0.1,
              anchor: 'center right',
              jump: true,
              target: 7,
              angle: -45,
            },
            {
              id:'toZhuYuanBu',
              tooltip:'住院部',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude:  8.17,
              latitude: -0.01,
              anchor: 'center right',
              jump: true,
              target: 13,
              angle: -90,
            },
            {
              id:'接待台',
              html: '<div class="bubble">接待台</div>',
              longitude: 6.4,
              latitude: 0.0014482872080976428,
              anchor: 'center right',
              jump: false,
              asset_id:20,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'接待台是医疗机构中用于接待患者和访客的设备，通常位于医院、诊所、医疗中心等医疗机构的前台区域。',
              operator: '患者和访客接待：接待台是患者和访客进入医疗机构后的第一站，负责迎接和接待患者和访客，提供友好和专业的服务。接待台的工作人员应向患者和访客提供所需的信息、指引和协助，帮助他们找到需要的服务区域或医生诊室。管理患者信息：接待台的工作人员通常会负责管理患者的基本信息，包括登记患者信息、核对患者身份、录入患者就诊记录等。这有助于医疗机构的患者管理和档案管理工作。预约和挂号：接待台通常会协助患者和访客进行医生诊室的预约和挂号工作。他们会收集患者信息，为患者安排合适的就诊时间，并提供挂号和缴费等服务。',
            },

          ],
        },
        {
          //13
          markers: [
            {
              id:'toQianTai',
              tooltip:'前台',
              html: '<div><img src="https://aupup-mall-pub.oss-cn-shenzhen.aliyuncs.com/public/b254e741-96d5-40d9-aabd-853c5a2e332f.png" style="width:50%;height:50%;transform:rotate(-5deg)"></img></div>',
              longitude: 6.5,
              latitude: -0.4750037687323192,
              anchor: 'center right',
              jump: true,
              target: 12,
              angle: -45,
            },
            {
              id:'指示灯',
              html: '<div class="bubble">指示灯</div>',
              longitude: 6.5,
              latitude: 0.0014482872080976428,
              anchor: 'center right',
              jump: false,
              asset_id:21,
              video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4',
              func:'指示灯是一种用于传达信息或指示状态的灯光设备，通常以不同的颜色、亮度或闪烁模式来表示不同的含义或状态',
              operator: '提供指示和指引：指示灯通常用于向人们传达特定的信息或指导，例如标示出出口、紧急出口、安全出口、洗手间、停车等。',
            },

          ],
        },
      ],
    }
  },
  methods: {
    setViewer(panorama){
      if (this.viewer) try {
        this.viewer.destroy()
      } catch (e) {
        console.log(e)
        const viewer = document.querySelector('#viewer')
        viewer.removeChild(viewer.childNodes[0])
      }
      this.viewer = new Viewer({
        container:document.querySelector('#viewer'),
        panorama,
        size:{
          width: '95%',
          height: '80%',
        },
        plugins: [
          [MarkersPlugin,
            this.dataList[this.index]
          ],
        ],
      });

      this.markersPlugin = this.viewer.getPlugin(MarkersPlugin);
      this.viewer.on('click', (e, data) => {
        console.log(`${data.rightclick?'right ':''}clicked at longitude: ${data.longitude} latitude: ${data.latitude}`);
      });


      this.markersPlugin.on('select-marker', (e, marker) => {
        this.viewer.animate({
          longitude: marker.config.longitude,
          latitude: marker.config.latitude,
          zoom: 100,
          speed: '-2rpm',
        }).then(() =>
            {if(marker.config.jump){
              this.index = marker.config.target
              console.log(this.index);
              this.room = this.rooms[this.index];
              this.doctor = this.doctors[this.index];
              this.setViewer(this.imageArr[this.index].img);
              this.show.style.display = "none";
              this.showVideo.style.display = "none";
              this.showCard.style.display = "none";
              this.showCard2.style.display = "none";
              // this.showFunc.style.display = "none";
              // this.showOperator.style.display= "none";
              console.log(`unClicked on marker ${marker.config.id}`);
            }else{
              this.item = marker.config.id;
              this.func = marker.config.func;
              this.operator = marker.config.operator;
              axios.get(
                  `/api/room-assets/${marker.config.asset_id}`,

                  {
                    withCredentials : true,
                    headers:{
                      'Session':sessionStorage.getItem('sessionId'),
                      'Content-Type': 'application/json',

                    }}
              ).then(response=>{
                if(response.data.code===0){
                  const data=response.data.data;
                  console.log(data);
                  const tmp=data.photo;
                  if(tmp!=null){
                    if(tmp.startsWith('http')){
                      this.operator=data.photo;
                    }else{
                      this.operator="http://47.103.131.161:10010/files/"+data.photo;
                    }}
                  console.log(this.operator);
                  const tmp2=data.video;
                  if (tmp2!=null){

                    if(tmp2.startsWith('http')){
                      this.video = data.video;
                    }else{
                      this.video = "http://47.103.131.161:10010/files/"+data.video;
                    }}
                  this.func=data.description;
                }else{
                  alert('请稍后再试');
                  this.$router.go(-1);
                }
              })
              this.playerOptions.sources[0].src=this.video;
              this.show.style.display = "block";
               this.showVideo.style.display = "none";
              // this.showFunc.style.display = "none";
              //this.showOperator.style.display= "none";
            }
            }
        )
      });
      this.markersPlugin.on('unselect-marker', (e, marker) => {
        this.show.style.display = "none";
        this.showVideo.style.display = "none";
        this.showCard.style.display = "none";
        this.showCard2.style.display = "none";
        // this.showFunc.style.display = "none";
        // this.showOperator.style.display= "none";
        console.log(`unClicked on marker ${marker.config.id}`);
      });
    },

    toggleVideo(){
      this.showVideo.style.display = "block";
      this.showCard.style.display = "none";
      this.showCard2.style.display = "none";
      //   this.showFunc.style.display = "none";
      //   this.showOperator.style.display = "none";
      console.log('video');
    },

    toggleFunc(){
      this.cardTitle="功能说明";
      this.cardContent = this.func;
      this.showVideo.style.display = "none";
      this.showCard.style.display = "block";
      this.showCard2.style.display = "none";
      //   this.showFunc.style.display = "block";
      //   this.showOperator.style.display = "none";
      console.log('func');
    },

    toggleOperator(){
      this.cardTitle="操作流程";

      this.cardContent = this.operator;
      this.showCard.style.display='none';
      this.showVideo.style.display = "none";
      this.showCard2.style.display = "block";
      //   this.showFunc.style.display = "none";
      //   this.showOperator.style.display = "block";
      console.log('operator');
    },
  },

  mounted(){
    this.show = document.getElementById("show"),
        this.showVideo = document.getElementById("show-video"),
        // this.showFunc = document.getElementById("show-func"),
        // this.showOperator = document.getElementById("show-operator"),
        this.showCard = document.getElementById("show-card"),
        this.showCard2 = document.getElementById("show-photo");
        this.showCard.style.display = "none";
    this.showCard2.style.display = "none";
    this.show.style.display = "none";
    this.showVideo.style.display = "none";
    // this.showFunc.style.display = "none";
    // this.showOperator.style.display= "none";
    this.setViewer(this.imageArr[this.index].img);
    this.room = this.rooms[this.index];
    this.doctor = this.doctors[this.index];
  },


}



</script>

<style>
.bubble {
  position: relative;
  display: inline-block;
  padding: 10px;
  border-radius: 10px;
  background-color: gray;
  color: white;
}

.bubble::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 10px;
  border-color: gray transparent transparent transparent;
  bottom: -10px;
  left: calc(50% - 10px);
}


.bubble:hover {
  background-color: #b9cbff;
  cursor: pointer;
}
.bubble:hover::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 10px;
  border-color: #4b7cff transparent transparent transparent;
  bottom: -10px;
  left: calc(50% - 10px);
}
.card.p-4{
  height:80vh;
}
.trapezoid {
  display: inline-block;
  padding: 3px 15px;
  background-color: black; /* 背景颜色为黑色 */
  opacity: 0.6; /* 设置透明度为50% */
  position: relative; /* 设置定位为相对定位 */
}
/* .trapezoid p {
  color: white; /* 设置文字颜色为白色 */
/* position: absolute; 设置绝对定位 */
/* top: 2px; 设置文字距离顶部的距离 */
/* left: 2px; 设置文字距离左侧的距离 */
/* size: 5px; */
/* z-index: 1; 将文字置于上层 */
/* } */
.itemfunc{
  display: inline-block;
  padding: 3px 30px;
  background-color: rgb(179, 201, 255);
  opacity: 0.86;
  position: relative;
}

.box {
  border: 3px solid white; /* 设置2像素宽的白色边框 */
  border-radius: 10px; /* 设置圆角为10像素 */
  padding: 3px 15px; /* 设置内边距为10像素，使文本离边框有一定的间隙 */
  display: inline-block;
}

.showfunc{
  position: absolute;
  width: 15%;
  height: 10%;
  word-wrap: break-word;
  background-color: white;
  border-radius: 10px;
  padding: 3px 15px;
  overflow-x: hidden;
  overflow-y: scroll;
  max-height:10%;

}
.toto{
  font-family: "Arial Rounded MT Bold", sans-serif; /* 设置圆体字体 */
  color: white; /* 设置文本颜色为白色 */
  text-shadow: 1px 1px 2px black; /* 添加黑色阴影 */
  writing-mode: vertical-rl; /* 设置竖排文字方向 */
}


</style>

