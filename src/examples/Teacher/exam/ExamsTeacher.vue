<template>
  <div>
    <!-- 按钮容器 -->
    <div class="buttons-container">
      <button @click="openAddModal" class="btn btn-success" style="margin-left: 2%;">新增考试</button>
      <div  class="input-group" style="margin-bottom: 10px;">
      <input type="text"  class="form-control small-input" v-model="searchKeyword" placeholder="输入关键词搜索" style="margin-left: 2%;">
      <button @click="searchExams" class="btn btn-primary">搜索</button>
      </div>
      <button @click="deleteExam" class="btn btn-danger" style="margin-right: 2%;">删除考试</button>
    </div>
    <!-- 表格容器 -->
    <div class="biaoge ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 3%">
          <col style="width: 6%">
          <col style="width: 34%">
          <col style="width: 7%">
          <col style="width: 7%">
          <col style="width: 16%">
          <col style="width: 16%">
          <col style="width: 11%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">考试ID</th>
            <th scope="col" class="text-center" style="word-break: break-word;">考试名</th>
            <th scope="col" class="text-center" >考试等级</th>
            <th scope="col" class="text-center" >考试时长</th>
            <th scope="col" class="text-center" style="word-break: break-word;">开始时间</th>
            <th scope="col" class="text-center" style="word-break: break-word;">结束时间</th>
            <th scope="col" class="text-center rounded-top-right">考试详情</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个考试项 -->
          <tr v-for="(exam, index) in paginatedExams" :key="index">
        <td class="text-center"><input type="checkbox" v-model="exam.checked"></td>
        <td class="text-center ">{{ exam.id }}</td>
        <td class="text-center " style="word-break: break-word;">{{ exam.name }}</td>
        <td class="text-center ">{{ exam.level }}</td>
        <td class="text-center ">{{ exam.duration }}分钟</td>
        <td class="text-center " style="word-break: break-word;">{{ exam.starttime}}</td>
        <td class="text-center " style="word-break: break-word;">{{ exam.endtime}}</td>
        <td class="text-center ">
          <!-- 查看按钮 -->
          <!-- <button @click="openExamDetails(exam)"  class="btn btn-primary">查看详情</button> -->
          <button @click="openExamDetails(exam)" class="btn btn-primary">查看详情</button>
          <button @click="myWatch(exam.id)" class="btn btn-primary">答题情况</button>
        </td>
      </tr>
        </tbody>
      </table>
    </div>
 <!-- 分页控件 -->
 <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="btn btn-primary" @click="prevPage" style="margin-left: -5%;">上一页</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
          <button class="page-link" @click="gotoPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="btn btn-primary" @click="nextPage"  >下一页</button>
        </li>
      </ul>
    </nav>
<!-- 弹出窗口 -->
<transition name="modal">
  <div class="modal-mask" v-if="showEditModal" @click="closeEditModal">
    <div class="modal-wrapper" @click.stop>
      <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
        <!-- 添加滑动块 -->
        <h3>{{ editMode ? '编辑题目信息' : '新增考试' }}</h3>
        <form @submit.prevent="editMode ? saveExam() : saveNewExam()">
          <label>考试名：</label>
          <input type="text" class="form-control" :value="editMode ? editingExam.name : newExam.name" @input="editMode ? editingExam.name = $event.target.value : newExam.name = $event.target.value"><br>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 48%;">
              <label>考试等级：</label>
              <input type="text" class="form-control" :value="editMode ? editingExam.level : newExam.level" @input="editMode ? editingExam.level = $event.target.value : newExam.level= $event.target.value"><br>
            </div>
            <div style="width: 48%;">
              <label>考试时长：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 100%;" :value="editMode ? editingExam.duration: newExam.duration" @input="editMode ? editingExam.duration = $event.target.value : newExam.duration = $event.target.value">
                <span style="margin: 0 5px;">分钟</span>
              </div>
            </div>
          </div>
          <div>
          <!-- <label>开始时间：</label>
          <input type="text" class="form-control" :value="editMode ? editingExam.starttime : newExam.starttime " @input="editMode ? editingExam.starttime  = $event.target.value : newExam.starttime  = $event.target.value"><br>
          <label>结束时间：</label>
          <input type="text" class="form-control" :value="editMode ? editingExam.endtime : newExam.endtime " @input="editMode ? editingExam.endtime  = $event.target.value : newExam.endtime  = $event.target.value"><br> -->
          <div class="mb-3">
            <label for="start-time" class="form-label">开始时间：</label>
            <input type="text" id="start-time" class="form-control" v-model="newExam.starttime" @focus="openStartPicker">
          </div>

          <!-- 引入结束时间选择器 -->
          <div class="mb-3">
            <label for="end-time" class="form-label">结束时间：</label>
            <input type="text" id="end-time" class="form-control" v-model="newExam.endtime" @focus="openEndPicker">
          </div>
            <label>试卷选择：</label>
            <button type="button" class="btn btn-secondary" @click="selectPaper(newExam)">选择试卷</button>
          </div>
          <div class="button-container">
            <button type="submit" class="btn btn-lg btn-block btn-info">{{'添加'}}</button>
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeEditModal">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</transition>
<transition name="modal">
    <div class="modal-mask" v-if="showExamDetails" @click="closeExamDetails">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
          <h3>考试详情</h3>
          <form>
            <label>考试ID：</label>
            <input type="text" class="form-control" v-model="selectedExam.id" disabled><br>
            <label>考试名：</label>
            <input type="text" class="form-control" v-model="selectedExam.name" :disabled="!editMode"><br>
            <div style="display: flex; justify-content: space-between;">
            <div style="width: 48%;">
              <label>考试等级：</label>
              <input type="text" class="form-control" v-model="selectedExam.level" :disabled="!editMode"><br>
            </div>
            <div style="width: 48%;">
              <label>考试时长：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 100%;"  v-model="selectedExam.duration" :disabled="!editMode">
                <span style="margin: 0 5px;">分钟</span>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="start-time" class="form-label">开始时间：</label>
            <input type="text" id="start-time" class="form-control" v-model="selectedExam.starttime" :disabled="!editMode ? true : false" @focus="openStartPicker">
          </div>

          <!-- 结束时间 -->
          <div class="mb-3">
            <label for="end-time" class="form-label">结束时间：</label>
            <input type="text" id="end-time" class="form-control" v-model="selectedExam.endtime" :disabled="!editMode ? true : false" @focus="openEndPicker">
          </div>
          <!-- 结束 -->
          <label>试卷：</label>
          <select class="form-control" v-model="selectedExam.paper.name" :disabled="!editMode">
            <option v-for="paper in allpapers" :key="paper.id" :value="paper.name">{{ paper.name }}</option>
          </select><br>
            <div class="button-container">
              <button type="button" class="btn btn-lg btn-block btn-info" @click="editMode ? saveExamDetails(selectedExam.paper.name) : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button>
              <button type="button" class="btn btn-lg btn-block btn-warning" @click="editMode ? cancelEdit() : closeExamDetails()">{{ editMode ? '取消修改' : '关闭' }}</button>
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
          <p>请至少选择一场要删除的考试</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeDeleteWarning">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <transition name="modal">
    <div class="modal-mask" v-if="showSelectExam" @click="closeSelectExam">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container">
          <h3>提示</h3>
          <p>请先将试卷基本信息填写完整再选择试题</p>
          <div class="button-container">
            <button type="button" class="btn btn-lg btn-block btn-warning" @click="closeSelectExam">关闭</button>
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
        <h3>{{ editMode ? '编辑题目信息' : '新增考试' }}</h3>
        <form @submit.prevent="editMode ? saveExam() : saveNewExam()">
          <label>考试名：</label>
          <input type="text" class="form-control"  v-model="newExam.name" :disabled="!editMode"><br>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 48%;">
              <label>考试等级：</label>
              <input type="text" class="form-control" v-model="newExam.level" :disabled="!editMode"><br>
            </div>
            <div style="width: 48%;">
              <label>考试时长：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 100%;" v-model="newExam.duration" :disabled="!editMode">
                <span style="margin: 0 5px;">分钟</span>
              </div>
            </div>
          </div>
          <label>开始时间：</label>
          <input type="text" class="form-control"  v-model="newExam.starttime" :disabled="!editMode"><br>
          <label>结束时间：</label>
          <input type="text" class="form-control"  v-model="newExam.endtime" :disabled="!editMode"><br>
          <label>试卷：</label>
            <input type="text" class="form-control"  v-model="newExam.papername" :disabled="!editMode"><br>
          <div class="button-container">
            <button type="submit" class="btn btn-lg btn-block btn-info" @click="addExam(newExam)">{{'添加'}}</button>
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
import SelectPaper from "./SelectPaper.vue";
import axios from 'axios';
import flatpickr from 'flatpickr';
const API_URL = `/api/exam`
export default {
  data() {
    return {
      exams: [
        // { id: 1, name: '小邓的数学考试', examlevel:1 ,examtime:{hours:2,mins:30},paperid: 1, papername: '数学试卷', checked: false },
        // { id: 2, name: '小邓的语文考试', examlevel:2 ,examtime:{hours:1,mins:30},paperid: 2, papername: '语文试卷',checked: false},
        // { id: 3, name: '小邓的英语考试', examlevel:3 ,examtime:{hours:3,mins:2},paperid: 2, papername: '英语试卷',checked: false},
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newExam: { id: '', name: '', level:'',duration:'',starttime:'',endtime:'',paper:[],paperid:'',papername:''},// 新增题目的初始信息
      showExamDetails: false,
      showSelectExam: false,
      selectedExam: { id: '', name: '', level:'',duration:'',starttime:'',endtime:'',paper:[],paperid:'',papername:''},
      allpapers:[],
      pageSize:7,
      currentPage:1,
      totalExams:0,
      searchKeyword: '', // 搜索关键词
    };
  },
  created() {
    // 从路由参数中获取传递的参数值，并填充到文本框中
    this.newExam.name =this.$route.params.tempname1;
    this.newExam.level = this.$route.params.templevel1;
    this.newExam.duration = this.$route.params.tempduration1;
    this.newExam.starttime = this.$route.params.tempstarttime1;
    this.newExam.endtime = this.$route.params.tempendtime1;
    this.newExam.paperid=this.$route.params.temppaper;
    this.newExam.papername=this.$route.params.temppapername;
    this.flag1=this.$route.params.flag;
    console.log(this.newExam);
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
   computed: {
    totalPages() {
      return Math.ceil(this.totalExams / this.pageSize);
    },
  },
  mounted() {
    // 组件加载完成后立即获取题目列表数据
    this.fetchExams();
    this.fetchAllPapers();
  },
  methods: {
    openEditModal(exam) {
      this.editMode = true; // 进入编辑模式
      this.editingExam
      this.editingExam = { ...exam };
      this.showEditModal = true; // 打开编辑窗口
    },
    openAddModal() {
      this.editMode = false; // 进入新增模式
      this.showEditModal = true; // 打开新增用户窗口
    },
    closeEditModal() {
      this.showEditModal = false; // 关闭编辑窗口
      this.editMode = false; // 重置编辑模式
      this.editingExam = null; // 清空编辑用户信息
      this.newExam= { id: '', name: '', level:'',duration:'',starttime:'',endtime:'',paper:[],paperid:'',papername:''},// 新增题目的初始信息 ; // 清空新增用户信息
      this.flag1=false;
    }, 
    openExamDetails(exam) {
      this.selectedExam = { ...exam };
      this.showExamDetails = true;
    },
    closeExamDetails() {
      this.showExamDetails = false;
      this.selectedExam = { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '' };
    },
    saveExam() {
      // 更新编辑用户信息
      const index = this.exams.findIndex(exam => exam.id === this.editingExam.id);
      if (index !== -1) {
        this.exams[index] = { ...this.editingExam };
        console.log('保存用户信息:', this.editingExam);
      } else {
        console.error('Exam not found');
      }
      this.closeEditModal();
    },
    saveNewExam() {
      // 添加新增题目信息到表格数据中
      this.exams.push({ ...this.newExam, id: this.exams.length + 1, checked: false });
      console.log('新增考试信息:', this.newExam);
      this.closeEditModal();
    },
    deleteExam() {
      const selectedExams = this.exams.filter(exam => exam.checked);//
      if (selectedExams.length > 0) {
        const promises = selectedExams.map(exam => {
          // 发送 DELETE 请求到后端删除试题
          return axios.delete(`/api/exams/${exam.id}`, {
            withCredentials: true,
              headers: {
                'Session': sessionStorage.getItem('sessionId'),
                'Content-Type': 'application/json',
              }
          }).then(response => {
            // 删除成功后从前端数据中移除已删除的题目
            const index = this.exams.findIndex(u => u.id === exam.id);
            if (index !== -1) {
              this.exams.splice(index, 1);
              console.log('已删除试卷:', exam);
            }
          }).catch(error => {
            console.error('Error deleting exam:', error);
          });
        });

        // 使用 Promise.all 等待所有删除操作完成
        Promise.all(promises).then(() => {
          console.log('所有选中的考试已删除');
        });
      } else {
        console.log('请至少选择一场要删除的考试');
        this.showDeleteWarning = true;
      }
    },
    closeDeleteWarning() {
      this.showDeleteWarning = false; // 关闭删除提示窗口
    },
    toggleEditMode() {
      this.editMode = !this.editMode; // 切换编辑模式
    },
    async saveExamDetails(selectedPaperName) {
    // 根据选中的试卷名称查找对应的试卷对象
    const selectedPaper = this.allpapers.find(paper => paper.name === selectedPaperName);
        // 如果找到了对应的试卷对象
        if (selectedPaper) {
          const temppaperid = selectedPaper.id; // 获取试卷的ID
          // 在这里执行保存操作，将选中的试卷ID传递给后端或进行其他处理
          const index = this.selectedExam.id;
        try {
      const response = await axios.put(`/api/exams/${index}`,  {
        name: this.selectedExam.name,
        start_time: this.selectedExam.starttime,
        end_time: this.selectedExam.endtime,
        duration: this.selectedExam.duration,
        paper_id: temppaperid,
        level: this.selectedExam.level,
      }, {
        withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
      });
      const responseData = response.data;
      // 处理响应数据
      if (responseData.code === 200) {
        // 成功更新题目信息
        console.log('考试信息更新成功:', responseData.data);
        // 你可能还需要更新本地的题目列表数据或其他相关操作
      } else {
        // 更新失败，处理错误信息
        console.error('考试信息更新失败:', responseData.msg);
      }
    } catch (error) {
      console.error('考试信息更新失败:', error);
    }
      this.editMode = false; // 保存后退出编辑模式

        } else {
          console.error('未找到选中的试卷对象');
        }
    },
    cancelEdit() {
      this.editMode = false; // 退出编辑模式
      // 其他取消修改的逻辑
    },
    // selectQuestions(problemcount)
    // {
    //   if (problemcount>=0) {
    //     this.$router.push(`/SelectQuestions/${problemcount}`);
    //   } else {
    //     console.error(`${problemcount}不合法`);
    //   }
    // }
  selectPaper(newExam) {
  if (newExam.level !='' && newExam.name!='' && newExam.starttime!=''&& newExam.endtime!=''&&newExam.duration!='') {
    this.showEditModal = false; // 关闭编辑窗口
    this.editMode = false; // 重置编辑模式
    this.$router.push({ name: '选择试卷', params: { tempname: newExam.name, templevel:newExam.level, tempduration:newExam.duration,tempstarttime:newExam.starttime, tempendtime:newExam.endtime} });
    // console.log(newExam);
  } else {
    console.error(`试卷基本信息填写不完整`);
    this.showSelectExam = true;
  }
  },
  closeSelectExam() {
      this.showSelectExam = false; // 关闭删除提示窗口
    },
  async fetchExams() {
  try {
    const response = await axios.get('/api/exams', {
      params: {
        page_size: this.pageSize,
        page_num: this.currentPage,
        name_keyword: '', // 添加名称参数
        level:'',
        sort_by_start_time:2,
        participated:'',
      },
      withCredentials: true,
      headers: {
        'Session': sessionStorage.getItem('sessionId'),
        'Content-Type': 'application/json',
      }
    });
    if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
      this.exams = response.data.data.records.map(record => ({
        id: record.exam_id, // 修改属性名为 paper_id
        name: record.name, // 添加试卷名
        starttime:record.start_time,//开始时间
        endtime:record.end_time,//结束时间
        duration:record.duration,//考试时长
        level:record.level,
        paper:record.paper,//内含对应的一张paper的所有信息
        participated:record.participated,//是否参加？
        checked:false,
      }));
      this.$forceUpdate();
      this.totalExams = response.data.data.total;
      this.paginatedExams = this.exams;
      console.log(this.exams);
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
  },
  prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchExams(); 
      }
    },
  nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchExams(); 
      }
    },
  gotoPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchExams(); 
      }
    },
  openStartPicker() {
    flatpickr("#start-time", {
      enableTime: true,
      dateFormat: "Y-m-d H:i:S"
    });
  },
  // 打开结束时间选择器
  openEndPicker() {
    flatpickr("#end-time", {
      enableTime: true,
      dateFormat: "Y-m-d H:i:S"
    });
  },
  async addExam(newExam) {
  // 解析 newPaper.problems 字符串，得到题目序号数组
  const paperid = newExam.paperid;
  console.log(paperid);
  try {
    const exam = {
      name: newExam.name,   
      start_time:newExam.starttime,
      end_time:newExam.endtime,
      duration:parseInt(newExam.duration),
      paper_id:parseInt(paperid),
      level:parseInt(newExam.level),
    };
    console.log(exam);
    // 发送试卷信息给后端的 /exams 接口
    const response = await axios.post('/api/exams', exam, {
      withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
    });
    // 处理返回的响应数据
    console.log('考试添加成功：', response.data);
    // 关闭编辑窗口
    this.closeEditModal();
    // 重新获取试卷数据
    this.fetchExams();
  } catch (error) {
    console.error('添加考试失败：', error);
  }
},
myWatch(id) {
      const exam = this.exams.find(exam => exam.id === id);
      if (exam) {
        // this.$router.push(`/Papers/${paper.id}`);
        this.$router.push({ name: '答题情况', params: {id : exam.id} });
      } else {
        console.error(`Exam with id ${id} not found`);
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
          checked: false,
          problems:[],
        }));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
      },
    async searchExams() {
    try {
    const response = await axios.get('/api/exams', {
      params: {
        page_size: this.pageSize,
        page_num: this.currentPage,
        name_keyword: this.searchKeyword, // 添加名称参数
        level:'',
        sort_by_start_time:2,
        participated:'',
      },
      withCredentials: true,
      headers: {
        'Session': sessionStorage.getItem('sessionId'),
        'Content-Type': 'application/json',
      }
    });
    if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
      this.exams = response.data.data.records.map(record => ({
        id: record.exam_id, // 修改属性名为 paper_id
        name: record.name, // 添加试卷名
        starttime:record.start_time,//开始时间
        endtime:record.end_time,//结束时间
        duration:record.duration,//考试时长
        level:record.level,
        paper:record.paper,//内含对应的一张paper的所有信息
        participated:record.participated,//是否参加？
        checked:false,
      }));
          this.totalExams = response.data.data.total;
          this.paginatedExams = this.exams;
          console.log(this.papers);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
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
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css');
.exam-management-card {
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
.table td,
.table th {
  border-right: 1px solid #dee2e6; /* 添加纵向分隔线 */
}

.table th:last-child,
.table td:last-child {
  border-right: none; /* 最后一列去除右侧分隔线 */
}

.table tbody tr:last-child td:not(:last-child) {
  border-right: 1px solid #dee2e6; /* 右侧边框线 */
  /* border-left: 1px solid #dee2e6; */
}
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
