<template >
  <div class="card p-4" style="height: auto" >
    <div class=" row">
      <div class="col-12">
        <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
        <h3 style="margin-top: 20px">搜索结果</h3>

        <el-card class="custom-elcard">
          <el-table :data="pageMedCases" stripe style="margin-top: 20px">
            <el-table-column prop="medcase_id" label="病例ID" width="100"></el-table-column>
            <el-table-column prop="name" label="病例名称"></el-table-column>
            <el-table-column prop="info_description" label="病例简介"></el-table-column>
            <el-table-column label="查看病例详情">
              <template v-slot="scope">
                <el-button type="text" class="custom-button" @click="jumpToMedcase(scope.row.medcase_id)">查看</el-button>
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
import axios from "axios";
import {ElButton, ElCard, ElPagination, ElTable, ElTableColumn} from "element-plus";

export default {
  name:"SearchMedcase",
  components:{

    ElTable,
    ElPagination,
    ElTableColumn,
    // eslint-disable-next-line no-undef
    ElCard,
    ElButton,

  },
  created() {
    this.searchText=this.$route.query.searchText;
    console.log(name,this.searchText);
    this.fetchAndMergeMedcaseSearch(this.searchText);
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
      searchText:'',
      medCases: [] ,// 用于存储从后端获取的病例数据
      pageMedCases:[],
      pageSize: 10, // 设置默认的分页大小
      pageNum: 1, // 设置默认的页码
      total:0,
      diseaseNameResults:null,
      nameKeywordResults:null,
      infoKeywordResults:null,


    }
  },
  methods: {
    backto(){
      this.$router.push({path: '/Category'});
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
    fetchAndMergeMedcaseSearch(text) {
      axios.get(
          '/api/medcases',
          {
            params: {
              info_keyword: text
            },
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          }
      ).then(response => {
        this.infoKeywordResults = response.data.data.records;
        this.medCases = this.infoKeywordResults;
        this.total = this.medCases.length;

        console.log(this.medCases);
        console.log(this.infoKeywordResults);
      });
      axios.get(
          '/api/medcases',
          {
            params: {
              name_keyword: text
            },
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          }
      ).then(response => {
        this.nameKeywordResults = response.data.data.records;
        this.medCases = Object.assign(this.medCases,this.nameKeywordResults);
        this.total = this.medCases.length;

        console.log(this.medCases);
        console.log(this.nameKeywordResults);
      });
      axios.get(
          '/api/medcases',
          {
            params: {
              disease_name: text
            },
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          }
      ).then(response => {
        this.diseaseKeywordResults = response.data.data.records;
        this.medCases =Object.assign(this.medCases, this.diseaseKeywordResults);
        this.total = this.medCases.length;
        this.getPageMedCases();
        console.log(this.medCases);
        console.log(this.diseaseKeywordResults);
      });

    },
    getPageMedCases() {
      this.pageMedCases = [];
      for (let i = (this.pageNum - 1) * this.pageSize; i < this.total; i++) {
        //把遍历的数据添加到pageTicket里面
        this.pageMedCases.push(this.medCases[i]);
        //判断是否达到一页的要求
        if (this.pageMedCases.length === this.pageSize) break;
      }
      console.log(this.pageMedCases);
    },
    jumpToMedcase(medcaseId) {
      this.$router.push({name: 'Medcase', params: {medcaseId: medcaseId}});
    },
  }
}
</script>
<style scoped>
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