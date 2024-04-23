<template>
  <div class="card p-4" style="height: auto" >
    <div class=" row">
      <div class="col-12">
        <h3>我的考试</h3>
        <el-table :data="pageExams" stripe style="margin-top: 20px" @filter-change="handleFilterChange" >
          <el-table-column prop="exam_id" label="考试ID" sortable></el-table-column>
          <el-table-column prop="name" label="考试名称"></el-table-column>
          <el-table-column prop="start_time" label="考试开始时间" sortable></el-table-column>
          <el-table-column prop="end_time" label="考试结束时间" sortable></el-table-column>
          <el-table-column prop="duration" label="考试时长" sortable></el-table-column>
          <el-table-column prop="level" label="考试等级" sortable></el-table-column>
          <el-table-column
              fixed="right"
              align="center"
              label="操作"
              column-key="participant"
              :filters="[{ text: '可参加', value: '0' }, { text: '可报名', value: '1' }, { text: '可查看', value: '2' }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
            <template v-slot="scope">
              <div class="button-group">
                <el-button :class="{ 'checki': !getButtonClassAndDisabled(scope.row), 'checked': getButtonClassAndDisabled(scope.row) }" @click="jump(scope.row)" type="text" size="small" style="margin-left: 5px"  :disabled="getButtonClassAndDisabled(scope.row) ">
                  {{translate(scope.row.participated)}}</el-button>
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
      pageSize:10,
      pageNum:1,
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
    handleFilterChange(){

    },
    translate(participant){
      if(participant===null){
        return '报名';
      }else if(participant===true){
        return '查看';
      }else{
        return "参加";
      }
    },
    filterTag(value,row){
      if(!this.getButtonClassAndDisabledForWatch(row)&&row.participated===true){
        return value==='2';
      }
      if(!this.getButtonClassAndDisabledForEnroll(row)&&row.participated===null){
        return value==='1';
      }
      if(!this.getButtonClassAndDisabledForTake(row)&&row.participated===false){
        return value==='0';
      }
    },
    /*
    * 跳转逻辑*/
    jump(row){
      if(row.participated===null){
        this.participate(row);
      }else if(row.participated===true){
        this.watch(row);
      }else{
        this.take(row);
      }
    },
    watch(row){
      const examId=row.exam_id;
      const paperName=row.paper.name;
      this.$router.push({name:'WatchPaper',params:{id: examId,name:paperName}});
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

            },
            params:{
              page_size:9999,
              page_num:0
            }
          }).then(response=>{
        const data=response.data.data;
        this.total=data.records.length;
        this.exams=data.records;
        console.log(this.exams);
        this.fetchPageExams();

      })
    },
    participate(row){
      const exam_id = row.exam_id;

      // 发起报名请求
      axios.post(`/api/exams/enroll/${exam_id}`,
          {exam_id:exam_id},
          {
            method:"POST",
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }})
          .then(response => {
            if(response.data.code=='2003'){
              alert('您等级过低无法报名考试')
            }
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
    getButtonClassAndDisabled(row) {
      console.log(new Date(row.start_time)+" "+new Date());
      //enroll
      if(row.participated===null){
        return this.getButtonClassAndDisabledForEnroll(row);
      }else if(row.participated===true){
        return this.getButtonClassAndDisabledForWatch(row);
      }
      return this.getButtonClassAndDisabledForTake(row);

    },
    // 根据当前时间设置按钮样式
    getButtonClassAndDisabledForWatch(row) {
      if(new Date(row.end_time).getTime()<=new Date().getTime()){
        return false;
      }
      return true;
    },
    getButtonClassAndDisabledForEnroll(row) {
      console.log(new Date().getTime()+" "+new Date(row.start_time).getTime());
      if(new Date(row.start_time).getTime()<new Date().getTime()){
        return true;
      }
      return false;

    },
    getButtonClassAndDisabledForTake(row) {
      const now = new Date().getTime(); // 获取当前时间
      const startTime = new Date(row.start_time).getTime(); // 获取考试开始时间
      const endTime = new Date(row.end_time).getTime(); // 获取考试结束时间

      // 如果当前时间早于开始时间或晚于结束时间，则返回 true，禁用按钮
      if (now < startTime || now > endTime) {
        return true;
      }
      // 否则返回 false，按钮可用
      return false;
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
