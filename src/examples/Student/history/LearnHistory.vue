<template>
  <!-- <div v-for="(paper, index) in papers" :key="index" class="row"> -->
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
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";

const API_URL = `/users/medcases`

export default {
  data() {
    return {
      qId: '',//选择题目
      qScore: '',//设置分数
      paper_id: "p1",
      name: "数学考试1",

      questions: [
        {
          question_id: "q01",
          description: "1+1=",
          options: [
            {
              id: 1,
              content: "1"
            },
            {
              id: 2,
              content: "2"
            },
            {
              id: 3,
              content: "3"
            }
          ],
          answer: 2,
          category_id:98,
        },
        {
          question_id: "q01",
          description: "1+1=",
          options: [
            {
              id: 1,
              content: "1"
            },
            {
              id: 2,
              content: "2"
            },
            {
              id: 3,
              content: "3"
            }
          ],
          answer: 2,
          category_id:98,
        }
      ],
      //status: 'undo',//完成考试状态'undo','todo','done'
      isActive: false,//如果是交互的则为true，否则为false.[只有学生操作是true,老师编辑试卷、批改试卷，学生查看试卷都是false]
      isResult: false,//用来展示题目的正状态：正确、错误、待评审
      editScore: false,//用来修改分数(新建/修改试卷的时候为true；其他时候为false)
      editUScore: false,//用来修改学生分数（批改时为true；其他时候为false）

      showTest: false,//打印测试信息
      mock: false,//用来HTTP测试
    }
  },
  components: {
    ArgonButton,

  },
  methods: {
    async getPaper() {
      const id = this.$route.params.id;
      console.log(this.$route.params);//打印结果为{user:'david'}
      const url = `${API_URL}?paperId=${id}`
      // const url = `${API_URL}/`

      if (!this.mock) {
        this.paper =  await (await fetch(url)).json()
        console.log(this.paper)
      }
      /* mock */
      if (this.mock) {
        this.paper = {
          "id": id,
          "name": "数学考试1",
          "time": {
            "hours": "2",
            "mins": "10"
          },
          "permission": "public",
          "userId": "",
          "questions": [
            {
              "id": "q01",
              "description": "1+1=",
              "options": [
                {
                  "id": 1,
                  "content": "1"
                },
                {
                  "id": 2,
                  "content": "2"
                },
                {
                  "id": 3,
                  "content": "3"
                }
              ],
              "answer": 2,
              "type": "single",
              "category": "A",
              "disease": "A1",
              "analysis": "1+1=2",
              "score": 5
            },
            {
              "id": "q02",
              "description": "1+2=",
              "options": [
                {
                  "id": 1,
                  "content": "1"
                },
                {
                  "id": 2,
                  "content": "three"
                },
                {
                  "id": 3,
                  "content": "3"
                },
                {
                  "id": 4,
                  "content": "4"
                }
              ],
              "answer": [
                2,
                3
              ],
              "type": "multiple",
              "category": "B",
              "disease": "B2",
              "analysis": "1+2=3",
              "score": 10
            },
            {
              "id": "q05",
              "description": "1+4=",
              "options": [],
              "answer": [
                "5",
                "五"
              ],
              "type": "short",
              "category": "C",
              "disease": "C1",
              "analysis": "1+4=5",
              "score": 5
            },
            {
              "id": "q04",
              "stem": "1+23=",
              "options": [],
              "answer": "",
              "type": "long",
              "category": "D",
              "disease": "D2",
              "analysis": "1+23=24",
              "score": 10
            }
          ]
        }
      }
    },
    init(mode) {
      switch (mode) {
        case 't'://test 测试
          this.showTest = true
          break;
        case 'p'://teacher paper 老师组卷
          // this.question.yourAns = []//used
          this.editScore = false
          break;
        case 'e'://student exam  学生考试
          this.isActive = true
          break;
        case 'r'://student result 学生答卷
          this.isResult = true
          break;
        case 'w'://teacher watch 审批
          this.editUScore = true
          this.isResult = true
          break;
        default:
          this.editUScore = false
          this.editScore = false
          this.isActive = false
          this.isResult = false
          break;
      }
    },
    getPaperId(result) {
      //todo：需要修改
      if (result.ok) {
        return result.json().id
      } else {
        return "Q01_test"
      }
    },
    goBack() {
      this.$router.back()
    },
    // showHidden(idx) {
    //   if (this.isActive) {
    //     this.questions[idx].hidden = false
    //   } else {
    //     this.questions[idx].hidden = !this.paper.questions[idx].hidden
    //   }
    // },
    isRightAnswer(id, idx) {
      return id == this.questions[idx].answer
    },
    isEqual(l1, l2) {
      if (l1.length != l2.length) {
        return false
      } else {
        l1 = l1.sort
        l2 = l2.sort
        return l1 == l2
      }
    },
    getScore(idx) {//提交试卷的时候调用//used
      //todo:还没调用
      this.questions[idx].status = 'done'
      this.questions[idx].uScore = this.questions[idx].yourAns == this.questions[idx].answer ? this.questions[idx].score : 0

    },
    correct(idx) {
      if (this.questions[idx].status == 'done') {
        return this.questions[idx].uScore == this.questions[idx].score
      }
      return false
    },
    wrong(idx) {
      if (this.questions[idx].status == 'done') {
        return this.questions[idx].uScore != this.questions[idx].score

      }
      return false
    },
    waiting(idx) {
      return this.questions[idx].status == 'todo'
    },
    undo(idx) {
      return this.questions[idx].status == 'undo'
    },
    todo(idx) {
      return this.questions[idx].status == 'todo'
    },
  },
  mounted() {
    // this.getPaper()
    this.init('p')
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
  created(){
    this.getPaper()
  }
}

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