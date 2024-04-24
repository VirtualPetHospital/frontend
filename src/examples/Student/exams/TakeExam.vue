<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <div class="row">

          <h3>考试名：{{name}}</h3>
        </div>

        <el-container>
          <el-aside class="asideLeft">
            <div class="aside_div">
              <div class="oneItem">
                <div class="fl">
                  <div class="fs14">试题总数</div>
                  <div><i class="fs28">{{paper.question_num}}</i><i class="fs12 co333">题</i></div>
                </div>
              </div>
              <div class="twoItem pd20">
                <p class="fs14">做题进度</p>
                <el-progress :percentage="this.answerPro" :format="format"></el-progress>
              </div>
                <div class="itemInner">
                  <div class="fs16">
                    单选题
                </div>
                  <div>
                    <div class="time">离考试结束时间还有：{{countDown}}</div>
                  </div>

                  <div class="box-list">
                    <div
                        class="box normal-box question_cbox"
                        style="padding-left: 0px"
                        v-for="(question,index) in paper.questions"
                        :key="index"
                    >
                      <div
                          :class="{ 'checki': !checkResult[question.question_id], 'checked': checkResult[question.question_id] }"
                          @click="selectQuestion(question.question_id, index)"
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
                <el-radio-group v-model="selectedAns"  style="display: flex; flex-direction: column;">
                  <el-radio :label="1" @click="submitAnswer(selectedQuestion.question_id,1)" style="align-self: flex-start;">{{selectedQuestion.a}}</el-radio>
                  <el-radio :label="2" @click="submitAnswer(selectedQuestion.question_id,2)" style="align-self: flex-start;">{{selectedQuestion.b}}</el-radio>
                  <el-radio :label="3" @click="submitAnswer(selectedQuestion.question_id,3)" style="align-self: flex-start;">{{selectedQuestion.c}}</el-radio>
                  <el-radio :label="4" @click="submitAnswer(selectedQuestion.question_id,4)" style="align-self: flex-start;">{{selectedQuestion.d}}</el-radio>
                </el-radio-group>
                </div>
              </div>
            </el-card>
            <div>
              <el-tooltip class="item" effect="dark" :disabled="!this.checkAnsNum" content="答完所有题即可提交" placement="bottom">
                <el-button style="position: absolute;margin-top: 10px; right:30px" class="custom-button" @click="submitExam" :disabled="handin">提交</el-button>
              </el-tooltip>

            </div>
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
import {
  ElHeader, ElRadio, ElRadioGroup, ElAside, ElContainer
  , ElMain, ElProgress, ElCard, ElButton, ElPopover, ElDialog, ElMessage, ElTooltip
} from "element-plus";
import axios from "axios";
export default{
  name:"TakeExam",
  created() {
    if(sessionStorage.getItem('exam_time')===null){
    this.startCountDown();
  } else {
    this.countDownTime = Number(window.sessionStorage.getItem("exam_time"));
    this.startCountDown();
  }},

  computed: {
    // 计算属性自动计算countDownTime,并转换为倒计时
    countDown() {
      const minutes = Math.floor(this.countDownTime / 60);
      const seconds = this.countDownTime % 60;
      const m = minutes < 10 ? "0" + minutes : minutes;
      const s = seconds < 10 ? "0" + seconds : seconds;
      return `${m}:${s}`;
    },
  },

  data(){
    return{
      gobackVisible:null,
      exam_id:null,
      name:null,
      title:'确定要离开考试？',
      start_time:null,
      end_time:null,
      duration:null,
      level:null,
      countDownTime: 1800,  //设置默认时间,(单位秒)
      timer: null,  //计数器名称,便于后面清除

      participated:null,
      paper:{
        paper_id:null,
        name:null,
        question_num:null,
        questions:[]
      },
      checkResult:[],
      answerCurrent:0,
      answerPro:0,
      answerSheet:[{
        question_id:null,
        answer:null
      }],
      selectedQuestion:null,
      selectedAns:null,
      deadline:null,
      handin:true,
    }
  },
  methods:{
    convertMinToHms(min){
      var seconds=(min+1)*60;
      return seconds;
    },
    formatGap(start, end) {
      // let staytimeGap = new Date().getTime() - new Date(start).getTime();
      let staytimeGap = new Date(end).getTime() -start;
      let stayHour = Math.floor(staytimeGap / (3600 * 1000));  // 小时
      let leave1 = staytimeGap % (3600 * 1000);
      let stayMin = Math.floor(leave1 / (60 * 1000));  // 分钟
      let leave2 = leave1 % (60 * 1000);
      let staySec = Math.floor(leave2 / 1000);   // 秒
      // return stayHour * 60 + stayMin
      return this.convertMinToHms(stayHour*60+stayMin+Math.floor(staySec/60));
    },
    startCountDown() {
      this.timer = window.setInterval(() => {
        if (this.countDownTime <= 0) {
          //当监测到countDownTime为0时,清除计数器并且移除sessionStorage,然后执行提交试卷逻辑
          sessionStorage.removeItem("exam_time");
          alert("自动为您提交试卷");
          window.clearInterval(this.timer);
          this.submitExam();

        } else if (this.countDownTime > 0) {
          //每秒让countDownTime -1秒,并设置到sessionStorage中
          this.countDownTime--;
          window.sessionStorage.setItem("exam_time", this.countDownTime);
        }
      }, 1000);
    },
    backto(){
      /*答题完成*/
      if(this.checkAnsNum()===true){
        ElMessage({
          message: "未答完题不能离开考试页面",
          type: 'error',
          duration: 3000
        });
      }else{
        this.$router.back();
      }

    },
    selectQuestion(questionId) {
      const index = this.paper.questions.findIndex(question => question.question_id === questionId);
      if (index !== -1) {
        this.selectedQuestion = this.paper.questions[index];
        const existChoice=this.answerSheet.findIndex(answer=>answer.question_id===questionId);
        console.log(existChoice);
        if(existChoice!==-1){
          let ans=this.answerSheet[existChoice].answer;
          if(ans==='A'){
            this.selectedAns=1;
          }else if(ans==='B'){
            this.selectedAns=2;
          }else if(ans==='C'){
            this.selectedAns=3;
          }else if(ans==='D'){
            this.selectedAns=4;
          }
          console.log(this.selectedAns);
        }else{
        this.selectedAns=null;}
      } else {
        console.error(`Question with question_id ${questionId} not found.`);
      }
    },
    submitAnswer(qid,answer){
      console.log("questnum"+this.paper.question_num);
      if(!this.selectedQuestion)
        return;
      let ans=null;
      if(answer===1){
        ans='A';
      }else if(answer===2){
        ans='B';
      }else if(answer===3){
        ans='C';
      }else if(answer===4){
        ans='D';
      }else{
        console.error("输入答案有误");
      }
      console.log("qid"+qid);
      if(qid !== null && qid >= 0 && qid <= this.checkResult.length+1){
        const existingAnswerIndex = this.answerSheet.findIndex(item => item.question_id === qid);
        if (existingAnswerIndex !== -1) {
        // If the question is already in the answerSheet, update the answer
        this.answerSheet[existingAnswerIndex].answer = ans;
        console.log(qid+"选择变为"+this.answerSheet[existingAnswerIndex].answer );
      }else{
        this.answerSheet.push({
          question_id: qid,
          answer: ans
        });
        console.log("cur"+this.answerCurrent);
        this.answerCurrent++;
        this.checkResult[qid]=true;
        this.handin=this.checkAnsNum();
        console.log(this.answerSheet);
        this.format();
          console.log(qid+"选择是"+ans );
      }}
    },
    checkAnsNum(){
      if(this.answerCurrent===this.paper.question_num){
        return false;}
      return true;
    },
    format() {
      if (this.paper.question_num) {
        if(this.answerCurrent > this.paper.question_num){
          this.answerCurrent = this.paper.question_num;
        }
        this.answerPro = (this.answerCurrent / this.paper.question_num) * 100;
        return this.answerCurrent + "/" + this.paper.question_num;
      } else {
        this.answerPro = 0;
        return 0;
      }
    },
    submitExam() {
      this.answerSheet.shift();
      this.answerSheet.sort((a, b) => a.question_id - b.question_id);
      console.log(this.answerSheet);
      axios.post(
          '/api/answer-sheets',
          {
            exam_id:this.exam_id,
            answers:this.answerSheet,
          },
          {
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }}
      ).then(response=>{
        const data=response.data.data;
        this.$router.back();
        window.clearInterval(this.timer);
          console.log("提交成功");
      });

    },
    initCheckResult() {
      let max=0;
      // 初始化checkResult对象
      for(let i=0;i<this.paper.questions.length;i++){
        if(max <=this.paper.questions[i].question_id){
          max=this.paper.questions[i].question_id;
        }
      }
      for(let i=0;i<max+1;i++){
        this.checkResult[i]=false;
      }
      console.log("checkrelen",this.checkResult.length);
    },
    fetchExam(examId){
      axios.get(`/api/exams/${examId}`,
          {
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }}).then(response=>{
        const examData = response.data.data;
        console.log("examdata "+examData);
        this.exam_id = examData.exam_id;
        this.name = examData.name;
        this.start_time = examData.start_time;
        this.end_time = examData.end_time;
        this.duration = examData.duration;
        this.countDownTime=this.formatGap(new Date().getTime(),this.end_time);
        this.level = examData.level;
        this.participated = examData.participated;
        this.paper.paper_id = examData.paper.paper_id;
        this.paper.name = examData.paper.name;
        this.paper.question_num = examData.paper.question_num;
        this.paper.questions = examData.paper.questions;
        this.initCheckResult();

      }).catch(error=>{
        console.log('获取试卷失败2',error);
      })

    },
    fetchExamMock() {
      return new Promise((resolve, reject) => {
        // 模拟考试数据
        const examData = {
          exam_id: 1,
          name: '模拟考试',
          start_time: '2024-03-27 09:00:00',
          end_time: '2024-03-27 12:00:00',
          duration: 180, // 3小时
          level: 1,
          participated: 1,
          paper: {
            paper_id: 1,
            name: '模拟试卷',
            question_num: 10,
            questions: [],
          },
        };

        // 生成10个题目信息
        for (let i = 1; i <= 10; i++) {
          examData.paper.questions.push({
            question_id: 100-i,
            description: `题目${i}`,
            answer: 'A',
            a: `选项A_${i}`,
            b: `选项B_${i}`,
            c: `选项C_${i}`,
            d: `选项D_${i}`,
          });
        }
        this.exam_id = examData.exam_id;
        this.name = examData.name;
        this.start_time = examData.start_time;
        this.end_time = examData.end_time;
        this.deadline=new Date(this.end_time).getTime()/1000+' ';
        this.duration = examData.duration;
        this.level = examData.level;
        this.participated = examData.participated;
        this.paper.paper_id = examData.paper.paper_id;
        this.paper.name = examData.paper.name;
        this.paper.question_num = examData.paper.question_num;
        this.paper.questions = examData.paper.questions;
        // 模拟异步请求
        setTimeout(() => {
          resolve(examData);
        }, 50);
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
    ElButton,
    ElTooltip,
    ElPopover,
    ElMessage

  },
  mounted() {
    const examId=this.$route.params.id;
    console.log('examId',examId);
    this.exam_id=examId;
    this.fetchExam(this.exam_id);

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
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
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
  .box {
    height: auto;
    line-height: unset;
    position: relative;
    margin-bottom: 15px;
    font-size: 14px;
    width: 35px;
    margin-top: unset;
    margin-right: unset;
    display: inline-block;
    .checki {
      border: 1px solid #dcdfe6;
      color: #dcdfe6;
      width: 27px;
      height: 27px;
      text-align: center;
      display: inline-block;
      line-height: 27px;
      background: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
    .checked {
      border: 1px solid #dcdfe6;
      color: #4b7cff;
      width: 27px;
      height: 27px;
      text-align: center;
      display: inline-block;
      line-height: 27px;
      background: #b6e3ff;
      border-radius: 50%;
      cursor: pointer;
    }
    }}
/deep/ .el-radio{
  display: block;
  line-height: 23px;
  white-space: normal;
  margin-right: 0;
}
</style>
