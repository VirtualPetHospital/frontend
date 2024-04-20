<template>
  <div class="card p-4" style="margin-left: 10px;height:85vh" >
    <div class=" row">
      <div class="col-12">
        <div class="content" id="content" v-if="this.messageList">
          <div  :key="index" v-for="(item, index) in this.messageList" style="margin-top:20px" >
            <div class="visitor" v-if="item&&item.user=='visitor'">
              <div class="station"></div>
              <div class="text" style="width: 400px;margin-left: 400px">
                <span>{{ item.content }}</span>
              </div>
              <div style="margin-top: 5px">
                <img src="@/assets/img/card-visa.jpg" />
              </div>
            </div>

            <div class="robot" v-if="item && item.user=='robot'">
              <div style="margin-top: 10px;">
                <img src="@/assets/img/bo.jpg"/>
              </div>
              <div class="text2" style="width: 400px;margin-left: 20px">

                <span>{{ item.content }}</span>
              </div>
            <div class="station"></div>
          </div>
          </div>
      </div>
        <div class="bottom">
          <el-input v-model="sendData" placeholder="请输入" style="height: 40px"/>
          <el-button size="large" :disabled="sendFlag" type="primary" v-on:click="sendMessage(sendData, 'visitor')">发送
          </el-button>
        </div>
    </div>
  </div>
  </div>
</template>
<script>
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";

import {ElButton, ElImage, ElInput} from "element-plus";
import {watch} from "vue";
import axios from "axios";

export default{
  name:"Chat",
  data(){
    return{
      messageList:[],
      sendData:'',
      sendFlag:'',
      oldSendData:'',
      streamFlag:true,

    }
  },
  components:{
    ElButton,
    ElInput,
    ElImage
  },
  mounted() {
    watch(this.messageList.value, () => {
      document.getElementById('content').scrollTop = document.getElementById('content').scrollHeight;
    });
    //设置发送状态可点击
    this.sendFlag=false;
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
  updated(){
    // 聊天定位到底部
    let ele = document.getElementById('content');
    ele.scrollTop = ele.scrollHeight;
  },
  methods:{
    sendMessage(data,user){
      if(data<=0){
        alert("输入不能为空");
        return;
      }
      let obj = {};
      obj.user = user;
      obj.content = data;
      this.messageList.push(obj);
      this.sendFlag = true;
      this.oldSendData = data
      this.sendData = '';
      this.postRequest(data);
    },
    loadFlash(){
      let obj = {};
      obj.user = 'robot';
      obj.content = '';
      this.messageList.push(obj);
      let index = 0;
      this.loadLoop = setInterval(() => {
        switch (index % 2) {
          case 0:
            this.messageList[this.messageList.length - 1].content = "加载中...";
            break;
          case 1:
            this.messageList[this.messageList.length - 1].content = "...";
            break;
        }
        index++;
      }, 500);
    },
    postRequest(sendMessage){
      let params = {
        chatID:sessionStorage.getItem('sessionID'),
        stream:false,
        detail:false,
        variables:{
          uid:sessionStorage.getItem('sessionID'),
          name:sessionStorage.getItem("nickname")
        },
        messages:[
          {
            "content":sendMessage,
            "role":"user"
          }
        ]

      };
      this.loadFlash();
      axios({
        method:'post',
        url:'https://api.fastgpt.in/api/v1/chat/completions',
        data:params,
        headers:{
          'Authorization':'Bearer fastgpt-Uphmn15fYbD4jn4Hk7wIGwkM7VOsMeHdsUsZZnqMbOmKKwZDcw06Br',
          'Content-Type': 'application/json',
        }
      }).then((response)=>{
        if(response.data.code===500){
          alert('网络故障请稍后再试');
          this.$router.push('/Chat');
        }
        this.messageList[this.messageList.length - 1].content = '';
        clearInterval(this.loadLoop);
        if (this.streamFlag) {
          let responseFinish;
          let responseByte;
          let index = 0;
          let byteLoop = setInterval(() => {
            responseByte = response.data.choices[0].message.content;
            this.messageList[this.messageList.length - 1].content += responseByte == null ? "" : responseByte;
            //结束
            responseFinish =response.data.choices[0].finish_reason;
            if (responseFinish === "stop") {
              clearInterval(byteLoop);
              this.sendFlag = false
            }
            index++;
          }, 100)
        }
      }).catch(error=>{
        this.sendFlag = false
        this.sendData = this.oldSendData
        alert({message: "请求失败或超时，请重新发送请求.", duration: 5000});
        this.messageList.length = this.messageList.length - 1;
        console.log(JSON.stringify(error))
      })
    }

  }

};
</script>

<style scoped>
.main {
  position: fixed;
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  overflow: hidden;
  max-width: 540px;
  margin: 0 auto;
}

.content {
  width: 100%;
  height: 70vh;
  margin-bottom: 90px;
  margin-top: 40px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 20px;
  -webkit-overflow-scrolling: touch;
  background: #f1f6ff;
}

.robot {
  position: relative;
  display: flex;
  margin-left: 20px;
  margin-top: 5px;
}

.visitor {
  justify-content: flex-end;
  position: relative;
  display: flex;
  margin-top:5px;
}

img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding: 10px 10px;
}


.text {
  max-width: calc(100% - 150px);
  word-break: normal;
  position: relative;
  height: auto;
  background: #b6e3ff;

  min-height: 24px;
  padding: 8px 12px;
  margin: 14px 0 14px -6px;
  border-radius: 5px;
}

.text2{
  max-width: calc(100% - 150px);
  word-break: normal;
  position: relative;
  height: auto;
  background: #FFFFFF;
  min-height: 24px;
  padding: 8px 12px;
  margin: 14px 0 14px -6px;
  border-radius: 5px;
}

.text2:nth-of-type(odd)::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #fff;
  transform: rotate(45deg);
  left: -4px;
  top: 15px;
}

.text:nth-of-type(even)::before {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #93d3ff;
  transform: rotate(45deg);
  right: -4px;
  top: 15px;
}

.bottom {
  display: flex;
  padding: 10px 10px 35px;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: space-between;
  background: rgb(244, 244, 244, .1);
  position: fixed;
  margin-left: 400px;
  max-width: 520px;

  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.van-field {
  flex: 1;
  height: 44px;
  line-height: 25px;
  border-radius: 5px;
  margin: 0 5px;
  font-size: 16px;
}

button {
  width: 85px;
  height: 44px;
  font-size: 16px;
  margin-left: 10px;
}

/deep/ .github-markdown-body {
  font-size: 16px !important;
  line-height: 24px !important;
  padding: 0 !important;
}

/deep/ .github-markdown-body p {
  margin: auto !important;
}

/deep/ .v-md-pre-wrapper {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.card.p-4{
  height:80vh;
}
</style>

