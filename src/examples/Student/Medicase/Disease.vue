<template>
  <div class="card p-4" style="height: auto" >
    <div class=" row">
      <div class="col-12">
        <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
        <h3 style="margin-top: 20px">{{diseaseName}}详情</h3>
        <el-card class="custom-elcard">
          <h4>疾病信息</h4>
          <div class="row">
            <div class="col-6">
              <el-card class="custom-elcard">
                      疾病描述:
                    {{description }}
              </el-card>

                <el-card class="custom-elcard">
                  <h5>疾病图示</h5>
                  <el-image :src="this.photo">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </el-card>
            </div>
            <div class="col-6">
              <el-card class="custom-elcard">
                <h5>疾病视频</h5>
                <video-player
                    class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"/>
              </el-card>
            </div>
          </div>
        </el-card>

        <el-card class="custom-elcard">
          <div class="row">
            <h4>病例列表</h4>
            <el-input
                v-model.trim="ruleForm.searchText"
                placeholder="请输入搜索内容"
                style="width: 270px; cursor: pointer"
                @keyup.enter.native="searchEnterFun"
                autocomplete="off"
                @input="change()"
            >
            </el-input>
            <el-button class="custom-button" style="width: 60px" @click="handleSearch">搜索</el-button>
          </div>

          <el-table :data="pageMedCases" stripe style="margin-top: 20px">
            <el-table-column prop="medcase_id" label="病例ID" width="100" sortable></el-table-column>
            <el-table-column prop="name" label="病例名称"></el-table-column>
            <el-table-column prop="info_description" label="病例简介"></el-table-column>
            <el-table-column label="查看病例详情">
              <template #default="{row}">
                <el-button type="text" class="custom-button" @click="jumpToMedcase(row.medcase_id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              :total="total"
              :page-num="pageNum"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </el-card>

      </div>
    </div>
  </div>
</template>
<script>
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {ElCard, ElImage, ElPagination, ElTable, ElTableColumn, ElInput, ElButton} from "element-plus";
import {videoPlayer} from "vue-video-player";
import axios from "axios";
export default{
  name:"Disease",
  data(){
    return{
      ruleForm:{
        searchText:'',
      },
      diseaseName:'',
      description:'',
      disease_id:'',
      photo:'',
      video:'',
      pageSize: 10, // 设置默认的分页大小
      pageNum: 1, // 设置默认的页码
      infoKeyword: '', // 设置默认的病例简介关键词
      nameKeyword: '', // 设置默认的病例名关键词
      medCases: [] ,// 用于存储从后端获取的病例数据
      pageMedCases:[],
      total:0,
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
          src:""           // url地址
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
    ElTable,
    ElPagination,
    ElTableColumn,
    // eslint-disable-next-line no-undef
    ElCard,
    ElInput,
    ElButton,
    ElImage,

  },
  created() {
    this.diseaseName=this.$route.query.diseaseName;
    this.disease_id=this.$route.query.diseaseId;
    console.log("cre id"+this.disease_id+' '+this.diseaseName);
    this.fetchDiseaseDetails(this.disease_id);
    this.fetchMedCases(this.diseaseName);
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
  methods: {
    backto(){
      this.$router.go(-1);
    },
    jumpToMedcase(medcaseId){
      this.$router.push({name:'Medcase',params:{medcaseId:medcaseId,diseaseName:this.diseaseName}});
    },
    handleSearch(){
      console.log(this.ruleForm.searchText);
      if(this.ruleForm.searchText===''){
        alert("搜索内容不能为空")
      }else{
        this.$router.push({
          name:'SearchMedcase',
          query:{
            searchText:this.ruleForm.searchText
          }
        });
      }
    },

    /**
     疾病信息
     **/
    async fetchDiseaseDetails(){
      console.log('this.diseaseid '+this.disease_id);
      try{
      const response = await axios.get(
          `/api/diseases/${this.disease_id}`,
        {
          withCredentials : true,
              headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',},
        }
      );
      console.log(response.data.data);
      const data = response.data.data;
      this.description = data.description;
      const tmp=data.photo;
      if(tmp.startsWith('http')){
        this.photo=data.photo;
      }else{
        this.photo="http://47.103.131.161:10010/files/"+data.photo;
      }
        const tmp2=data.video;
        if(tmp2.startsWith('http')){
          this.video = data.video;
        }else{
          this.video = "http://47.103.131.161:10010/files/"+data.video;
        }
        this.playerOptions.sources[0].src=this.video;
        console.log("xhsdsddsd"+this.playerOptions.sources[0].src);

      }
      catch(error){
        console.error('获取疾病信息失败',error);
      }
    },
    searchEnterFun (e){

      var keyCode = window.event? e.keyCode:e.which;
      console.log("回车搜索", keyCode, e);
      if (keyCode == 13) {this.handleSearch();
      }
    },
    change(){
      this.$forceUpdate();
    },
    async fetchDiseaseDetailsMock(disease_id) {
      try {
        // Mocked data
        const mockData = {
          disease_id: 1,
          name: 'Mock Disease',
          description: 'This is a mock disease description',
          category_id: 456,
          photo: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          video: 'https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4'
        };
        // 网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.video=mockData.video;
        this.description=mockData.description;
        this.photo=mockData.photo;
        this.playerOptions.sources[0].src=this.video;
      } catch (error) {
        console.error('Error fetching disease details (mock):', error);
        throw error;
      }
    },
    /**
     病例
     **/
    getPageMedCases(){
      this.pageMedCases=[];
      for(let i=(this.pageNum-1)*this.pageSize;i<this.total;i++) {
        //把遍历的数据添加到pageTicket里面
        this.pageMedCases.push(this.medCases[i]);
        //判断是否达到一页的要求
        if (this.pageMedCases.length === this.pageSize) break;
      }
      console.log(this.pageMedCases);
    },
    async fetchMedCases() {
      try {
        // 构建请求参数对象
        const params = {
          info_keyword: this.infoKeyword,
          name_keyword: this.nameKeyword,
          disease_name: this.diseaseName // 使用疾病名参数
        };
        let that = this;
        console.log(this.diseaseName);
        axios.get(
            '/api/medcases',
            {
              withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              },
              params:params
            }
        ).then(response => {
          const data = response.data.data;
          console.log(data); // 可以在控制台中打印响应数据
          //筛
          // 模拟异步请求延迟
          that.medCases = data.records;
          that.total = that.medCases.length;// 成功时返回医疗案例数据
          console.log("fi"+that.medCases);
          that.getPageMedCases();
        }).catch(error => {
          console.error('获取病例失败', error);
        });

      }catch(error){
        console.log(error);
      }

    },
    fetchMedCasesMock(diseaseName) {
      return new Promise((resolve, reject) => {
        let that = this;
        // 模拟后端返回的医疗案例数据
        const medCasesData = [
          { medcase_id: 1, name: "果带商已处金", info_description: "adipisicing ipsum",disease_name:this.diseaseName },
          { medcase_id: 2, name: "案例2", info_description: "Lorem ipsum dolor sit amet", disease_name:this.diseaseName},
          { medcase_id: 3, name: "案例3", info_description: "Consectetur adipiscing elit", disease_name:this.diseaseName },
          { medcase_id: 4, name: "果带商已处金", info_description: "adipisicing ipsum",disease_name:this.diseaseName },
          { medcase_id: 5, name: "案例2", info_description: "Lorem ipsum dolor sit amet", disease_name:this.diseaseName},
          { medcase_id: 6, name: "案例3", info_description: "Consectetur adipiscing elit", disease_name:this.diseaseName },
          { medcase_id: 7, name: "果带商已处金", info_description: "adipisicing ipsum",disease_name:this.diseaseName },
          { medcase_id: 8, name: "案例2", info_description: "Lorem ipsum dolor sit amet", disease_name:this.diseaseName},
          { medcase_id: 9, name: "案例3", info_description: "Consectetur adipiscing elit", disease_name:this.diseaseName },
          { medcase_id: 10, name: "果带商已处金", info_description: "adipisicing ipsum",disease_name:this.diseaseName },
          { medcase_id: 11, name: "案例2", info_description: "Lorem ipsum dolor sit amet", disease_name:this.diseaseName},
          { medcase_id: 12, name: "案例3", info_description: "Consectetur adipiscing elit", disease_name:this.diseaseName },
          { medcase_id: 13, name: "果带商已处金", info_description: "adipisicing ipsum",disease_name:this.diseaseName },
          { medcase_id: 14, name: "案例2", info_description: "Lorem ipsum dolor sit amet", disease_name:this.diseaseName},
          { medcase_id: 10086, name: "案例3", info_description: "Consectetur adipiscing elit", disease_name:this.diseaseName },
          // 其他医疗案例数据...
        ];

        // 根据传入的疾病名称过滤数据
        const filteredMedCases = medCasesData.filter(caseData => caseData.disease_name === diseaseName);
        // 模拟异步请求延迟
        that.medCases=filteredMedCases;
        that.total=filteredMedCases.length;// 成功时返回医疗案例数据
        console.log("fol"+filteredMedCases);
        that.getPageMedCases();
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPageMedCases();
    },
    // 分页 current 变化
    handleCurrentChange(pageNum) { // 处理页码改变事件
      this.pageNum = pageNum; // 更新当前页码
      this.getPageMedCases(); // 重新获取数据
    },

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
  font-size: 14px;
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
</style>