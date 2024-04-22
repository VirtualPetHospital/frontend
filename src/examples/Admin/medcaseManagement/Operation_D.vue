<template>
    <div class="card p-4" >
      <div class=" row">
        <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
        <div class="col-12">
  
          <h3>{{name}}的手术详情</h3>
          <div class="row">
            <div class="col-6">
              <el-card class="custom-elcard">
                <el-descriptions class="margin-top" title="手术信息" :column="1" style="font-size: large"  :size="size"  border>
                  <el-descriptions-item >
                    <template v-slot:label>
                      <i class="el-icon-user"></i>
                      手术价格:
                    </template>
                    {{ price }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template v-slot:label>
                      <i class="el-icon-mobile-phone"></i>
                      手术描述:
                    </template>
                    {{description}}
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card class="custom-elcard">
                <h5>手术照片</h5>
                <el-image :src="photo">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-card>
            </div>
            <div class="col-6">
              <el-card class="custom-elcard">
                <h5>手术视频</h5>
                <video-player
                    class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"/>
              </el-card>
            </div>
  
  
        </div>
  
      </div>
    </div>
    </div>
  </template>
  <script>
  import {useStore} from "vuex";
  import {onBeforeRouteLeave} from "vue-router";
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import {
    ElCard,
    ElDescriptions,
    ElDescriptionsItem,
    ElImage,
    ElPagination,
    ElTable,
    ElTableColumn,
    ElTag
  } from "element-plus";
  import axios from "axios";
  export default{
    name:"Operation",
    methods:{
      backto(){
        this.$router.go(-1); // 返回上一层页面
      },
      async fetchOperationDetails(operationId) {
        try {
          const response = await axios.get(`/api/operations/${operationId}`,
              {
                withCredentials : true,
                headers:{
                  'Session':sessionStorage.getItem('sessionId'),
                  'Content-Type': 'application/json',
                }
              });
          const operationDetails = response.data.data;
  
          // 将获取到的数据赋值给对应的变量
          this.name = operationDetails.name;
          this.price = operationDetails.price;
          this.description = operationDetails.description;
          this.photo = operationDetails.photo;
          this.video = operationDetails.video;
          this.playerOptions.sources[0].src =this.video;
  
        } catch (error) {
          console.error('Error fetching operation details:', error);
          // 处理错误，例如显示错误信息给用户
        }
      },
      async fetchOperationDetailsMock(operationId) {
        try {
          // 模拟获取手术详情数据
          const mockData ={
            name: '手术名称',
            price: 1000,
            description: '手术描述内容',
            photo: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4'
          };
  
          // 将模拟数据赋值给对应的变量
          this.name = mockData.name;
          this.price = mockData.price;
          this.description = mockData.description;
          this.photo = mockData.photo;
          this.playerOptions.sources[0].src = mockData.video;
  
        } catch (error) {
          console.error('Error fetching operation details (mock):', error);
          // 处理错误，例如显示错误信息给用户
        }
      }
    },
    data(){
      return{
        operation_id:null,
        name:"",
        price:null,
        description:"",
        photo:"",
        video:"",
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
      }
    },
    components:{
      videoPlayer,
      ElCard,
      ElImage,
      ElDescriptions,
      ElDescriptionsItem
    },
    mounted() {
      this.operation_id = this.$route.params.operation_id;
  
      // 在页面加载时调用获取手术详情数据的方法
      this.fetchOperationDetails(this.operation_id);
    },
    setup() {
      const store = useStore();
  
      // 在组件被挂载后，设置 showSidenavStudent 为 true
      store.commit('setShowSidenavAdmin', true);
  
      onBeforeRouteLeave((to, from, next) => {
        // 在离开此页前关闭sidenavadmin
        store.commit('setShowSidenavAdmin', false);
        next();
      });
  
      return {};
    }
  
  };
  </script>
  
  <style scoped>
  .container.sectionHeight {
    background-color: white; /* 设置背景色为白色 */
    border-radius: 20px;
    margin-left: 10px;
    padding:20px;
    padding-bottom: 20px;
  }
  .custom-elcard{
    margin-top: 10px;
    border-radius: 10px;
  }
  .card.p-4{
    margin-left: 5px;
  }
  </style>
  