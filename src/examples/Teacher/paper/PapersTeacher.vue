<template>
  <div>
    <!-- 按钮容器 -->
   <div class="buttons-container">
      <button @click="openAddModal" class="btn btn-success" style="margin-left: 2%;">新增试卷</button>
      <div  class="input-group" style="margin-bottom: 10px;">
      <input type="text"  class="form-control small-input" v-model="searchKeyword" placeholder="输入关键词搜索" style="margin-left: 2%;">
      <button @click="searchPapers" class="btn btn-primary">搜索</button>
      </div>
      <button @click="deletePaper" class="btn btn-danger" style="margin-right: 2%;">删除试卷</button>
    </div>
    <!-- 表格容器 -->
    <div class="biaoge ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 5%">
          <col style="width: 7%">
          <col style="width: 70%">
          <col style="width: 7%">
          <col style="width: 11%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">试卷ID</th>
            <th scope="col" class="text-center" style="word-break: break-word;">试卷名</th>
            <th scope="col" class="text-center" >题目数量</th>
            <th scope="col" class="text-center rounded-top-right">试卷详情</th>
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
        <td class="text-center ">
          <!-- 查看按钮 -->
          <!-- <button @click="openPaperDetails(paper)"  class="btn btn-primary">查看详情</button> -->
          <button @click="myWatch(paper.id)" class="btn btn-primary">查看详情</button>
          <!-- <button @click="myWatch(paper.id)" class="btn btn-primary" style="margin-left: 5px;">修改试卷</button> -->
        </td>
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
<!-- 弹出窗口 -->
<transition name="modal">
  <div class="modal-mask" v-if="showEditModal" @click="closeEditModal">
    <div class="modal-wrapper" @click.stop>
      <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
        <!-- 添加滑动块 -->
        <h3>{{ editMode ? '编辑题目信息' : '新增试卷' }}</h3>
        <form @submit.prevent="editMode ? savePaper() : saveNewPaper()">
          <label>试卷名：</label>
          <input type="text" class="form-control" :value="editMode ? editingPaper.name : newPaper.name" @input="editMode ? editingPaper.name = $event.target.value : newPaper.name = $event.target.value"><br>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 100%;">
              <label>题目个数：</label>
              <input type="text" class="form-control" :value="editMode ? editingPaper.problemcount : newPaper.problemcount" @input="editMode ? editingPaper.problemcount = $event.target.value : newPaper.problemcount= $event.target.value"><br>
            </div>
            <!-- <div style="width: 100%;"> -->
              <!-- <label>考试时间：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 45%;" :value="editMode ? editingPaper.time.hours : newPaper.time.hours" @input="editMode ? editingPaper.time.hours = $event.target.value : newPaper.time.hours = $event.target.value">
                <span style="margin: 0 5px;">时</span>
                <input type="text" class="form-control" style="width: 45%;" :value="editMode ? editingPaper.time.mins: newPaper.time.mins" @input="editMode ? editingPaper.time.mins = $event.target.value : newPaper.time.mins = $event.target.value">
                <span style="margin: 0 5px;">分</span>
              </div> -->
            <!-- </div> -->
          </div>
          <div>
            <label>试题选择：</label>
            <button type="button" class="btn btn-secondary" @click="selectQuestions(newPaper)">选择试题</button>
            <!-- <el-progress
                  :percentage="(3 / newPaper.problemcount) * 100"
                  color="success"
                  :stroke-width="18"
                  :show-text="false"
              /> -->
          </div>
          <div class="button-container">
            <!-- <button type="submit" class="btn btn-lg btn-block btn-info">{{'添加'}}</button> -->
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeEditModal">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>

<transition name="modal">
    <div class="modal-mask" v-if="showPaperDetails" @click="closePaperDetails">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
          <h3>试卷详情</h3>
          <form>
            <label>题目ID：</label>
            <input type="text" class="form-control" v-model="selectedPaper.id" disabled><br>
            <label>分类：</label>
            <input type="text" class="form-control" v-model="selectedPaper.category" :disabled="!editMode"><br>
            <label>题目描述：</label>
            <textarea class="form-control auto-height" v-model="selectedPaper.description" :disabled="!editMode"></textarea><br>
            <label>A：</label>
            <input type="text" class="form-control" v-model="selectedPaper.choiceA" :disabled="!editMode"><br>
            <label>B：</label>
            <input type="text" class="form-control" v-model="selectedPaper.choiceB" :disabled="!editMode"><br>
            <label>C：</label>
            <input type="text" class="form-control" v-model="selectedPaper.choiceC" :disabled="!editMode"><br>
            <label>D：</label>
            <input type="text" class="form-control" v-model="selectedPaper.choiceD" :disabled="!editMode"><br>
            <label>答案：</label>
            <input type="text" class="form-control" v-model="selectedPaper.answer" :disabled="!editMode"><br>
            <div class="button-container">
              <button type="button" class="btn btn-lg btn-block btn-info" @click="editMode ? savePaperDetails() : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button>
              <button type="button" class="btn btn-lg btn-block btn-warning" @click="editMode ? cancelEdit() : closePaperDetails()">{{ editMode ? '取消修改' : '关闭' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>

<transition name="modal">
    <div class="modal-mask" v-if="showDeleteWarning" @click="closeDeleteWarning">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>请至少选择一张要删除的试卷</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeDeleteWarning">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div class="modal-mask" v-if="showSelectPaper" @click="closeSelectPaper">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>请先将试卷基本信息填写完整再选择试题</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeSelectPaper">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- 弹出窗口 ,控制选择完试题后返回时弹出的窗口-->
  <transition name="modal">
  <div class="modal-mask" v-if="flag1" @click="closeEditModal">
    <div class="modal-wrapper" @click.stop>
      <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
        <!-- 添加滑动块 -->
        <h3>{{ editMode ? '编辑题目信息' : '新增试卷' }}</h3>
        <form @submit.prevent="editMode ? savePaper() : saveNewPaper()">
          <label>试卷名：</label>
          <input type="text" class="form-control"  v-model="newPaper.name" :disabled="!editMode"><br>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 100%;">
              <label>题目个数：</label>
              <input type="text" class="form-control" v-model="newPaper.problemcount" :disabled="!editMode"><br>
            </div>
            <!-- <div style="width: 48%;"> -->
              <!-- <label>考试时间：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 45%;" v-model="newPaper.time.hours" :disabled="!editMode">
                <span style="margin: 0 5px;">时</span>
                <input type="text" class="form-control" style="width: 45%;" v-model="newPaper.time.mins" :disabled="!editMode">
                <span style="margin: 0 5px;">分</span>
              </div> -->
            <!-- </div> -->
          </div>
          <div>
            <label>试题集：</label>
            <input type="text" class="form-control"  v-model="newPaper.problems" :disabled="!editMode"><br>
            <span>已选试题：{{ newPaper.problemcount }}/{{ newPaper.problemcount }}</span>
          </div>
          <div class="button-container">
            <button type="submit" class="btn btn-lg btn-block btn-info" @click="addPaper(newPaper)">{{'添加'}}</button>
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeEditModal">取消</button>
          </div>
        </form>
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
  // props: {
  //   problemmax: String,
  //   tempname1: String,
  //   temphours1: String,
  //   tempmins1: String,
  //   tempproblems: Array,
  //   flag: Boolean,
  // },
  data() {
    return {
      papers: [
        // { id: 1, name: '数学试卷', problemcount: 3 ,problems: [{},{},{}],checked: false},
        // { id: 2, name: '语文试卷', problemcount: 3 ,problems: [{},{},{}],checked: false},
        // { id: 3, name: '英语试卷', problemcount: 3 ,problems: [{},{},{}],checked: false},
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newPaper: { id: '', name: '', problemcount: '',problems:[]},// 新增题目的初始信息
      showPaperDetails: false,
      showSelectPaper: false,
      selectedPaper: { id: '', name: '', problemcount: '',problems:[]},
      pageSize:7,
      currentPage:1,
      totalPapers:0,
      searchKeyword: '', // 搜索关键词
      gotoPageNumber: '', // 用于存储跳转的页码
      allpapers:[],
      selectedPapersMap: new Map(),
      searchflag:'',//管理搜索关键词
    //   newPaper2: {
    //     id: '',
    //     name: this.tempname1, // 使用 props 中的 tempname1 值
    //     problemcount: this.problemmax, // 使用 props 中的 problemmax 值
    //     problems: this.tempproblems, // 使用 props 中的 tempproblems 值
    //     time: {
    //       hours: this.temphours1, // 使用 props 中的 temphours1 值
    //       mins: this.tempmins1 // 使用 props 中的 tempmins1 值
    //     }
    //   },
    //   flag1:this.flag,
    };
  },
  created() {
    // 从路由参数中获取传递的参数值，并填充到文本框中
    this.newPaper.name =this.$route.params.tempname1;
    this.newPaper.problemcount = this.$route.params.problemmax;
    // this.newPaper.time.hours = this.$route.params.temphours1;
    // this.newPaper.time.mins = this.$route.params.tempmins1;
    this.newPaper.problems=this.$route.params.tempproblems;
    this.flag1=this.$route.params.flag;
    console.log(this.newPaper);
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalPapers / this.pageSize);
    },
           // 计算属性，仅包含当前页码和前后一个页码
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
    openEditModal(paper) {
      this.editMode = true; // 进入编辑模式
      this.editingPaper
      this.editingPaper = { ...paper };
      this.showEditModal = true; // 打开编辑窗口
    },
    openAddModal() {
      this.editMode = false; // 进入新增模式
      this.showEditModal = true; // 打开新增用户窗口
    },
    closeEditModal() {
      this.showEditModal = false; // 关闭编辑窗口
      this.editMode = false; // 重置编辑模式
      this.editingPaper = null; // 清空编辑用户信息
      this.newPaper = { id: '', name: '', problemcount: '',problems:[],time:{hours:'',mins:''}} ; // 清空新增用户信息
      this.flag1=false;
    }, 
    openPaperDetails(paper) {
      this.selectedPaper = { ...paper };
      this.showPaperDetails = true;
    },
    closePaperDetails() {
      this.showPaperDetails = false;
      this.selectedPaper = { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '' };
    },
    savePaper() {
      // 更新编辑用户信息
      const index = this.papers.findIndex(paper => paper.id === this.editingPaper.id);
      if (index !== -1) {
        this.papers[index] = { ...this.editingPaper };
        console.log('保存用户信息:', this.editingPaper);
      } else {
        console.error('Paper not found');
      }
      this.closeEditModal();
    },
    saveNewPaper() {
      // 添加新增题目信息到表格数据中
      this.papers.push({ ...this.newPaper, id: this.papers.length + 1, checked: false });
      console.log('新增试卷信息:', this.newPaper);
      this.closeEditModal();
      this.flag1=false;
    },
    deletePaper() {
      const selectedPapers = [];
      this.allpapers.forEach(paper => {
      if (this.selectedPapersMap.get(paper.id)) {
        selectedPapers.push(paper.id);
      }
    });
    console.log(selectedPapers);
      if (selectedPapers.length > 0) {
        const promises = selectedPapers.map(paperId => {
          // 发送 DELETE 请求到后端删除试题
          return axios.delete(`/api/papers/${paperId}`, {
            withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
          }).then(response => {
            // 删除成功后从前端数据中移除已删除的题目
            const index = this.papers.findIndex(u => u.id === paperId);
            if (index !== -1) {
              this.papers.splice(index, 1);
              console.log('已删除试卷:', paper);
            }
          }).catch(error => {
            console.error('Error deleting paper:', error);
          });
        });
        // 使用 Promise.all 等待所有删除操作完成
        Promise.all(promises).then(() => {
          console.log('所有选中的试卷已删除');
          this.selectedPapersMap.clear(); // 清空选中题目的 Map
          this.showDeleteWarning = false; // 重置删除警告状态
          this.fetchPapers();
        });
      } else {
        console.log('请至少选择一个要删除的试卷');
        this.showDeleteWarning = true;
      }
    },
    closeDeleteWarning() {
      this.showDeleteWarning = false; // 关闭删除提示窗口
    },
    toggleEditMode() {
      this.editMode = !this.editMode; // 切换编辑模式
    },
    savePaperDetails() {
      // 找到当前选择题目在papers数组中的索引
      const index = this.papers.findIndex(paper => paper.id === this.selectedPaper.id);
      if (index !== -1) {
        // 更新当前选择题目的信息
        this.papers[index] = { ...this.selectedPaper };
        console.log('保存问题：', this.selectedPaper);
      } else {
        console.error('题目未找到');
      }
      this.editMode = false; // 保存后退出编辑模式
    },
    cancelEdit() {
      this.editMode = false; // 退出编辑模式
      // 其他取消修改的逻辑
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
    // selectQuestions(problemcount)
    // {
    //   if (problemcount>=0) {
    //     this.$router.push(`/SelectQuestions/${problemcount}`);
    //   } else {
    //     console.error(`${problemcount}不合法`);
    //   }
    // }
  selectQuestions(newPaper) {
  if (newPaper.problemcount !='' && newPaper.name!='') {
    this.showEditModal = false; // 关闭编辑窗口
    this.editMode = false; // 重置编辑模式
    this.$router.push({ name: '选择试题', params: { tempname: newPaper.name, tempproblemcount:newPaper.problemcount} });
    // console.log(newPaper);
  } else {
    console.error(`试卷基本信息填写不完整`);
    this.showSelectPaper = true;
  }
  },
  closeSelectPaper() {
      this.showSelectPaper = false; // 关闭删除提示窗口
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
          // checked: false,
          checked: this.selectedPapersMap.get(record.paper_id) || false,
          problems:[],
        }));
        this.$forceUpdate();
        this.totalPapers = response.data.data.total;
      this.paginatedPapers = this.papers;
        console.log(this.papers);
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
  async addPaper(newPaper) {
  // 解析 newPaper.problems 字符串，得到题目序号数组
  const problemIds = newPaper.problems.split(',').map(id => parseInt(id.trim()));
  try {
    // 依次发送请求获取每个题目的具体信息
    const problemsPromises = problemIds.map(async (question_id) => {
      const response = await axios.get(`/api/questions/${question_id}`, {
        withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
      });
      return response.data.data; // 返回题目信息对象
    });

    // 等待所有题目信息请求完成
    const problems = await Promise.all(problemsPromises);
    console.log(problems);
    // 构建完整的试卷对象
    const paper = {
      name: newPaper.name,
      question_num: newPaper.problemcount,
      questions: problems
    };
    // 发送试卷信息给后端的 /papers 接口
    const response = await axios.post('/api/papers', paper, {
      withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
    });
    // 处理返回的响应数据
    console.log('试卷添加成功：', response.data);
    // 关闭编辑窗口
    this.closeEditModal();
    // 重新获取试卷数据
    // this.fetchPapers();
    this.totalPapers += 1;
      // 计算新题目所在页码
      const totalPages = Math.ceil(this.totalPapers / this.pageSize);
      const lastPage = totalPages === 0 ? 1 : totalPages;
      
      // 如果新增题目所在页码不是当前页码，则跳转到最后一页
      if (lastPage !== this.currentPage) {
        this.currentPage = lastPage;
        this.fetchPapers();
      } else {
        // 否则，滚动到最后一页
        window.scrollTo(0, document.body.scrollHeight);
      }
  } catch (error) {
    console.error('添加试卷失败：', error);
  }
      },
      async searchPapers() {
        this.searchflag = this.searchKeyword;
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
          // checked: false,
          checked: this.selectedPapersMap.get(record.paper_id) || false,
          problems:[],
        }));
          this.totalPapers = response.data.data.total;
          this.paginatedPapers = this.papers;
          console.log(this.papers);
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
  handlePaperSelection(paper) {
      this.selectedPapersMap.set(paper.id, paper.checked);
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
/* 最后一列去除右侧分隔线 */
.table th:last-child,
.table td:last-child {
  border-right: none; 
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
