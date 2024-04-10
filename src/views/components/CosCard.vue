<template>
  <div class="transparent-bg" style="margin-top: 100px;">
    <div class="wolai d-flex text-center mh-100 transparent-bg">
      <div class="image-container" @mouseover="showText(1)" @mouseleave="hideText(1)">
        <img class="card-img" src="../../assets/img/team-1.jpg" alt="Card image" style="width:100%">
        <button @click="gotoqiantai" class="btn btn-success" style="position: absolute; bottom: 10px; left: 50%;width:95%; transform: translateX(-50%);">前台工作</button>
        <div class="card-body2">
          <h2 class="card-title">前台模式</h2>
          <p>咨询导览、挂号收费</p>
          <button @click="gotoqiantai" class="btn btn-success">前台工作</button>
        </div>
      </div>
      <div class="image-container" @mouseover="showText(2)" @mouseleave="hideText(2)">
        <img class="card-img" src="../../assets/img/team-3.jpg" alt="Card image" style="width:100%">
        <button @click="gotoyizhu" class="btn btn-success" style="position: absolute; bottom: 10px; left: 50%;width:95%; transform: translateX(-50%);">医助工作</button>
        <div class="card-body2">
          <h2 class="card-title">医助模式</h2>
          <p>术前准备、注射工作</p>
          <button @click="gotoyizhu" class="btn btn-success">医助工作</button>
        </div>
      </div>
      <div class="image-container" @mouseover="showText(3)" @mouseleave="hideText(3)">
        <img class="card-img" src="../../assets/img/team-5.jpg" alt="Card image" style="width:100%">
        <button @click="gotoyishi" class="btn btn-success" style="position: absolute; bottom: 10px; left: 50%;width:95%; transform: translateX(-50%);">医师工作</button>
        <div class="card-body2">
          <h2 class="card-title">医师模式</h2>
          <p>门诊坐诊、手术操刀</p>
          <button @click="gotoyishi" class="btn btn-success">医师工作</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  methods: {
    gotoqiantai() {
      this.$router.replace('/qiantai')
    },
    gotoyizhu() {
      this.$router.replace('/yizhu')
    },
    gotoyishi() {
      this.$router.replace('/yishi')
    },
    showText(index) {
      const container = document.querySelectorAll('.image-container')[index - 1];
      const cardBody = container.querySelector('.card-body2');
      if (cardBody) {
        cardBody.classList.add('active');
      }
    },
    hideText(index) {
      const container = document.querySelectorAll('.image-container')[index - 1];
      const cardBody = container.querySelector('.card-body2');
      if (cardBody) {
        cardBody.classList.remove('active');
      }
    }
  }
}
</script>

<style>
.image-container {
  position: relative;
  overflow: hidden;
  flex: 1;
  margin: 0 10px;
  background-color: transparent;
}
.wolai {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.transparent-bg {
  background-color: transparent;
}

.card-body2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  transition: opacity 0.6s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  box-sizing: border-box;
}

.card-body2.active {
  opacity: 1;
  height: 100%;
}
.card-img {
  width: 100%;
  height: 100%;
}
</style>
