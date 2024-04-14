<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>试卷：{{this.paper.name}}</h3>
        <button @click="goBack" class="btn btn-success" style="margin-right: 2%;">返回</button>
        <button @click="showInputBox = true" class="btn btn-success" style="margin-right: 2%;">重选试题</button>
        <div v-if="showInputBox" class="input-group" style="margin-bottom: 10px;">
          <input type="text" class="form-control small-input" placeholder="请输入试题总数" v-model="newQuestionNum">
          <button class="btn btn-primary" @click="confirmNewQuestionNum">确定</button>
        </div>
        <el-container>
          <el-aside class="asideLeft">
            <div class="aside_div">
              <div class="oneItem">
                <div class="fl">
                  <div class="fs14">试题总数</div>
                  <div ><i class="fs28">{{this.paper.question_num}}</i>
                    <i class="fs12 co333">题</i>
                  </div>
                </div>
              </div>
              <div class="itemInner">
                <div class="fs16">
                  单选题
                </div>
                <div class="box-list">
                  <div
                      class="box normal-box question_cbox"
                      v-for="(question,index) in this.paper.questions"
                      :key="index"
                  >
                    <div
                        :class="{ 'ansRight': checkResult(question), 'ansFalse': !checkResult(question) }"
                        @click="selectQuestion(question)"
                    >
                      {{index+1}}
                    </div>
                  </div>
                </div>
              </div>
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
                <span>选项</span>
                <div>
                <!-- <el-radio-group v-model="selectedAns"> -->
                    <el-radio disabled>A. {{ selectedQuestion.a }}</el-radio>
                    <el-radio disabled>B. {{ selectedQuestion.b }}</el-radio>
                    <el-radio disabled>C. {{ selectedQuestion.c }}</el-radio>
                    <el-radio disabled>D. {{ selectedQuestion.d }}</el-radio>
                <!-- </el-radio-group> -->
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
      exam_id:null,
      paper:[],
      showInputBox: false,
      newQuestionNum: '',
    }
  },
  methods:{
    goBack() {
      this.$router.back();
    },
    selectQuestion(question) {
      // let qid=answer.answers.question_id;
      // axios.get(
      //     '/questions',
      //     {
      //       params:{
      //         question_id:qid
      //       }
      //     }
      // ).then(response=>{
      //   this.selectedQuestion.description=response.data.description
      //   this.selectedQuestion.a=response.data.a;
      //   this.selectedQuestion.b=response.data.b;
      //   this.selectedQuestion.c=response.data.c;
      //   this.selectedQuestion.d=response.data.d;
      //   this.selectedQuestion.answer=response.data.answer;
      //   if(answer.option==='A'){
      //     this.selectedAns=1;
      //   }else if(answer.option==='B'){
      //     this.selectedAns=2;
      //   }else if(answer.option==='C'){
      //     this.selectedAns=3;
      //   }else if(answer.option==='D'){
      //     this.selectedAns=4;
      //   }
      // }).catch(error=>{
      //   console.error('获取'+qid+'题目信息失败',error);
      // })
      this.selectedQuestion = question;
      this.selectedAns = null; // Reset selected answer  
    },
    selectQuestionMock(answer){
      let qid=answer.answers.question_id
      if(qid===85){
        this.selectedQuestion.description='85';
        this.selectedQuestion.a='85a';
        this.selectedQuestion.b='85b';
        this.selectedQuestion.c='85c';
        this.selectedQuestion.d='85d';
        this.selectedQuestion.answer='D';
      }else if(qid===86){
        this.selectedQuestion.description='86';
        this.selectedQuestion.a='856';
        this.selectedQuestion.b='856';
        this.selectedQuestion.c='856';
        this.selectedQuestion.d='856d';
        this.selectedQuestion.answer='A'
      }
      if(answer.option==='A'){
        this.selectedAns=1;
      }else if(answer.option==='B'){
        this.selectedAns=2;
      }else if(answer.option==='C'){
        this.selectedAns=3;
      }else if(answer.option==='D'){
        this.selectedAns=4;
      }
    },
    // checkResult(answer){
    //   if(!answer){
    //     return;
    //   }
    //   if(answer.option===answer.answers.answer){
    //     return true;
    //   }else{
    //     return false;
    //   }
    // },
    checkResult(question) {
      return true;
    },
    // fetchExam(examId){
    //   axios.get(`/answer-sheets/${examId}`).then(response=>{
    //     const examData = response.data.data;
    //     this.answerInfo=examData;
    //   }).catch(error=>{
    //     console.log('获取试卷失败2',error);
    //   })
    // },
    fetchExamMock() {
      return new Promise((resolve, reject) => {
        // 模拟考试数据
        const examData =  [
          {
            "answer_sheet_id": 34,
            "user_id": 57,
            "option": "D",
            "exam_id": 62,
            "answers":{
              "id": 1,
              "answer_sheet_id":34,
              "question_id":85,
              "answer":"D"
            }
          },
          {
            "answer_sheet_id": 4,
            "user_id": 57,
            "option": "B",
            "exam_id": 62,
            "answers":{
              "id": 1,
              "answer_sheet_id":4,
              "question_id":86,
              "answer":"A"
            }
          },
          {
            "answer_sheet_id": 4,
            "user_id": 57,
            "option": "B",
            "exam_id": 62,
            "answers":{
              "id": 1,
              "answer_sheet_id":4,
              "question_id":86,
              "answer":"A"
            }
          }
        ];
        this.answerInfo=examData;
        console.log(this.answerInfo);
        // 模拟异步请求
        setTimeout(() => {
          resolve(examData);
        }, 50);
      });
    },
    confirmNewQuestionNum() {
      if (this.newQuestionNum !== '') {
        const tempname = this.paper.name;
        this.$router.push({ name: '重选试题', params: { tempid:this.exam_id,tempname:tempname, tempproblemcount: this.newQuestionNum } });
      } else {
        console.error(`请输入试题总数`);
      }
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
    const examId=this.$route.params.id;
    // const name=this.$route.params.name;
    // console.log('name',name);
    // this.name=name;
    this.exam_id=examId;
    console.log('examId IN PAPERINFO',this.exam_id);
    axios.get(`/api/papers/${examId}`, {
      withCredentials: true,
          headers: {
            'Session': sessionStorage.getItem('sessionId'),
            'Content-Type': 'application/json',
          }
  }).then(response => {
    this.paper = response.data.data;
    // 在这里处理获取的试卷数据，例如将试题信息存储到组件的数据中
    console.log(this.paper);
  }).catch(error => {
    console.error('获取试卷失败', error);
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
  color: #dcdfe6;
  width: 27px;
  height: 27px;
  text-align: center;
  display: inline-block;
  line-height: 27px;
  background: #3a50be;
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

.small-input {
  width: 50%; /* 设置输入框宽度为父元素宽度的 70% */
  height: 40px; /* 设置输入框高度为 30px */
}

</style>
