<template>
  <div class="card m-3">
    <div class="row align-items-center pe-3 ps-3">
      <div class="col-6 text-lg">
        <argon-badge class="me-3" size="md" color="info" variant="gradient">我的考试</argon-badge>
      </div>
      <div class="col-6 p-3 text-end">
        <argon-button v-if="forCheck" @click="checkPaper" color="info" variant="gradient" size="sm" class="me-4">确认</argon-button>
        <argon-button @click="newPaper" color="primary" variant="gradient" size="sm" class="">新增</argon-button>
      </div>
    </div>
  </div>
  <div v-for="(paper, index) in papers" :key="index" class="d-flex flex-column">
    <div class="card mb-2 me-3 ms-3">
      <div class="row align-items-center p-2">
        <div v-if="forCheck" class="col-1 text-center">
          <input type="checkbox" id="check" v-model="paper.checked">
          <label v-if="showTest" for="check">选择 {{ paper.checked }}</label>
        </div>
        <div class="col-1 text-center">
          <img class="icon icon-md" src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/512/external-exam-online-learning-vitaliy-gorbachev-lineal-color-vitaly-gorbachev-1.png">
        </div>
        <div class="col ps-4">
          <h6>{{ paper.name }}</h6>
          <div class="col">
            <argon-badge color='success me-1' size="sm" variant='gradient'>{{ paper.id }}</argon-badge>
            <argon-badge color='success me-1' size="sm" variant='gradient'>{{ paper.questions.length }}道题</argon-badge>
            <argon-badge v-if="paper.time.mins > 0" color='success me-1' size="sm" variant='gradient'>{{ paper.time.hours }} 小时 {{ paper.time.mins }} 分钟</argon-badge>
            <argon-badge v-else color='success me-1' size="sm" variant='gradient'>{{ paper.time.hours }} 小时 0 分钟</argon-badge>
            <argon-badge color='success me-1' size="sm" variant='gradient'>{{ paper.permission }}</argon-badge>
          </div>
        </div>
        <div class="col-7 text-end">
          <argon-button class="me-4" @click="toggleDetails(index)" color='success' variant="gradient" size="sm">{{ paper.showDetails ? '隐藏' : '查看' }}</argon-button>
          <argon-button class="me-4" @click="toggleExamDetails(index)" color='success' variant="gradient" size="sm">查看</argon-button>
          <argon-button class="me-4" @click="myEdit(index)" color='warning' variant="gradient" size="sm">修改</argon-button>
          <argon-button class="me-4" @click="checkDelete(index)" color='danger' variant="gradient" size="sm">删除</argon-button>
        </div>
      </div>
    </div>
  </div>
  <div>
    <Teleport to="body">
      <modal :show="showModal" @close="showModal = false">
        <template #header>
          <div class="row">
            <div class="col-6">
              <h6>提示</h6>
            </div>
            <div class="col-6 text-center">
              <argon-badge variant="gradient">试卷ID: {{ papers[toDeleteIndex].id }}</argon-badge>
            </div>
          </div>
        </template>
        <template #body>
          <span class="font-weight-bold">你确定要删除吗</span>
        </template>
        <template #footer>
          <div class="row">
            <div class="col-6 text-center">
              <argon-button @click="myDelete" color="danger" variant="gradient">确定</argon-button>
            </div>
            <div class="col-6 text-center">
              <argon-button @click="cancelDelete" color="info" variant="gradient">取消</argon-button>
            </div>
          </div>
        </template>
      </modal>
    </Teleport>
  </div>
  <div class="biaoge">
    <!-- 表格开始 -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="text-center">考试ID</th>
          <th scope="col" class="text-center">考试名</th>
          <th scope="col" class="text-center">起始时间</th>
          <th scope="col" class="text-center">终止时间</th>
          <th scope="col" class="text-center">考试时长</th>
          <th scope="col" class="text-center">考试等级</th>
          <th scope="col" class="text-center">考试详情</th>
        </tr>
      </thead>
      <tbody>
  <!-- 遍历每个考试项 -->
        <tr v-for="(exam, index) in exams" :key="index">
          <td class="text-center">{{ exam.id }}</td>
          <td class="text-center">{{ exam.name }}</td>
          <td class="text-center">{{ exam.startTime }}</td>
          <td class="text-center">{{ exam.endTime }}</td>
          <td class="text-center">{{ exam.duration }}</td>
          <td class="text-center">{{ exam.level }}</td>
          <td class="text-center">
            <!-- 查看按钮 -->
            <button @click="viewExamDetails(exam.id)" class="btn btn-primary">查看</button>
          </td>
        </tr>
      </tbody>

    </table>
    <!-- 表格结束 -->
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

export default {
  data() {
    return {
      // 考试数据示例
      exams: [
        {
          id: 'exam1',
          name: '考试1',
          startTime: '2024-03-18 09:00:00',
          endTime: '2024-03-18 11:30:00',
          duration: '2小时30分钟',
          level: '普通',
          papers: [
            {
              id: 'paper1',
              num: 5,
              permission: '公开'
            },
            {
              id: 'paper2',
              num: 7,
              permission: '私密'
            }
          ]
        },
        {
          id: 'exam2',
          name: '考试2',
          startTime: '2024-03-19 10:00:00',
          endTime: '2024-03-19 12:30:00',
          duration: '2小时30分钟',
          level: '高级',
          papers: [
            {
              id: 'paper3',
              num: 6,
              permission: '公开'
            },
            {
              id: 'paper4',
              num: 8,
              permission: '私密'
            }
          ]
        }
      ],
      showExamDetails: ref([]),
      forCheck: true, // 添加一个示例布尔值，确保组件正常显示
      showModal: false, // 添加一个示例布尔值，确保模态框正常显示
      toDeleteIndex: 0 // 添加一个示例数值，确保模态框中的试卷ID正常显示
    };
  },
  created() {
    // 初始化showExamDetails数组
    console.log(this.exams);
    this.showExamDetails.value = new Array(this.exams.length).fill(false);

    },
  methods: {
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
    // 查看考试详情
    toggleExamDetails(index) {
      console.log('Toggle exam details for index:', index);
      // 直接修改数组的某个元素来触发响应式更新
      this.showExamDetails.value.splice(index, 1, !this.showExamDetails.value[index]);
    },
    viewExam(index) {
      // 编写跳转逻辑，根据考试索引index跳转到相应的考试详情页面
      // 示例：this.$router.push({ name: 'ExamDetail', params: { id: this.exams[index].id } })
    },
    checkPaper() {
      console.log('这是checkpaper：', index);
      // 添加一个示例方法，以便按钮点击事件能够触发
    },
    newPaper() {
      console.log('这是newpaper：', index);
      // 添加一个示例方法，以便按钮点击事件能够触发
    },
    myEdit(index) {
      console.log('这是myedit：', index);
      // 添加一个示例方法，以便按钮点击事件能够触发
    },
    checkDelete(index) {
      console.log('这是checkdelete：', index);
      // 添加一个示例方法，以便按钮点击事件能够触发
    },
    myDelete() {
      console.log('这是mydelete：', index);
      // 添加一个示例方法，以便按钮点击事件能够触发
    },
    cancelDelete() {
      console.log('这是cancedelete：', index);
      // 添加一个示例方法，以便按钮点击事件能够触发
    },
    viewExamDetails(examId) {
        // 根据考试ID执行页面跳转逻辑，例如：
        window.location.href = '/exam-details/' + examId;
    }
    
  },
  components: {
    ArgonBadge,
    ArgonButton,
    Modal
  }
};
</script>

<style scoped>
.biaoge {
    background-color: white;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-left: 2%; /* 调整左边距 */
    margin-right: 2%; /* 调整右边距 */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.table {
    text-align: center;
  }
  .table th,
  .table td {
    vertical-align: middle;
  }
</style>
