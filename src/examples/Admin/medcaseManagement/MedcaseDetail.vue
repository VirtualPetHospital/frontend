<template>
  <div class="card p-4" style="height:850px" >
    <div class="row">
      <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
      <div class="col-12">

      <h3>{{ medCase.name }}</h3>
        <div class="row">
        <div class="col-6">
          <el-card class="custom-elcard">
            <el-descriptions class="margin-top" title="病例信息" :column="1" style="font-size: large"  :size="size"  border>
              <el-descriptions-item  labelStyle="white-space:nowrap;">
                <template v-slot:label>
                  <i class="el-icon-user"></i>
                  治疗描述：
                </template>
                {{ medCase.treatment_description }}
              </el-descriptions-item>

                <el-descriptions-item labelStyle="white-space:nowrap;"
                   >
                  <template v-slot:label >
                    <i class="el-icon-mobile-phone" ></i>
                    诊断结果:
                  </template>
                  {{medCase.diagnose_result}}
                </el-descriptions-item>
              <el-descriptions-item labelStyle="white-space:nowrap;">
                <template v-slot:label>
                  <i class="el-icon-location-outline"></i>
                  治疗费用:
                </template>
                {{medCase.price}}
              </el-descriptions-item>
              <el-descriptions-item labelStyle="white-space:nowrap;">
                <template v-slot:label>
                  <i class="el-icon-tickets"></i>
                  信息描述:
                </template>
                {{medCase.info_description}}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-card class="custom-elcard">
            <h5>视频</h5>
            <video-player
                class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"/>
          </el-card>
        </div>
        <div class="col-6">
          <el-card class="custom-elcard">
            <h5>病例图示</h5>
            <el-image :src="medCase.info_photo">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-card>
          <el-card class="custom-elcard">
            <el-button type="primary" size="small" class="custom-button " style="margin-left: 120px" @click="goToOperationPage">查看手术</el-button>

            <el-button type="primary" size="small" class="custom-button" style="margin-left: 100px" @click="goToMedicines">查看药品</el-button>
          </el-card>
        </div>
        </div>
      </div>
    </div>
  </div>
  <div class="py-4 container sectionHeight" style="margin-top: 20px" >
    <div class=" row">
      <div class="col-12">
        <h4>检查结果</h4>
        <div class="Echarts">
          <div id="main" style="width: 600px;height:400px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {useStore} from "vuex";
import {isNavigationFailure, NavigationFailureType, onBeforeRouteLeave} from "vue-router";
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import * as echarts from 'echarts';

import {
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElImage,
} from "element-plus";
import axios from "axios";
export default{
  name:"Medcase",

  data(){

    return{
      diseaseName:'',
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
      medCase: {
        medcaseId:null,
        name: null, // 用于存储病例名
        treatment_description: '', // 用于存储治疗描述
        diagnose_result: '', // 用于存储诊断结果
        price:null,
        disease_id:null,
        info_description:null,
        info_photo:"",
        info_video:null,
        operation_id:1,
        inspections:[],
        medicines:[],
      },
      xAxis:{
        type:"category",
        data:[
        ],
        axisLabel: {
          //坐标轴文字显示样式
          lineHeight: 18, //字体行高
          fontNum: 18, //每行显示字数
          rotate: 45, //文字旋转角度，0不旋转
        },
      },
      medData:[],
      lowData:[],
      highData:[]

    }
  },
  components:{
    ElCard,
    ElDescriptions,
    ElDescriptionsItem,
    ElImage,
    videoPlayer,

  },
  mounted() {
    // 从路由参数中获取medcaseId，这里假设您使用的是vue-router
    const medcaseId = this.$route.params.medcaseId;
    this.diseaseName=this.$route.params.diseaseName;
    // 调用fetchMedCase方法获取病例数据
    this.fetchMedCase(medcaseId);

  },
  methods:{
    backto(){
      this.$router.go(-1); // 返回上一层页面
;    },
    myEcharts(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '检查结果'
        },
        tooltip: {},
        legend: {
          orient:'horizontal',
          data:['最低值','最高值','病例值'],

        },
        xAxis: this.xAxis,
        yAxis: {},
        series: [
          {
          name: '最低值',
          type: 'bar',
          data:this.lowData,
          itemStyle:{
            color:'#FF9314',
          },
          label:{
            show:false,
            position:"right"
          }
        },
          {
            name: '最高值',
            type: 'bar',
            data:this.highData,
            itemStyle:{
              color:'#1492FF',
            },
            label:{
              show:false,
              position:"right"
            }
          },
          {
            name: '病例值',
            type: 'bar',
            data:this.medData,
            itemStyle:{
              color:'#a81818',
            },
            label:{
              show:false,
              position:"right"
            }
          }
        ],

      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    async handleChart(inspections) {
      this.lowData = [];
      this.highData = [];
      this.xAxis.data = [];

      const requests = inspections.map(inspection => {
        const inspId = inspection.inspection_id;
        const value = inspection.value;
        this.medData.push(value);
        console.log(inspId + '添加病例值' + value);
        return axios.get(`/api/inspections/${inspId}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          },
        }).then(res => {
          const data = res.data.data;
          const low = data.low;
          const high = data.high;
          const name = data.name;
          this.highData.push(high);
          this.lowData.push(low);
          this.xAxis.data.push(name);
          console.log(inspId + " low " + low + " high " + high + " name " + name);
        });
      });

      await Promise.all(requests);

      console.log('lowData:', this.lowData);
      console.log('highData:', this.highData);
      console.log('xAxis.data:', this.xAxis.data);

      this.myEcharts();
    },
    goToOperationPage() {
      // 获取当前病例的 operation_id
      const operationId = this.medCase.operation_id;

      // 使用编程式导航跳转到对应的手术页面
      this.$router.push({ name: '手术详情-管理员', params: { operation_id: operationId } });
    },
    goToMedicines(){
      const medcaseId=this.medCase.medcaseId;
      console.log(this.medCase.medicines);
      const medicinesQuery = JSON.stringify(this.medCase.medicines);

      // 使用 $router.push 将数据作为查询参数传递给目标路由组件
      this.$router.push({
        name: '药品详情-管理员',
        query: {
          medcaseId: medcaseId,
          medicines: medicinesQuery,
          total: this.medCase.medicines.length
        }
      });
    },

    async fetchMedCase(medcaseId){
      const response = await axios.get(`/api/medcases/${medcaseId}`,
          {
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',},

          });
      const data = response.data.data;
      this.medCase.name = data.name;
      this.medCase.treatment_description = data.treatment_description;
      this.medCase.diagnose_result = data.diagnose_result;
      this.medCase.price = data.price;
      this.medCase.disease_id = data.disease_id;
      this.medCase.info_description = data.info_description;
      const tmp=data.info_photo;
      if(tmp!=null){
      if(tmp.startsWith('http')){
        this.medCase.info_photo=data.info_photo;
      }else{
        this.medCase.info_photo = "http://47.103.131.161:10010/files/"+data.info_photo;
      }}
      const tmp2=data.info_video;
      if(tmp2!=null){
      if(tmp2&&tmp2.startsWith('http')){
        this.medCase.info_video = data.info_video;
      }else{
        this.medCase.info_video = "http://47.103.131.161:10010/files/"+data.info_video;
      }}
      console.log(this.medCase.info_photo);
      this.medCase.operation_id = data.operation_id;
      this.medCase.inspections = data.inspections;
      this.handleChart(this.medCase.inspections);
      this.playerOptions.sources[0].src=this.medCase.info_video;
      this.medCase.medicines = data.medicines;
      console.log("medcaseMedicines"+this.medCase.medicines);
    },
    async fetchMedCaseMock(medcaseId) {
      try {
        // 模拟获取病例数据
        const mockData = {
          name: '病',
          treatment_description: '治疗描述内容',
          diagnose_result: '诊断结果内容',
          price: 100,
          disease_id: 1,
          info_description: '信息描述内容',
          info_photo: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          info_video: "https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4" ,
          operation_id: 1,
          inspections: [],
          medicines: [
            { id: 1, num: 3 },
            { id: 2, num: 5 },
            { id: 3, num: 2 },
            { id: 4, num: 4 },
            { id: 5, num: 1 },
            { id: 6, num: 2 },
            { id: 7, num: 3 },
            { id: 8, num: 2 },
            { id: 9, num: 5 },
            { id: 10, num: 1 },
            { id: 11, num: 3 },
            { id: 12, num: 4 },
            { id: 13, num: 2 },
            { id: 14, num: 3 },
            { id: 15, num: 2 },
            { id: 16, num: 1 },
            { id: 17, num: 4 },
            { id: 18, num: 3 },
            { id: 19, num: 2 },
            { id: 20, num: 5 },
          ]
        };

        // 将模拟数据赋值给medCase对象的相应属性
        this.medCase.name = mockData.name;
        this.medCase.treatment_description = mockData.treatment_description;
        this.medCase.diagnose_result = mockData.diagnose_result;
        this.medCase.price = mockData.price;
        this.medCase.disease_id = mockData.disease_id;
        this.medCase.info_description = mockData.info_description;
        this.medCase.info_photo = mockData.info_photo;
        this.medCase.info_video = mockData.info_video;
        this.medCase.operation_id = mockData.operation_id;
        this.medCase.inspections = mockData.inspections;
        this.medCase.medicines = mockData.medicines; // 将模拟的药品数据赋值给medicines

        this.playerOptions.sources[0].src=this.medCase.info_video;
      } catch (error) {
        console.error('Error fetching med case:', error);
        // 处理错误，例如显示错误信息给用户
      }
    }


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
  margin-right:50px;
  padding:20px;
}
.role-play-title {
  position: absolute;
  top: 120px;
  left: 40px;
  font-size: 36px;
  font-weight: bold;
  color: black;
}
.custom-button {
  margin-left: 25px;
  /* 设置背景颜色 */
  background-color: #b6e6ff;
  /* 设置边框颜色和样式 */
  border: 2px solid #01A7F0;
  /* 设置字体颜色 */
  color: #00449C;
  padding-left: 10px;
  padding-right: 10px;
  /* 设置字体大小 */
  font-size: 18px;
  /* 设置圆角 */
  border-radius: 3px;
  /* 设置按钮悬停时的背景颜色 */
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
}
.custom-elcard{
  margin-top: 10px;
  border-radius: 10px;
}
.card.p-4{
  margin-left: 5px;
}
.my-class {
  max-width: 25px;
  word-break: break-all;
  word-wrap: break-word;
}

.my-label {
  width: 200px;
  color: #999;
  font-weight: normal;
  background: #fff;
}

v-deep.el-descriptions-item__content{
  max-width: 26px;
}

</style>
