<template>
  <!-- <div v-for="(paper, index) in papers" :key="index" class="row"> -->
  <div class="row">
    <div class="col-1"></div>
    <div class="col">
      <div class="card p-4">
        <argon-button @click="goBack" color="secondary" variant="gradient" class="ms-3 col-1">返回</argon-button>
        <h3 class="ms-3">{{ name }}</h3>
        <div class="mt-3">
          <div v-for="(question, idx) in questions" :key="idx">
            <div>
              <div class="card mb-2 me-3 ms-3 pe-4 ps-4 pt-3 pb-3">
                <div @click="showHidden(idx)">
                  <div>
                    <h6>{{ idx + 1 }}. {{ question.description }}</h6>
                  </div>
                    <div v-for="item of question.options" :key="item.id">
                      <div>
                        <input @change="getScore(idx)"  type="radio" :id="item.id"
                               :value="item.id" v-model="question.yourAns" :disabled="!isActive">
                        <label :for="item.id" class="ms-4 me-4">{{ item.content }}</label>
                        <i v-if="!isActive && isRightAnswer(item.id, idx)"
                           class="ni ni-check-bold text-success opacity-10"></i>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="col-1"></div>

  </div>
  <div>
    <pre v-if="showTest">{{ paper }}</pre>
  </div>
</template>

<script>

import ArgonBadge from "@/components/ArgonBadge.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const API_URL = `/api/paper`

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
  created(){
    this.getPaper()
  }
}

</script>