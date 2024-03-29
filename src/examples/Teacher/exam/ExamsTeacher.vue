<template>
  <div>
    <!-- 按钮容器 -->
    <div class="buttons-container">
      <button @click="openAddModal" class="btn btn-success" style="margin-left: 2%;">新增考试</button>

      <button @click="deleteExam" class="btn btn-danger" style="margin-right: 2%;">删除考试</button>
    </div>
    <!-- 表格容器 -->
    <div class="biaoge ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 5%">
          <col style="width: 7%">
          <col style="width: 63%">
          <col style="width: 7%">
          <col style="width: 7%">
          <col style="width: 11%">
        </colgroup>
        <thead>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">考试ID</th>
            <th scope="col" class="text-center">考试名</th>
            <th scope="col" class="text-center" style="word-break: break-word;">考试等级</th>
            <th scope="col" class="text-center" style="word-break: break-word;">考试时间</th>
            <th scope="col" class="text-center rounded-top-right">考试详情</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个考试项 -->
          <tr v-for="(exam, index) in exams" :key="index">
        <td class="text-center"><input type="checkbox" v-model="exam.checked"></td>
        <td class="text-center ">{{ exam.id }}</td>
        <td class="text-center ">{{ exam.name }}</td>
        <td class="text-center " style="word-break: break-word;">{{ exam.examlevel }}</td>
        <td class="text-center " style="word-break: break-word;">{{ exam.examtime.hours }}时{{ exam.examtime.mins }}分钟</td>
        <td class="text-center ">
          <!-- 查看按钮 -->
          <!-- <button @click="openExamDetails(exam)"  class="btn btn-primary">查看详情</button> -->
          <button @click="openExamDetails(exam)" class="btn btn-primary">查看详情</button>
        </td>
      </tr>
        </tbody>
      </table>
    </div>

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
              <input type="text" class="form-control" :value="editMode ? editingExam.examlevel : newExam.examlevel" @input="editMode ? editingExam.examlevel = $event.target.value : newExam.examlevel= $event.target.value"><br>
            </div>
            <div style="width: 48%;">
              <label>考试时间：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 45%;" :value="editMode ? editingExam.examtime.hours : newExam.examtime.hours" @input="editMode ? editingExam.examtime.hours = $event.target.value : newExam.examtime.hours = $event.target.value">
                <span style="margin: 0 5px;">时</span>
                <input type="text" class="form-control" style="width: 45%;" :value="editMode ? editingExam.examtime.mins: newExam.examtime.mins" @input="editMode ? editingExam.examtime.mins = $event.target.value : newExam.examtime.mins = $event.target.value">
                <span style="margin: 0 5px;">分</span>
              </div>
            </div>
          </div>
          <div>
            <label>试卷选择：</label>
            <button type="button" class="btn btn-secondary" @click="selectPaper(newExam)">选择试卷</button>
            <!-- <el-progress
                  :percentage="(3 / newExam.problemcount) * 100"
                  color="success"
                  :stroke-width="18"
                  :show-text="false"
              /> -->
          </div>
          <div class="button-container">
            <button type="submit" class="btn btn-lg btn-block btn-primary">{{'添加'}}</button>
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
            <label>考试等级：</label>
            <input type="text" class="form-control" v-model="selectedExam.examlevel" :disabled="!editMode"><br>
            <label>考试时间：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" v-model="selectedExam.examtime.hours" :disabled="!editMode"><br>
                <span style="margin: 0 5px;">时</span>
                <input type="text" class="form-control" v-model="selectedExam.examtime.mins" :disabled="!editMode"><br>
                <span style="margin: 0 5px;">分</span>
              </div>
            <label>试卷：</label>
            <input type="text" class="form-control" v-model="selectedExam.papername" :disabled="!editMode"><br>
            <button type="button" class="btn btn-secondary" v-if="editMode" @click="selectPaper(selectedExam)">重选试卷</button>
            <div class="button-container">
              <button type="button" class="btn btn-lg btn-block btn-primary" @click="editMode ? saveExamDetails() : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button>
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
          <p>请至少选择一张要删除的试卷</p>
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
              <input type="text" class="form-control" v-model="newExam.examlevel" :disabled="!editMode"><br>
            </div>
            <div style="width: 48%;">
              <label>考试时间：</label>
              <div style="display: flex; align-items: center;">
                <input type="text" class="form-control" style="width: 45%;" v-model="newExam.examtime.hours" :disabled="!editMode">
                <span style="margin: 0 5px;">时</span>
                <input type="text" class="form-control" style="width: 45%;" v-model="newExam.examtime.mins" :disabled="!editMode">
                <span style="margin: 0 5px;">分</span>
              </div>
            </div>
          </div>
          <div>
            <label>试卷：</label>
            <input type="text" class="form-control"  v-model="newExam.papername" :disabled="!editMode"><br>
          </div>
          <div class="button-container">
            <button type="submit" class="btn btn-lg btn-block btn-primary">{{'添加'}}</button>
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
const API_URL = `/api/exam`
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
      exams: [
        { id: 1, name: '小邓的数学考试', examlevel:1 ,examtime:{hours:2,mins:30},paperid: 1, papername: '数学试卷', checked: false },
        { id: 2, name: '小邓的语文考试', examlevel:2 ,examtime:{hours:1,mins:30},paperid: 2, papername: '语文试卷',checked: false},
        { id: 3, name: '小邓的英语考试', examlevel:3 ,examtime:{hours:3,mins:2},paperid: 2, papername: '英语试卷',checked: false},
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newExam: { id: '', name: '', examlevel: '',examtime:{hours:'',mins:''},paperid:'',papername:''},// 新增题目的初始信息
      showExamDetails: false,
      showSelectExam: false,
      selectedExam: { id: '', name: '', examlevel: '',examtime:{hours:'',mins:''},paperid:'',papername:''},
    //   newExam2: {
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
    this.newExam.name =this.$route.params.tempname1;
    this.newExam.examlevel = this.$route.params.tempexamlevel1;
    this.newExam.examtime.hours = this.$route.params.temphours1;
    this.newExam.examtime.mins = this.$route.params.tempmins1;
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
      this.newExam = { id: '', name: '', problemcount: '',problems:[],time:{hours:'',mins:''}} ; // 清空新增用户信息
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
      const selectedExams = this.exams.filter(exam => exam.checked);
      if (selectedExams.length > 0) {
        // 删除选中的题目信息
        selectedExams.forEach(exam => {
          const index = this.exams.findIndex(u => u.id === exam.id);
          if (index !== -1) 
          {
            this.exams.splice(index, 1);
            console.log('已删除考试:', exam);
          }
        });
      } else {
        console.log('请至少选择一个要删除的考试');
        this.showDeleteWarning = true;
      }
    },
    closeDeleteWarning() {
      this.showDeleteWarning = false; // 关闭删除提示窗口
    },
    toggleEditMode() {
      this.editMode = !this.editMode; // 切换编辑模式
    },
    saveExamDetails() {
      // 找到当前选择题目在exams数组中的索引
      const index = this.exams.findIndex(exam => exam.id === this.selectedExam.id);
      if (index !== -1) {
        // 更新当前选择题目的信息
        this.exams[index] = { ...this.selectedExam };
        console.log('保存问题：', this.selectedExam);
      } else {
        console.error('题目未找到');
      }
      this.editMode = false; // 保存后退出编辑模式
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
  if (newExam.examlevel !='' && newExam.name!='' && newExam.examtime.hours!=''&& newExam.examtime.mins!='') {
    this.showEditModal = false; // 关闭编辑窗口
    this.editMode = false; // 重置编辑模式
    this.$router.push({ name: '选择试卷', params: { tempname: newExam.name, tempexamlevel:newExam.examlevel, temphours:newExam.examtime.hours, tempmins:newExam.examtime.mins} });
    // console.log(newExam);
  } else {
    console.error(`试卷基本信息填写不完整`);
    this.showSelectExam = true;
  }
  },
  closeSelectExam() {
      this.showSelectExam = false; // 关闭删除提示窗口
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
</style>
