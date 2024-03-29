<template>
  <div>
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
            <th scope="col" class="text-center">试卷名</th>
            <th scope="col" class="text-center" style="word-break: break-word;">题目数量</th>
            <th scope="col" class="text-center" style="word-break: break-word;">考试时间</th>
            <th scope="col" class="text-center rounded-top-right">试卷详情</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个考试项 -->
          <tr v-for="(paper, index) in papers" :key="index">
            <td class="text-center">
              <input type="checkbox" v-model="paper.checked" @change="handlePaperSelection(paper)">
            </td>
        <td class="text-center ">{{ paper.id }}</td>
        <td class="text-center ">{{ paper.name }}</td>
        <td class="text-center " style="word-break: break-word;">{{ paper.problemcount }}</td>
        <td class="text-center " style="word-break: break-word;">{{ paper.time.hours }}时{{ paper.time.mins }}分钟</td>
        <td class="text-center ">
          <!-- 查看按钮 -->
          <!-- <button @click="openPaperDetails(paper)"  class="btn btn-primary">查看详情</button> -->
          <button @click="myWatch(paper.id)" class="btn btn-primary">查看详情</button>
        </td>
      </tr>
        </tbody>
      </table>
    </div>
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
              <button type="button" class="btn btn-lg btn-block btn-primary" @click="editMode ? savePaperDetails() : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button>
              <button type="button" class="btn btn-lg btn-block btn-warning" @click="editMode ? cancelEdit() : closePaperDetails()">{{ editMode ? '取消修改' : '关闭' }}</button>
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
        { id: 1, name: '数学试卷', problemcount: 3 ,problems: [{},{},{}],time: {hours: 2,mins: 30},checked: false },
        { id: 2, name: '语文试卷', problemcount: 3 ,problems: [{},{},{}],time: {hours: 1,mins: 30},checked: false},
        { id: 3, name: '英语试卷', problemcount: 3 ,problems: [{},{},{}],time: {hours: 3,mins: 2},checked: false},
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newPaper: { id: '', name: '', problemcount: '',problems:[],time:{hours:'',mins:''}},// 新增题目的初始信息
      showPaperDetails: false,
      showSelectPaper: false,
      selectedPaper: { id: '', name: '', problemcount: '',problems:[],time:{hours:'',mins:''}},
      temppaper:0,
      temppapername:'',
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
    selectedCount: 0, // 已选试题数量
      tempexamlevel1:'', 
      tempname1:'',
      temphours1:'',
      tempmins1:'',
      flag1:true,
    };
  },
  created() {
    // 从路由参数中获取传递的参数值，并填充到文本框中
  this.tempname1=this.$route.params.tempname;
  this.tempexamlevel1 = this.$route.params.tempexamlevel;
  this.temphours1=this.$route.params.temphours;
  this.tempmins1=this.$route.params.tempmins;
  console.log(this.tempname1);
    console.log(this.newPaper);
  },
  watch: {
    // 监听已选试题数量的变化
    selectedCount(newValue) {
      // 更新动态进度条的宽度
      this.progressWidth = (newValue ) * 100 + '%';
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
      this.selectedCount = this.papers.filter(p => p.checked).length;

      // 如果已选试题数量达到上限，则取消当前选中的复选框并弹出提示
      if (this.selectedCount > 1 && paper.checked) {
        paper.checked = false;
        alert('请不要选择多个试卷');
        this.selectedCount--;
        return ;
      }
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
    this.papers.forEach(paper => {
      if (paper.checked) {
        this.temppaper = paper.id;
        this.temppapername = paper.name;
      }
    });
    this.$router.push({
      name: '管理考试', // 跳转回之前的页面的名称
      params: {
        tempexamlevel1: this.tempexamlevel1,
        tempname1: this.tempname1,
        temphours1: this.temphours1,
        tempmins1: this.tempmins1,    
        temppaper: this.temppaper, // 将数组转换为以逗号分隔的字符串
        temppapername: this.temppapername, 
        flag: this.flag1,
      }
    });
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
</style>
