<template>
  <div class="card p-4" >
    <div class=" row">
      <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
      <div class="col-12">

        <h3>考试id：{{this.exam_id}}</h3>
        <el-container>
          <el-aside class="asideLeft">
            <div class="aside_div">
              <div class="oneItem">
                <div class="fl">
                  <div class="fs14">试题总数</div>
                  <div v-if="this.answerInfo"><i class="fs28">{{this.answerInfo.length}}</i><i class="fs12 co333">题</i></div>
                </div>
              </div>
              <div class="itemInner">
                <div class="fs16">
                  单选题
                </div>
                <div class="box-list" v-if="showBoxlist">
                  <div
                      class="box normal-box question_cbox"
                      style="padding-left: 0px"
                      v-for="(answer,index) in this.answerInfo"
                      :key="index"
                  >
                    <div
                        :class="{ 'ansRight':answer.isCorrect, 'ansFalse': !answer.isCorrect }"
                        @click="selectQuestion(answer, index)"
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
                <span>你的选项</span>
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
  name:"TakeExam",
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
      showBoxlist:false,

    }
  },
  methods:{
    backto(){
      this.$router.go(-1);
    },
    selectQuestion(answer) {
      console.log(answer);
      let qid=answer.question_id;
      axios.get(
          `/api/questions/${qid}`,
          {
            params:{
              question_id:qid
            },
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }
          }
      ).then(response=>{
        const resdata=response.data;
        console.log(resdata);
        this.selectedQuestion.description=resdata.data.description
        this.selectedQuestion.a=resdata.data.a;
        this.selectedQuestion.b=resdata.data.b;
        this.selectedQuestion.c=resdata.data.c;
        this.selectedQuestion.d=resdata.data.d;
        this.selectedQuestion.answer=resdata.data.answer;
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
    checkResult(answer) {
      const qid = answer.question_id;
      return axios.get(`/api/questions/${qid}`, {
        params: { qid: answer.question_id },
        withCredentials: true,
        headers: {
          'Session': sessionStorage.getItem('sessionId'),
          'Content-Type': 'application/json',
        }
      })
          .then(res => {
            const trueAns = res.data.data.answer;
            console.log(trueAns === answer.answer);
            return trueAns === answer.answer;
          })
          .catch(error => {
            console.error('Error fetching question info:', error);
            return false; // 如果出现错误，返回 false
          });
    },




    fetchExam(){
      axios.get(`/api/answer-sheets/${this.exam_id}`,
          {
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',

            }
          }).then(async response => {
        const examData = response.data.data;
        this.answerInfo = examData.answers;
        const requests = this.answerInfo.map(answer => {
          const qid = answer.question_id;
          return axios.get(`/api/questions/${qid}`, {
            params: {qid: answer.question_id},
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
          const answer = this.answerInfo[index];
          answer.isCorrect = trueAns === answer.answer;
          this.showBoxlist = true;
        }
        );
        if(this.answerInfo){
          this.selectQuestion(this.answerInfo[0]);
        }
      }).catch(error=>{
        console.log('获取试卷失败2',error);
      })

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
    const name=this.$route.params.name;

    console.log('name',name);
    this.name=name;
    this.exam_id=examId;
    console.log('examId IN PAPERINFO',this.exam_id);
    this.fetchExam();

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
  left: -10px;
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
    .ansRight {
      border: 1px solid #dcdfe6;
      color: #008025;
      width: 27px;
      margin-left: 0px;
      height: 27px;
      text-align: center;
      display: inline-block;
      line-height: 27px;
      background: #b6ffba;
      border-radius: 50%;
      cursor: pointer;
    }
    .ansFalse {
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
  }}
</style>
