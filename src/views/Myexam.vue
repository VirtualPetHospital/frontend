<template>
    <div class="card m-3">
        <div class="row align-items-center pe-3 ps-3">
            <div class="col-6 text-lg">
                <argon-badge class="me-3" size="md" color="info" variant="gradient">我的试卷</argon-badge>
            </div>
            <div class="col-6 p-3 text-end">
                <argon-button v-if="forCheck" @click="checkPaper" color="info" variant="gradient" size="sm"
                    class="me-4">确认</argon-button>
                <argon-button @click="newPaper" color="primary" variant="gradient" size="sm" class="">新增</argon-button>
            </div>
        </div>
    </div>
    <div v-for="(paper, index) in papers" :key="index" class="d-flex flex-column" >
        <div class="card mb-2 me-3 ms-3">
            <div class="row align-items-center p-2">
                <div v-if="forCheck" class="col-1 text-center">
                    <input type="checkbox" id="check" v-model="paper.checked">
                    <label v-if="showTest" for="check">选择 {{ paper.checked }}</label>
                </div>
                <div class="col-1 text-center">
                    <img class="icon icon-md " src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/512/external-exam-online-learning-vitaliy-gorbachev-lineal-color-vitaly-gorbachev-1.png">
                </div>
                <div class="col ps-4">
                    <h6>{{ paper.name }}</h6>
                    <div class="col">
                        <argon-badge color='success me-1' size="sm" variant='gradient'>{{ paper.id }}</argon-badge>
                        <argon-badge color='success me-1' size="sm" variant='gradient'>{{ paper.questions.length }}道题</argon-badge>
                        <argon-badge v-if="paper.time.mins>0" color='success me-1' size="sm" variant='gradient'>{{ paper.time.hours }} 小时 {{
                            paper.time.mins }} 分钟</argon-badge>
                        <argon-badge v-else color='success me-1' size="sm" variant='gradient'>{{ paper.time.hours }} 小时 0 分钟</argon-badge>
                        <argon-badge color='success me-1' size="sm" variant='gradient'>{{ paper.permission }}</argon-badge>
                    </div>
                </div>
                <div class="col-7 text-end">
                    <argon-button class="me-4" @click="toggleDetails(index)" color='success' variant="gradient" size="sm">{{ paper.showDetails ? '隐藏' : '查看' }}</argon-button>

                    <argon-button class="me-4" @click="myWatch(index)" color='success' variant="gradient"
                        size="sm">查看</argon-button>
                    <argon-button class="me-4" @click="myEdit(index)" color='warning' variant="gradient"
                        size="sm">修改</argon-button>
                    <argon-button class="me-4" @click="checkDelete(index)" color='danger' variant="gradient"
                        size="sm">删除</argon-button>
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
                            <argon-badge variant="gradient">试卷ID: {{ this.papers[toDeleteIndex].id }}</argon-badge>
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
    <!-- <div class="mt-1">
        <argon-alert @click="closeAlert" v-if="showAlert == 1" color="success" icon="ni ni-like-2 ni-lg">
            <strong>成功!</strong>
        </argon-alert>
        <argon-alert @click="closeAlert" v-if="showAlert == -1" color="danger">
            <strong>失败!</strong> 重新试一下！
        </argon-alert>
    </div> -->
    <div class="biaoge">
    <!-- 表格开始 -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">考试ID</th>
          <th scope="col">考试名</th>
          <th scope="col">起始时间</th>
          <th scope="col">终止时间</th>
          <th scope="col">考试时长</th>
          <th scope="col">考试等级</th>
          <th scope="col">考试详情</th>
        </tr>
      </thead>
      <tbody>
        <!-- 遍历每个考试项 -->
        <tr v-for="(exam, index) in exams" :key="index">
          <td>{{ exam.id }}</td>
          <td>{{ exam.name }}</td>
          <td>{{ exam.startTime }}</td>
          <td>{{ exam.endTime }}</td>
          <td>{{ exam.duration }}</td>
          <td>{{ exam.level }}</td>
          <td>
            <!-- 考试详情表格 -->
            <div v-if="showExamDetails[index]">
                <table class="table">
                <thead>
                    <tr>
                    <th scope="col">试卷ID</th>
                    <th scope="col">题目数</th>
                    <th scope="col">权限</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 遍历每个试卷 -->
                    <tr v-for="(paper, idx) in exam.papers" :key="idx">
                    <td>{{ paper.id }}</td>
                    <td>{{ paper.num }}</td>
                    <td>{{ paper.permission }}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <!-- 查看按钮 -->
            <button @click="toggleExamDetails(index)" class="btn btn-primary">{{ showExamDetails[index] ? '隐藏' : '查看' }}</button>
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
import { ref, Vue } from 'vue'; // 导入Vue

const API_URL = `/api/paper`

// export default {
//     data() {
//         return {
//             toDeleteIndex: -1,
//             showModal: false,//模态框
//             // showAlert: 0,
//             paper: {
//                 id: 'e1',
//                 name: '数学试卷',
//                 // num: 4,
//                 permission: 'public',
//                 checked: false
//             },
//             papers: [
//             ],
//             forCheck: false,//选试卷用的
//             showTest: false, //用来看Test结果的，正式发布的时候设置为false
//             mock:false,//模拟HTTP请求
//         }
//     },
//     components: {
//         ArgonButton,
//         ArgonBadge,
//         // ArgonAlert,
//         Modal
//     },
//     methods: {
//         async getPapers() {
//             if (!this.mock) {
//                 const url = `${API_URL}/`
//                 this.papers = await (await fetch(url)).json()
//             }
//             if (this.mock) {
//                 this.papers = [{
//                     id: 'p1',
//                     name: '数学试卷',
//                     // num: 3,//可能要改
//                     questions:[{},{},{}],
//                     permission: 'public',
//                     time: {
//                         hours: 2,
//                         mins: 30
//                     },
//                     checked: false,
//                 },
//                 {
//                     id: 'p2',
//                     name: '语文试卷',
//                     // num: 5,//可能要改
//                     questions:[{},{},{},{},{}],
//                     permission: 'public',
//                     time: {
//                         hours: 1,
//                         mins: 30,
//                     },
//                     checked: false,
//                 },
//                 {
//                     id: 'p3',
//                     name: '英语试卷',
//                     // num: 7,//可能要改
//                     questions:[{},{},{},{},{},{},{}],
//                     permission: 'public',
//                     time: {
//                         hours: 3,
//                         mins: 2,
//                     },
//                     checked: false,
//                 }
//                 ]
//             }
//         },
//         newPaper() {
//             //to check
//             this.$router.push('/new-paper')
//         },
//         myWatch(index) {
//             //todo: 跳转到试卷详细信息页
//             // this.$router.push({ name: 'Watch Paper', params: { id: this.papers[index].id } })
//             let id = this.papers[index].id
//             // this.$router.push({
//             //     path:(`/watch-paper/${id}`)
//             // })
//             this.$router.push(`/watch-paper/${id}`)
//         },
//         async myDelete() {
//             //todo:HTTP Delete Test
//             this.showModal = false
//             let p = this.papers[this.toDeleteIndex]
//             const url = `${API_URL}?paperId=${p.id}`
//             console.log(p)
//             let result = await fetch(url, {
//                 method: 'delete',
//             })
//             console.log(result)
//             // if (this.showTest || result.ok) { //showTest状态默认都是成功的 //THIS
//             if(result.ok){//DELETE
//                 // this.showAlert = 1
//                 this.$toast.success(`${p.id}删除成功`, {
//                     duration: 4000,
//                     // position:"top",
//                 })
//                 this.$router.go(0)
//                 if(this.showTest){
//                     this.papers = this.papers.filter((paper)=>paper.id!=p.id)
//                 }
//             } else {
//                 // this.showAlert = -1
//                 this.$toast.warning("删除失败，请重试", {
//                     duration: 4000,
//                     // position:"top",
//                 })
//             }
//             this.toDeleteIndex = null
//         },
//         myEdit(index) {
//             //todo：跳转到试卷信息修改页
//             // this.$router.push({ name: 'Edit Paper', params: { id: this.papers[index].id } })
//             let id = this.papers[index].id
//             this.$router.push(`/edit-paper/${id}`)
//         },
//         checkPaper() {
//             //todo: 选择paper

//         },
//         checkDelete(index) {
//             this.showModal = true
//             this.toDeleteIndex = index
//         },
//         cancelDelete() {
//             this.showModal = false
//             this.toDeleteIndex = null
//         },
//         // closeAlert() {
//         //     this.showAlert = 0
//         // },
//     },
//     mounted() {
//         this.getPapers()
//     }
// }

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
      showExamDetails: ref([]) 
    };
  },
  created() {
    // 初始化showExamDetails数组
    this.showExamDetails.value = new Array(this.exams.length).fill(false);
  },
  methods: {
    // 查看考试详情
    toggleExamDetails(index) {
      // 直接修改数组的某个元素来触发响应式更新
      this.showExamDetails.value[index] = !this.showExamDetails.value[index];
      this.showExamDetails.value = [...this.showExamDetails.value]; // 强制更新数组
    },
    viewExam(index) {
      // 编写跳转逻辑，根据考试索引index跳转到相应的考试详情页面
      // 示例：this.$router.push({ name: 'ExamDetail', params: { id: this.exams[index].id } })
    }
  }
};
</script>

<style scoped>
.biaoge {
    background-color: white;
    border-radius: 10px;
    border: 1px solid #ccc;
    margin-left: 2%; /* 调整左边距 */
    margin-right: 2%; /* 调整左边距 */
}

</style>