<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>学习历史</h3>
        <el-table :data="pageRecords" stripe style="margin-top: 20px" >
          <el-table-column prop="medcase_id" label="病例ID"></el-table-column>
          <el-table-column prop="name" label="病例名称"></el-table-column>
          <el-table-column tooltip-effect=“dark” id="mycol" prop="info_description" label="信息描述" ></el-table-column>
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
      </div>
    </div>
  </div>
</template>
<script>

import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {ElPagination,ElTable, ElTableColumn} from "element-plus";
import axios from "axios";
export default{
  name:"LearnHistory",
  components:{
    ElTable,
    ElPagination,
    ElTableColumn
  },
  data(){
    return{
      pageNum: 1,
      pageSize: 10,
      total: 0,
      records: [],
      pageRecords:[]
    }
  },
  created() {
    this.fetchLearnHistory();
  },
  methods:{
    async fetchLearnHistory() {
        try {
          const response = await axios.get("/api/users/medcases", {
            params: {
              user_id: sessionStorage.getItem('user_id'),
              page: this.pageNum,
              size: this.pageSize,
            },

            withCredentials : true,
                headers:{
            'Session':sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',

          }
          });
          const data=response.data.data;


            this.total = data.total; // 更新总记录数
            this.records = data.records; // 更新记录数据
            this.fetchPageLearnHistory(); // 更新当前页数据

        } catch (error) {
          console.error("Error fetching learn history:", error);
          throw error;
        }

      },
    jumpToMedcase(medcaseId){
      this.$router.push({name:'Medcase',params:{medcaseId:medcaseId}});
    },
      fetchLearnHistoryMock()
      {
        const mockData = {
          total: 50, // 模拟总记录数
          records: []
        };

        // 生成50条模拟记录
        for (let i = 1; i <= 50; i++) {
          mockData.records.push({
            medcase_id: i,
            name: `病例 ${i}`,
            info_description: `这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。这是病例 ${i} 的信息描述。`
          });
        }
        this.total = mockData.total;
        this.records = mockData.records;
        this.fetchPageLearnHistory();
      },
      fetchPageLearnHistory()
      {
        this.pageRecords = [];
        for (let i = (this.pageNum - 1) * this.pageSize; i < this.total; i++) {
          //把遍历的数据添加到pageTicket里面
          this.pageRecords.push(this.records[i]);
          //判断是否达到一页的要求
          if (this.pageRecords.length === this.pageSize) break;
        }
      },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchPageLearnHistory();
    },
    // 分页 current 变化
    handleCurrentChange(pageNum) { // 处理页码改变事件
      this.pageNum = pageNum; // 更新当前页码
      this.fetchPageLearnHistory(); // 重新获取数据
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
  margin-left: 15px;
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
.el-table-column .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card.p-4{
  margin-left: 5px;
}
#mycol /deep/ .el-tooltip__popper{ max-width:50% }
</style>
