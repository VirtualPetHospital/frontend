<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>我的试卷</h3>
        <el-table :data="pagePapers" stripe style="margin-top: 20px" >
          <el-table-column prop="paper.paper_id" label="试卷ID"></el-table-column>
          <el-table-column prop="paper.name" label="试卷名称"></el-table-column>
          <el-table-column prop="paper.question_num" label="题目数量"></el-table-column>
          <el-table-column prop="paper.correct_num" label="正确率">
            <template #header>
              <span class="column-header">正确率</span>
            </template>
            <template #default="scope">
              <el-progress
                  v-if="!isNaN(parseInt(scope.row.paper.correct_num))"
                  :percentage="scope.row.paper.correct_num "
                  :indeterminate="true"
                  :duration="5"
                  color="success"
                  :stroke-width="18"
                  :show-text="false"
              />
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              align="center"
              label="操作">
            <template v-slot="scope">
                <el-button class="custom-button" @click="watchPaper(scope.row.examId,scope.row.paper.name)" type="text" size="small" style="margin-left: 10px">
                  查看
              </el-button>
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
      </div>
    </div>
  </div>
</template>
<script>
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {ElButton, ElPagination, ElProgress, ElTable, ElTableColumn} from "element-plus";
import axios from "axios";
import {toRaw} from "vue";
export default{
  name:"MyPapersStudent",
  data(){
    return{
      total:null,
      pageNum:1,
      pageSize:10,
      responseData:null,
      papers:[],
      pagePapers:[],
    }
  },
  components:{
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
    ElProgress
  },
  methods:{
    fetchPapers(){
      axios.get('/api/exams',{
        params:{
          page_size:this.pageSize,
          page_num:this.pageNum,
        },
        withCredentials : true,
        headers:{
          'Session':sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',

        }
      }).then(async response => {
        this.responseData = response.data;
        if (this.responseData && this.responseData.data && this.responseData.data.records.length > 0) {
          // 使用 map 方法遍历所有记录并提取 paper 字段
          for (let i = 0; i < this.responseData.data.records.length; i++) {
            let tmpPaper = this.responseData.data.records[i].paper;
            tmpPaper.correct_num = await this.correctNum(this.responseData.data.records[i].exam_id);
            let paperInfo = {
              examId: this.responseData.data.records[i].exam_id,
              paper: tmpPaper
            };
            this.papers.push(paperInfo);
            console.log(paperInfo);
          }

          this.total = this.responseData.data.total;

        } else {
          console.error('No data found or records array is empty.');
        }
        this.fetchPagePapers();
      }).catch(error=>{
        console.error('获取卷子失败',error);
      })
    },
    fetchPagePapers(){
      let tmppapers=toRaw(this.papers);
      console.log(tmppapers);
      this.pagePapers = [];
      for (let i = (this.pageNum - 1) * this.pageSize; i < this.total; i++) {
        //把遍历的数据添加到pageTicket里面
        this.pagePapers.push(tmppapers[i]);
        //判断是否达到一页的要求
        if (this.pagePapers.length === this.pageSize) break;
      }
      console.log(this.pagePapers);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchPagePapers();
    },
    // 分页 current 变化
    handleCurrentChange(pageNum) { // 处理页码改变事件
      this.pageNum = pageNum; // 更新当前页码
      this.fetchPagePapers(); // 重新获取数据
    },
    watchPaper(examId,paperName){

      this.$router.push({name:'WatchPaper',params:{id: examId,name:paperName}});
    },
    async correctNum(examId){
        const response=await axios.get(`/api/answer-sheets/${examId}` ,
            {
              params: {
                exam_id:examId,
              },
              withCredentials : true,
              headers:{
                'Session':sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',

              }}
        );
        if(response.data.code==0){
          console.log(response.data.data.score);
              const score = response.data.data.score;
          return score;
        }
        else{
          const score=0;
          return score;
        }



    },
  },
  mounted() {
    this.fetchPapers();
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

.card.p-4{
  margin-left: 5px;
}
.custom-button {
  /* 设置背景颜色 */
  background-color: #b6e6ff;
  /* 设置边框颜色和样式 */
  border: 3px solid #01A7F0;
  /* 设置字体颜色 */
  color: #00449C;
  /* 设置字体大小 */
  font-size: 18px;
  /* 设置圆角 */
  border-radius: 6px;
  padding-left: 5px;
  padding-right: 5px;
  /* 设置按钮悬停时的背景颜色 */
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
}
.column-header {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
