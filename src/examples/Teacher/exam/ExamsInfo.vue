
<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>考试：{{this.exam.name}}</h3>
        <button @click="goBack" class="btn btn-success" style="margin-right: 2%;">返回</button>
        <button @click="toggleSelectStudent" class="btn btn-primary">选择学生</button>
        <select v-model="selectedStudent" v-if="showStudentSelect" @change="fetchAnswerSheetId" class="form-control">
          <option value="" disabled hidden>请选择学生</option>
          <option v-for="student in allanswersheets" :key="student.answer_sheet_id" :value="student.nickname">{{ student.nickname }}</option>
        </select>
        <el-container>
          <el-aside class="asideLeft">
            <div class="aside_div">
              <div class="oneItem">
                <div class="fl">
                  <div class="fs14">试题总数</div>
                  <div ><i class="fs28">{{this.allanswers.length}}</i>
                    <i class="fs12 co333">题</i>
                  </div>
                </div>
              </div>
              <div class="itemInner">
                <div class="fs16">
                  单选题
                </div>
                <div :key="selectedStudent"> <!-- 使用selectedStudent作为key -->
                <div class="box-list">
                  <div
                      class="box normal-box question_cbox"
                      v-for="(answer,index) in this.allanswers"
                      :key="index"
                  >
                    <div
                        :class="{ 'ansRight':answer.isCorrect, 'ansFalse': !answer.isCorrect  }"
                        @click="selectQuestion(answer)"
                    >
                      {{index+1}}
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <!-- <div class="oneItem">
                <div class="fl">
                  <div class="fs14">学生成绩</div>
                  <div ><i class="fs28">{{this.tempscore}}</i>
                    <i class="fs12 co333">分</i>
                  </div>
                </div>
              </div> -->
            </div>
          </el-aside>
          <el-main style="padding:5px">
            <el-card style="border-radius: 10px">
              <span style="font-size: larger;">题目描述</span>
              <div v-if="selectedQuestion">
                {{selectedQuestion.description}}
              </div>
            </el-card>
            <el-card style="border-radius: 10px;margin-top:10px">
              <div v-if="selectedQuestion">
                <span>学生选择</span>
                <div>
                  <el-radio-group v-model="selectedAns" style="display: flex; flex-direction: column;">
      <el-radio disabled :label="1" style="align-self: flex-start;">{{selectedQuestion.a}}</el-radio>
      <el-radio disabled :label="2" style="align-self: flex-start;">{{selectedQuestion.b}}</el-radio>
      <el-radio disabled :label="3" style="align-self: flex-start;">{{selectedQuestion.c}}</el-radio>
      <el-radio disabled :label="4" style="align-self: flex-start;">{{selectedQuestion.d}}</el-radio>
    </el-radio-group>
                </div>
                <span>正确答案：{{selectedQuestion.answer}}
                </span>
              </div>
            </el-card>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive} from 'vue'
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {ElHeader, ElRadio, ElRadioGroup, ElAside, ElContainer
  , ElMain, ElProgress,ElCard,ElButton
} from "element-plus";
import axios from "axios";
export default{
  data(){
    return{
      name:null,
      answerInfo:null,
      selectedQuestion: {
        description:"请选择题目",
        a:null,
        b:null,
        c:null,
        d:null
      },
      selectedAns:null,
      exam_id:0,
      exam:[],
      paper:[],
      allanswersheets:[],
      tempanswersheet:[],
      showStudentSelect: false,
      selectedStudent: null,
      showInput: false, // 是否显示输入框
      problemcnt:0,
      allanswers:[],
      tempanswer:'',
      tempscore:0,
    }
  },
  computed: {
    placeholderText() {
      return this.selectedStudent ? '' : '请选择学生';
    },
  },
  methods:{
    goBack() {
      this.$router.back();
    },
    selectQuestion(answer) {
      const qid=answer.question_id;
      axios.get(`/api/questions/${qid}`, {
          withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
        }).then(response=>{
        this.selectedQuestion.description=response.data.data.description
        this.selectedQuestion.a=response.data.data.a;
        this.selectedQuestion.b=response.data.data.b;
        this.selectedQuestion.c=response.data.data.c;
        this.selectedQuestion.d=response.data.data.d;
        this.selectedQuestion.answer=response.data.data.answer;
        if(answer.answer==='A'){
          this.selectedAns=1;
        }else if(answer.answer==='B'){
          this.selectedAns=2;
        }else if(answer.answer==='C'){
          this.selectedAns=3;
        }else if(answer.answer==='D'){
          this.selectedAns=4;
        }
      }).catch(error=>{
        console.error('获取'+qid+'题目信息失败',error);
      })
    },
    toggleSelectStudent() {
      this.showStudentSelect = !this.showStudentSelect;
      this.showInput = this.showStudentSelect; // 设置输入框显示状态
    },
    fetchAnswerSheetId() {
      // 根据选中的学生nickname查找对应的答题卡数据
      this.allanswers=[];
      const selectedStudentData = this.allanswersheets.find(student => student.nickname === this.selectedStudent);
      if (selectedStudentData) {
        // 如果找到对应的答题卡数据，则获取其对应的answer_sheet_id
        const answerSheetId = selectedStudentData.answer_sheet_id;
        // 调用获取答题卡数据的方法
        this.fetchAnswerSheetData(answerSheetId);
      }
    },
    // 根据答题卡id获取答题卡数据
    fetchAnswerSheetData(answerSheetId) {
      axios.get(`/api/answer-sheets/answer-sheets/${answerSheetId}`,{
        withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
      })
        .then(async response => {
          this.tempanswersheet = response.data.data;
          // this.problemcnt=this.tempanswersheet.answers.length;
          // 在这里处理获取的答题卡数据，例如将答题卡信息存储到组件的数据中
          console.log(this.tempanswersheet);
          this.allanswers = this.tempanswersheet.answers;
          this.tempscore=this.tempanswersheet.score;
          console.log(this.allanswers);
          const requests = this.allanswers.map(answer => {
          const questionid = answer.question_id;
          return axios.get(`/api/questions/${questionid}`, {
            withCredentials: true,
            headers: {
              'Session': sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          });
        });
        // 使用 Promise.all 方法等待所有请求完成
        const responses = await Promise.all(requests);
        responses.forEach((res, index) => {
          const trueAns = res.data.data.answer;
          const temptempanswer = this.allanswers[index];
          temptempanswer.isCorrect = trueAns === temptempanswer.answer;
          console.log('答案对没对呢',temptempanswer.isCorrect );
        });
        }).catch(error => {
          console.error('获取题目失败', error);
        });
    },
  },
  components:{
    ElRadio,
    ElRadioGroup,
    ElAside,
    ElMain,
    ElHeader,
    ElContainer,
    ElProgress,
    defineComponent,
    ElCard,
    ElButton

  },
  mounted() {
    const examId=parseInt(this.$route.params.id);
    // const name=this.$route.params.name;
    // console.log('name',name);
    // this.name=name;
    axios.get(`/api/exams/${examId}`, {
      withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
  }).then(response => {
    this.exam = response.data.data;
    this.paper = response.data.data.paper;
    // 在这里处理获取的试卷数据，例如将试题信息存储到组件的数据中
    console.log(this.exam);
    console.log(this.paper);
  }).catch(error => {
    console.error('获取考试失败', error);
  });
  axios.get(`/api/answer-sheets/list/${examId}`, {
      withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
  }).then(response => {
    this.allanswersheets=response.data.data;
    // 在这里处理获取的试卷数据，例如将试题信息存储到组件的数据中
    console.log(this.allanswersheets);
  }).catch(error => {
    console.error('获取答题卡失败', error);
  });
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
    const formatt = ref("HH:mm:ss");
    const deadline = ref(new Date('2024-03-27 12:00:00').getTime());
    const leftTime = reactive({'H':0,'m':0,'s':0})
    const changeTime = ({legalTime}) => {
      for (const k of legalTime.keys()) {
        if (k in leftTime) {
          leftTime[k] = legalTime.get(k);
        }
      }
    }
    const finishTime = () => {
    }
    return {
      msg: 'Countdown 倒计时 组件文档示例',
      deadline,
      leftTime,
      changeTime,
      finishTime,
      formatt
    }
  }
};
</script>

<style scoped>

.card.p-4{
  margin-left: 5px;
  margin-bottom: 10px;
}
/* Scoped styles for the el-aside component */
.asideLeft {
  width: 200px;
}

/* Container styles */
.aside_div {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff; /* Change as needed */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow effect */
}

/* Styles for the first item */
.oneItem {
  margin-bottom: 20px;
}

/* Styles for the second item */
.twoItem {
  padding: 20px;
  background-color: #f9f9f9; /* Change as needed */
  border-radius: 8px;
  margin-bottom: 20px;
}

.custom-button {
  /* 设置背景颜色 */
  background-color: #b6d0ff;
  /* 设置边框颜色和样式 */
  border: 3px solid #4b7cff;
  /* 设置字体颜色 */
  color: #0265e7;
  /* 设置字体大小 */
  font-size: 18px;

  /* 设置圆角 */
  border-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
  /* 设置按钮悬停时的背景颜色 */
}
.custom-button:hover {
  /* 设置按钮悬停时的背景颜色 */
  background-color: #ffffff;
  border-color: #66b1ff;
}
::v-deep .el-radio{
  display: block;
  margin:10px 0;
}
.bottomItem i {
  margin: 0 5px;
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 50%;
}

.bottomItem i:first-child {
  background-color: #999; /* Color for unanswered question icon */
}

.bottomItem i:last-child {
  background-color: #007bff; /* Color for answered question icon */
}
.countdown-main .time-num{
  font-weight: 400;
  display: inline-block;
  border: 1px solid #f4f4f4;
  padding: 0 4px;
  border-radius: 4px;
  min-width: 48px;
  text-align: center;
  background-color: #f4f4f4;
  font-size: 18px;
}
.box-list {
  padding-bottom: 0;
  position: relative;
  left: -5px;
  font-size: 0;
  margin-right: -15px;
}

.box-list .box {
  height: auto;
  line-height: unset;
  position: relative;
  margin-bottom: 15px;
  font-size: 14px;
  width: 35px;
  margin-top: unset;
  margin-right: unset;
  display: inline-block;
}

.box-list .box .ansRight {
  border: 1px solid #dcdfe6;
      color: #008025;
      width: 27px;
      height: 27px;
      text-align: center;
      display: inline-block;
      line-height: 27px;
      background: #b6ffba;
      border-radius: 50%;
      cursor: pointer;
}

.box-list .box .ansFalse {
  border: 1px solid #dcdfe6;
      color: #a81818;
      width: 27px;
      height: 27px;
      text-align: center;
      display: inline-block;
      line-height: 27px;
      background: #ff7676;
      border-radius: 50%;
      cursor: pointer;
}
</style>