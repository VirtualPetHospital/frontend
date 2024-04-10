<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>我的考试</h3>
        <el-table :data="pageExams" stripe style="margin-top: 20px" >
          <el-table-column prop="exam_id" label="考试ID"></el-table-column>
          <el-table-column prop="name" label="考试名称"></el-table-column>
          <el-table-column prop="start_time" label="考试开始时间"></el-table-column>
          <el-table-column prop="end_time" label="考试结束时间"></el-table-column>
          <el-table-column prop="duration" label="考试时长"></el-table-column>
          <el-table-column prop="level" label="考试等级"></el-table-column>
          <el-table-column
              fixed="right"
              align="center"
              label="操作">
            <template v-slot="scope">
              <div class="button-group">
                <el-button :class="{ 'checki': !getButtonClassAndDisabledForWatch(scope.row), 'checked': getButtonClassAndDisabledForWatch(scope.row) }" @click="watch(scope.row)" type="text" size="small" style="margin-left: 5px"  :disabled="getButtonClassAndDisabledForWatch(scope.row) ">
                  查看</el-button>
                <el-button :class="{ 'checki': !getButtonClassAndDisabledForTake(scope.row), 'checked': getButtonClassAndDisabledForTake(scope.row) }" @click="take(scope.row)" type="text" size="small" style="margin-left: 5px" :disabled="getButtonClassAndDisabledForTake(scope.row)">参加</el-button>
                <el-button :class="{ 'checki': !getButtonClassAndDisabledForEnroll(scope.row), 'checked': getButtonClassAndDisabledForEnroll(scope.row) }" @click="participate(scope.row)" type="text" size="small" style="margin-left: 5px" :disabled="getButtonClassAndDisabledForEnroll(scope.row)">报名</el-button>
              </div>
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
import {ElPagination,ElTable, ElTableColumn,ElButton} from "element-plus";
import axios from "axios";
export default{
  name:"Myexam",
  data(){
    return{
      exams:[],
      pageExams:[],
      total:null,
    }
  },
  components:{
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton
  },
  methods:{
    /*
    * 跳转逻辑*/
    watch(row){
      const paperId=row.paper.paper_id;
      const paperName=row.paper.name;
      this.$router.push({name:'WatchPaper',params:{id: paperId,name:paperName}});
    },
    take(row){
      const examId=row.exam_id;
      this.$router.push({name:'TakeExam',params:{id: examId}});
    },
    fetchExams(){
      axios.get('/api/exams',
          {
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }
          }).then(response=>{
            const data=response.data.data;
            this.total=data.total;
            this.exams=data.records;
            console.log(this.exams);
            this.fetchPageExams();

    })
    },
    participate(row){
      const examId = row.exam_id;

      // 发起报名请求
      axios.post(`/api/exams/enroll/${examId}`,
          {examId:examId
          },
          {
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }})
          .then(response => {
            console.log('报名成功');
            this.refresh();
          })
          .catch(error => {
            // 处理报名失败的情况
            console.error('报名失败:', error);
          });
    },
    refresh() {
      location.reload();
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchPageExams();
    },
    fetchPageExams()
    {
      this.pageExams = [];
      for (let i = (this.pageNum - 1) * this.pageSize; i < this.total; i++) {
        //把遍历的数据添加到pageTicket里面
        this.pageExams.push(this.exams[i]);
        //判断是否达到一页的要求
        if (this.pageExams.length === this.pageSize) break;
      }
      console.log("pg"+this.pageExams);
    },
    // 分页 current 变化
    handleCurrentChange(pageNum) { // 处理页码改变事件
      this.pageNum = pageNum; // 更新当前页码
      this.fetchPageExams(); // 重新获取数据
    },
    // 根据当前时间设置按钮样式
    getButtonClassAndDisabledForWatch(row) {
      if(row.participated===true){
      return false;}
      return true;
    },
    getButtonClassAndDisabledForEnroll(row) {
      if(row.participated===null){
        return false;}
      return true;
    },
    getButtonClassAndDisabledForTake(row) {
      if(row.participated===false){
        return false;}
      return true;
    }
  },
  created() {
    this.fetchExams();

    // 初始化页码和页大小
    this.pageNum = 1;
    this.pageSize = 10;

    // 加载数据

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
.container.sectionHeight {
  background-color: white; /* 设置背景色为白色 */
  border-radius: 20px;
  margin-left: 10px;
  padding:20px;
  padding-bottom: 20px;
  margin-right: 1200px !important;
}

.custom-button {
  background-color: #b6e6ff;
  border: 2px solid #01a7f0;
  color: #00449c;
  padding-left: 0px;
  margin-left: 0px;
  font-size: 14px;
  border-radius: 3px;
  width: calc(33% - 10px);
}
.checked {
  border: 1px solid #dcdfe6;
  color: #dcdfe6;
  width: 27px;
  height: 27px;
  text-align: center;
  display: inline-block;
  line-height: 27px;
  background: #fff;
  border-radius: 2px;
  padding: 0px;
  cursor: pointer;
}
.checki {
  border: 1px solid #dcdfe6;
  color: #4b7cff;
  width: 27px;
  height: 27px;
  text-align: center;
  display: inline-block;
  line-height: 27px;
  background: #b6e3ff;
  border-radius: 2px;
  padding:0px;
  cursor: pointer;
}
.gray-button {
  margin-left: 15px;
  background-color: #ccc;
  border: 2px solid #ccc;
  color: #666;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
  border-radius: 3px;
}
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card.p-4{
  margin-left: 5px;
}
</style>
