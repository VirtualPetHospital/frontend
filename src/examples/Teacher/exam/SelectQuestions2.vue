<template>
  <div>
    <div class="biaoge ps-3">
      <table class="table" bgcolor="#ffffff">
        <colgroup>
          <col style="width: 5%">
          <col style="width: 7%">
          <col style="width: 7%">
          <col style="width: 70%">
          <col style="width: 11%">
        </colgroup>
        <thead>
          <tr>
          <th colspan="5">
            <div class="selected-problems">
              <span>已选试题：{{ selectedCount }}/{{problemmax}}
              <div class="progress">
                <div class="progress-bar" :style="{ width: progressWidth }"></div>
              </div>
            </span>
            </div>
            <div class="button-container" style="height: 100%;">
            <button @click="upProblems()" class="btn btn-lg btn-block btn-warning" style="height: 100%;">确定选题</button>
            </div>
              </th>
            </tr>
          <tr>
            <th scope="col" class="text-center rounded-top-left">选择</th>
            <th scope="col" class="text-center">题目ID</th>
            <th scope="col" class="text-center">分类</th>
            <th scope="col" class="text-center" style="word-break: break-word;">题目描述</th>
            <th scope="col" class="text-center rounded-top-right">试题详情</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历每个考试项 -->
          <tr v-for="(problem, index) in problems" :key="index">
            <td class="text-center">
              <input type="checkbox" v-model="problem.checked" @change="handleProblemSelection(problem)">
            </td>
            <td class="text-center ">{{ problem.id }}</td>
            <td class="text-center ">{{ problem.category }}</td>
            <td class="text-center " style="word-break: break-word;">{{ problem.description }}</td>
          <td class="text-center ">
          <!-- 查看按钮 -->
          <button @click="openProblemDetails(problem)"  class="btn btn-primary">查看详情</button>
        </td>
      </tr>
        </tbody>
      </table>
    </div>
 <transition name="modal">
    <div class="modal-mask" v-if="showProblemDetails" @click="closeProblemDetails">
      <div class="modal-wrapper" @click.stop>
        <div class="modal-container" style="width: 60%; height: 60%; overflow-y: auto; position: fixed; top: 50%; left: 40%; transform: translate(-50%, -50%);">
          <h3>题目详情</h3>
          <form>
            <label>题目ID：</label>
            <input type="text" class="form-control" v-model="selectedProblem.id" disabled><br>
            <label>分类：</label>
            <input type="text" class="form-control" v-model="selectedProblem.category" :disabled="!editMode"><br>
            <label>题目描述：</label>
            <textarea class="form-control auto-height" v-model="selectedProblem.description" :disabled="!editMode"></textarea><br>
            <label>A：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceA" :disabled="!editMode"><br>
            <label>B：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceB" :disabled="!editMode"><br>
            <label>C：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceC" :disabled="!editMode"><br>
            <label>D：</label>
            <input type="text" class="form-control" v-model="selectedProblem.choiceD" :disabled="!editMode"><br>
            <label>答案：</label>
            <input type="text" class="form-control" v-model="selectedProblem.answer" :disabled="!editMode"><br>
            <div class="button-container">
              <!-- <button type="button" class="btn btn-lg btn-block btn-primary" @click="editMode ? saveProblemDetails() : toggleEditMode()">{{ editMode ? '保存' : '修改' }}</button> -->
              <button type="button" class="btn btn-lg btn-block btn-warning" @click="editMode ? cancelEdit() : closeProblemDetails()">{{ editMode ? '取消修改' : '关闭' }}</button>
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
const API_URL = `/api/problem`
export default {
  data() {
    return {
      problems: [
        { id: 1, category: '传染病', description:'狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀到底是什么病呀狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀到底是什么病呀狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀？狂犬病是什么病呀到底是什么病呀',choiceA:"小病",choiceB:"中病",choiceC:"传染病",choiceD:"大病",answer:"C",checked: false },
        { id: 2, category: '传染病', description:'狂猫病是什么病呀？',choiceA:"小病",choiceB:"中病",choiceC:"传染病",choiceD:"大病",answer:"C",checked: false},
        { id: 3, category: '传染病', description:'狂鸟病是什么病呀？',choiceA:"小病",choiceB:"中病",choiceC:"传染病",choiceD:"大病",answer:"C",checked: false },
      ],
      editing: null,
      showEditModal: false, // 控制编辑窗口显示与隐藏
      showDeleteWarning: false, // 控制删除提示窗口的显示与隐藏
      editMode: false, // 是否为编辑模式
      newProblem: { id: '', category: '', description: '',choiceA:'',choiceB:'',choiceC:'',choiceD:'',answer:''},// 新增题目的初始信息
      showProblemDetails: false,
      selectedProblem: { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '' },
      selectedCount: 0, // 已选试题数量
      progressWidth: '0%', // 动态进度条宽度
      problemmax:0, 
      tempname1:'',
      temphours1:'',
      tempmins1:'',
      flag1:true,
    };
  },
  created() {
  this.tempname1=this.$route.params.tempname;
  this.problemmax = this.$route.params.tempproblemcount;
  this.temphours1=this.$route.params.temphours;
  this.tempmins1=this.$route.params.tempmins;
  console.log(this.tempname1);
  },
  watch: {
    // 监听已选试题数量的变化
    selectedCount(newValue) {
      // 更新动态进度条的宽度
      this.progressWidth = (newValue / this.problemmax) * 100 + '%';
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
    openProblemDetails(problem) {
      this.selectedProblem = { ...problem };
      this.showProblemDetails = true;
    },
    closeProblemDetails() {
      this.showProblemDetails = false;
      this.selectedProblem = { id: '', category: '', description: '', choiceA: '', choiceB: '', choiceC: '', choiceD: '', answer: '' };
    },
    deleteProblem() {
      const selectedProblems = this.problems.filter(problem => problem.checked);
      if (selectedProblems.length > 0) {
        // 删除选中的题目信息
        selectedProblems.forEach(problem => {
          const index = this.problems.findIndex(u => u.id === problem.id);
          if (index !== -1) 
          {
            this.problems.splice(index, 1);
            console.log('已删除题目:', problem);
          }
        });
      } else {
        console.log('请至少选择一个要删除的题目');
        this.showDeleteWarning = true;
      }
    },
    handleProblemSelection(problem) {
      this.selectedCount = this.problems.filter(p => p.checked).length;

      // 如果已选试题数量达到上限，则取消当前选中的复选框并弹出提示
      if (this.selectedCount > this.problemmax && problem.checked) {
        problem.checked = false;
        alert('已达到选题上限！');
        this.selectedCount--;
        return ;
      }
    // 更新动态进度条的宽度
    this.progressWidth = (this.selectedCount / this.problemmax) * 100 + '%';
  },
    // closeDeleteWarning() {
    //   this.showDeleteWarning = false; // 关闭删除提示窗口
    // },
  upProblems() {
    if (this.selectedCount < this.problemmax) {
      // 选题数量未达到要求，弹出提示继续选题
      alert('选题数量未达到要求，请继续选题！');
    } else if (this.selectedCount == this.problemmax) {
      // 选题成功，弹出提示
      alert('选题成功！');
    }
    // 其他处理逻辑
    const tempproblems = [];
    this.problems.forEach(problem => {
      if (problem.checked) {
        tempproblems.push(problem.id);
      }
    });
    console.log(tempproblems);
    this.$router.push({
      name: '管理试卷', // 跳转回之前的页面的名称
      params: {
        problemmax: this.problemmax,
        tempname1: this.tempname1,
        temphours1: this.temphours1,
        tempmins1: this.tempmins1,    
        tempproblems: tempproblems.join(','), // 将数组转换为以逗号分隔的字符串
        flag: this.flag1,
      }
    });
  },
  },
  components: {
    ArgonBadge,
    ArgonButton,
    Modal
  }
};
</script>
<style scoped>
.problem-management-card {
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
.selected-problems {
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
