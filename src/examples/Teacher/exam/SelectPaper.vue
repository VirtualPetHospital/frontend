
<template>
  <div>
    <div class="buttons-container">
      <div  class="input-group" style="margin-bottom: 10px;">
      <input type="text"  class="form-control small-input" v-model="searchKeyword" placeholder="输入试卷名关键词搜索" style="margin-left: 2%;">
      <button @click="searchPapers" class="btn btn-primary">搜索</button>
      </div>
    </div>
    <!-- 表格容器 -->
    <div class="biaoge ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 7%">
          <col style="width: 10%">
          <col style="width: 73%">
          <col style="width: 10%">
          <!-- <col style="width: 11%"> -->
        </colgroup>
        <thead>
          <tr>
          <th colspan="5">
            <div class="selected-papers">
              <span>已选试卷：{{ selectedCount }}/{{1}}
              <div class="progress">
                <div class="progress-bar" :style="{ width: progressWidth }"></div>
              </div>
            </span>
            </div>
            <div class="button-container" style="height: 100%;">
            <button @click="upPaper()" class="btn btn-lg btn-block btn-warning" style="height: 100%;">确定试卷</button>
            </div>
              </th>
          </tr>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">试卷ID</th>
            <th scope="col" class="text-center" style="word-break: break-word;">试卷名</th>
            <th scope="col" class="text-center" >题目数量</th>
            <!-- <th scope="col" class="text-center rounded-top-right">试卷详情</th> -->
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个考试项 -->
          <tr v-for="(paper, index) in paginatedPapers" :key="index">
            <td class="text-center">
              <input type="checkbox" v-model="paper.checked" @change="handlePaperSelection(paper)">
            </td>
            <td class="text-center ">{{ paper.id }}</td>
        <td class="text-center " style="word-break: break-word;">{{ paper.name }}</td>
        <td class="text-center " >{{ paper.problemcount }}</td>
        <!-- <td class="text-center "> -->
          <!-- 查看按钮 -->
          <!-- <button @click="openPaperDetails(paper)"  class="btn btn-primary">查看详情</button> -->
          <!-- <button @click="myWatch(paper.id)" class="btn btn-primary">查看详情</button> -->
          <!-- <button @click="myWatch(paper.id)" class="btn btn-primary" style="margin-left: 5px;">修改试卷</button> -->
        <!-- </td> -->
      </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页控件 -->
<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <!-- 上一页按钮 -->
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <button class="btn btn-primary" @click="prevPage" style="margin-left: -5%;">上一页</button>
    </li>

    <!-- 仅显示当前页码和前后一个页码 -->
    <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
      <button class="page-link" @click="gotoPage(page)">{{ page }}</button>
    </li>

    <!-- 下一页按钮 -->
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <button class="btn btn-primary" @click="nextPage">下一页</button>
    </li>
    <li>
      <span class="input-group-text">页数: {{ currentPage }}/{{ totalPages }}</span>
    </li>
    
  </ul>
</nav>
  <!-- 使用网格系统将跳转框固定在最右侧 -->
  <div class="row" style="margin-top: -6.12%;">
  <div class="col-md-6 ml-auto" style="margin-left: 75%;">
    <div class="input-group" style="margin-bottom: 10px;">
      <input type="text" class="form-control small-input" v-model="gotoPageNumber" placeholder="输入页码">
      <div class="input-group-append">
        <button @click="gotoSpecifiedPage" class="btn btn-primary">跳转</button>
        <!-- 将"页数"文本内容放置在跳转按钮的附加内容中 -->
      </div>
    </div>
  </div>
</div>
<transition name="modal">
    <div class="modal-mask" v-if="showSearchWarning" @click="closeSearchWarning">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>未搜索到满足条件的试卷</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeSearchWarning">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>


<script>
import ArgonBadge from "@/components/ArgonBadge.vue";
import ArgonButton from "@/components/ArgonButton.vue";
// import ArgonAlert from "@/components/ArgonAlert.vue";
import Modal from "@/components/Modal.vue";
import { ref, Vue } from 'vue';
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router"; // 导入Vue
import {ElButton, ElPagination, ElProgress, ElTable, ElTableColumn} from "element-plus";
import axios from 'axios';
const API_URL = `/api/paper`
export default {
  data() {
    return {
      papers: [
        // { id: 1, name: '数学试卷', problemcount: 3 ,problems: [{},{},{}],time: {hours: 2,mins: 30},checked: false },
        // { id: 2, name: '语文试卷', problemcount: 3 ,problems: [{},{},{}],time: {hours: 1,mins: 30},checked: false},
        // { id: 3, name: '英语试卷', problemcount: 3 ,problems: [{},{},{}],time: {hours: 3,mins: 2},checked: false},
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newPaper: { id: '', name: '', problemcount: '',problems:[]},// 新增题目的初始信息
      showPaperDetails: false,
      showSelectPaper: false,
      selectedPaper: { id: '', name: '', problemcount: '',problems:[]},
      temppaper:0,
      temppapername:'',
      pageSize:8,
      currentPage:1,
      totalPapers:0,
      selectedPapersMap: new Map(),
      selectedCount: 0, // 已选试题数量
      templevel1:'', 
      tempname1:'',
      tempstarttime1:'',
      tempendtime1:'',
      tempduration1:'',
      flag1:true,
      allpapers:[],
      tempselepaperid:0,
      tempselepapername:'',
      searchKeyword: '', // 搜索关键词
      gotoPageNumber: '', // 用于存储跳转的页码
      searchflag:'',//管理搜索关键词
      showSearchWarning:false,
    };
  },
  created() {
    // 从路由参数中获取传递的参数值，并填充到文本框中
  this.tempname1=this.$route.params.tempname;
  this.templevel1 = this.$route.params.templevel;
  this.tempduration1 = this.$route.params.tempduration;
  this.tempstarttime1=this.$route.params.tempstarttime;
  this.tempendtime1=this.$route.params.tempendtime;
  console.log(this.tempname1);
  },
  watch: {
    // 监听已选试题数量的变化
    selectedCount(newValue) {
      // 更新动态进度条的宽度
      this.progressWidth = (newValue ) * 100 + '%';
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalPapers / this.pageSize);
    },
    visiblePages() {
      const pages = [this.currentPage];
      if (this.currentPage > 1) {
        pages.unshift(this.currentPage - 1); // 前一个页码
      }
      if (this.currentPage < this.totalPages) {
        pages.push(this.currentPage + 1); // 后一个页码
      }
      return pages;
    },
  },
  setup() {
     const store = useStore();
     // 在组件被挂载后，设置 showSidenavStudent 为 true
     store.commit('setShowSidenavTeacher', true);
     onBeforeRouteLeave((to, from, next) => {
       // 在离开此页前关闭sidenavadmin
       store.commit('setShowSidenavTeacher', false);
       next();
     });
     return {};
   },
   mounted() {
    // 组件加载完成后立即获取题目列表数据
    this.fetchPapers();
    this.fetchAllPapers();
  },
  methods: {
    openPaperDetails(paper) {
      this.selectedPaper = { ...paper };
      this.showPaperDetails = true;
    },
    closePaperDetails() {
      this.showPaperDetails = false;
      this.selectedPaper = { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '' };
    },
    deletePaper() {
      const selectedPapers = this.papers.filter(paper => paper.checked);
      if (selectedPapers.length > 0) {
        // 删除选中的题目信息
        selectedPapers.forEach(paper => {
          const index = this.papers.findIndex(u => u.id === paper.id);
          if (index !== -1) 
          {
            this.papers.splice(index, 1);
            console.log('已删除题目:', paper);
          }
        });
      } else {
        console.log('请至少选择一个要删除的题目');
        this.showDeleteWarning = true;
      }
    },
    handlePaperSelection(paper) {
      // this.selectedCount = this.papers.filter(p => p.checked).length;
      this.selectedCount += paper.checked ? 1 : -1;
      // 如果已选试题数量达到上限，则取消当前选中的复选框并弹出提示
      if (this.selectedCount > 1 && paper.checked) {
        paper.checked = false;
        alert('请不要选择多个试卷');
        this.selectedCount--;
        return ;
      }
      this.selectedPapersMap.set(paper.id, paper.checked);
    // 更新动态进度条的宽度
    this.progressWidth = (this.selectedCount ) * 100 + '%';
  },
    myWatch(id) {
      const paper = this.papers.find(paper => paper.id === id);
      if (paper) {
        this.$router.push(`/papers/${paper.id}`);
      } else {
        console.error(`Paper with id ${id} not found`);
      }
    },
    upPaper() {
    if (this.selectedCount < 1) {
      // 选题数量未达到要求，弹出提示继续选题
      alert('未选择试卷，请选择');
    } else if (this.selectedCount == 1) {
      // 选题成功，弹出提示
      alert('选择试卷成功！');
        // 其他处理逻辑
    this.allpapers.forEach(paper => {
      if (this.selectedPapersMap.get(paper.id)) {
        this.tempselepaperid=paper.id;
        this.tempselepapername=paper.name;
      }
    });
    this.$router.push({
      name: '管理考试', // 跳转回之前的页面的名称
      params: {
        templevel1: this.templevel1,
        tempname1: this.tempname1,
        tempduration1: this.tempduration1,
        tempstarttime1: this.tempstarttime1,
        tempendtime1:this.tempendtime1,    
        temppaper: this.tempselepaperid, 
        temppapername: this.tempselepapername, 
        flag: this.flag1,
      }
    });
    }
  },
  async fetchPapers() {
    try {
      const response = await axios.get('/api/papers', {
        params: {
          page_size: this.pageSize,
          page_num: this.currentPage,
          name: this.searchflag, // 添加名称参数
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        this.papers = response.data.data.records.map(record => ({
          id: record.paper_id, // 修改属性名为 paper_id
          name: record.name, // 添加试卷名
          problemcount: record.question_num, // 需要前端提供的题目数
          checked: this.selectedPapersMap.get(record.paper_id) || false,
          problems:[],
        }));
        this.$forceUpdate();
        this.totalPapers = response.data.data.total;
      this.paginatedPapers = this.papers;
        console.log(this.paginatedPapers);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchPapers(); // 调用 fetchProblems 获取新页数据
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchPapers(); // 调用 fetchProblems 获取新页数据
      }
    },
    gotoPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchPapers(); // 调用 fetchProblems 获取新页数据
      }
    },
    myWatch(id) {
      const paper = this.papers.find(paper => paper.id === id);
      if (paper) {
        // this.$router.push(`/Papers/${paper.id}`);
        this.$router.push({ name: '查看试卷', params: {id : paper.id} });
      } else {
        console.error(`Paper with id ${id} not found`);
      }
    },
    async fetchAllPapers() {
    try {
      const response = await axios.get('/api/papers', {
        params: {
          page_size: 200, // 获取所有题目数据
          page_num: 1, // 获取第一页数据
          name: '', // 添加名称参数
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        this.allpapers = response.data.data.records.map(record => ({
          id: record.paper_id, // 修改属性名为 paper_id
          name: record.name, // 添加试卷名
          problemcount: record.question_num, // 需要前端提供的题目数
          checked: this.selectedPapersMap.get(record.paper_id) || false,
          problems:[],
        }));
        console.log(this.allproblems);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },
  async searchPapers() {
        this.searchflag = this.searchKeyword;
        try {
      const response = await axios.get('/api/papers', {
        params: {
          page_size: this.pageSize,
          page_num: 1,
          name: this.searchflag, // 添加名称参数
        },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      });
      if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
        this.papers = response.data.data.records.map(record => ({
          id: record.paper_id, // 修改属性名为 paper_id
          name: record.name, // 添加试卷名
          problemcount: record.question_num, // 需要前端提供的题目数
          // checked: false,
          checked: this.selectedPapersMap.get(record.paper_id) || false,
          problems:[],
        }));
          this.totalPapers = response.data.data.total;
          this.gotoPage(1);
          this.paginatedPapers = this.papers;
          console.log(this.papers);
          if(this.papers == '')
          {
            this.showSearchWarning = true;
          }
          else if(this.searchflag == '')
          {
            alert(`显示全部列表，共有 ${this.totalPapers} 条结果`);
          }
          else
          {
            alert(`搜索成功，共有 ${this.totalPapers} 条结果`);
          }
        }
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    },
    gotoSpecifiedPage() {
    const pageNumber = parseInt(this.gotoPageNumber); // 将输入的字符串转换为整数
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages) {
      // 如果输入的是一个有效的页码，则跳转到该页
      this.gotoPage(pageNumber);
    } else {
      // 如果输入的页码无效，则给出提示或者不执行任何操作，根据需求决定
      console.error('Invalid page number');
    }
    // 清空输入框内容
    this.gotoPageNumber = '';
  },
  closeSearchWarning()
  {
    this.showSearchWarning = false;
  },
  },
  components: {
    ArgonBadge,
    ArgonButton,
    Modal,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
    ElProgress
  }
};
</script>

<style scoped>
.paper-management-card {
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.role-play-title {
  font-size: 36px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
  text-align: center;
}
/* 按钮样式调整 */
.btn-success {
  margin-left: 2%; /* 新增按钮向右微调 */
}

.btn-danger {
  margin-right: 2%; /* 删除按钮向左微调 */
}
table {
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
}
.buttons-container {
  display: flex;
  justify-content: space-between;
}
/* 弹出窗口样式 */
.modal-mask {
position: fixed;
z-index: 9998;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.modal-wrapper {
width: 100%;
}

.modal-container {
padding: 20px;
background-color: #ffffff;
border-radius: 5px;
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
width: 40%; /* 设置弹窗宽度 */
left: 20%; /* 设置弹窗左侧距离为页面宽度的40% */
}

.modal-container h3 {
margin-bottom: 15px;
}

.modal-container label {
display: block;
margin-bottom: 10px;
}

.modal-container input {
width: calc(100% - 10px);
margin-bottom: 10px;
}
.modal-container .button-container {
  display: flex;
  justify-content: center; /* 让按钮居中 */
  width: 100%; /* 让容器宽度和弹窗一样 */
  box-sizing: border-box; /* 包含内边距和边框在内的容器大小 */
}

.modal-container .button-container button {
  margin: 0 10%; /* 调整按钮之间的间距 */
}
/* 纵向分隔线样式 */
/* .table td,
.table th {
  border-right: 1px solid #dee2e6; 
} */

.table th:last-child,
.table td:last-child {
  border-right: none; /* 最后一列去除右侧分隔线 */
}
/* 右侧边框线 */
/* .table tbody tr:last-child td:not(:last-child) {
  border-right: 1px solid #dee2e6; 
} */
.table td {
  white-space: pre-wrap;
}
/* 滑动块样式 */
.scrollbar {
  position: absolute;
  right: 0;
  top: 0;
  width: 10px; /* 滑动块宽度 */
  height: 100%; /* 滑动块高度 */
  background-color: #ccc; /* 滑动块颜色 */
  cursor: pointer; /* 鼠标样式 */
}

/* 设置滑动块圆角 */
.scrollbar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 30px; /* 滑动块高度 */
  background-color: #888; /* 滑动块颜色 */
  border-radius: 3px; /* 滑动块圆角 */
}
.auto-height {
  min-height: 100px; /* 设置文本框的最小高度 */
  max-height: 300px; /* 设置文本框的最大高度 */
  resize: none; /* 禁止用户调整文本框的大小 */
  overflow-y: auto; /* 当文本内容超出文本框高度时，显示滚动条 */
}
.selected-papers {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.progress {
  width: 200px;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #007bff;
  transition: width 0.5s ease; /* 进度条动画效果 */
}
.small-input {
  height: 40px; /* 设置输入框高度为 30px */
  max-width: 200px; /* 设置输入框的最大宽度为 200px */
  width: 50%; /* 设置输入框宽度为父元素宽度的 50% */
}
.btn-success,
.btn-primary,
.btn-danger {
  height: 40px; /* 设置按钮高度为 40px */
  width: auto; /* 让按钮宽度自适应内容 */
  padding: 0 15px; 
  white-space: nowrap; /* 防止按钮文字换行 */
}
</style>
