<!-- <template>
    <div class="card">
        <div class="card-img-fluid mh-100" >
            <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 text-center mh-100" >
                <img class="card-img" src="../../assets/img/carousel-2.jpg" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h2 class="card-title">前台模式</h2>
                    <p>咨询导览、挂号收费</p>
                    <button @click="gotoqiantai" class="btn btn-success">前台工作</button>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 text-center mh-100" >
            <img class="card-img" src="../../assets/img/carousel-1.jpg" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h2 class="card-title">医助模式</h2>
                    <p>术前准备、注射工作</p>
                    <button @click="gotoyizhu" class="btn btn-success">医助工作</button>
                </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 text-center mh-100" >
            <img class="card-img" src="../../assets/img/carousel-3.jpg" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h2 class="card-title">医师模式</h2>
                    <p>门诊坐诊、手术操刀</p>
                    <button @click="gotoyishi" class="btn btn-success">医师工作</button>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "cos-card",
    methods:{
        gotoqiantai(){
            this.$router.replace('/qiantai')
        },
        gotoyizhu(){
            this.$router.replace('/yizhu')
        },
        gotoyishi(){
            this.$router.replace('/yishi')
        }
    }
};
</script> -->



<template>
    <div class="card" style="margin-top: 100px;">
        <div class="card-img-fluid mh-100">
            <div class="row" >
                <div class="col-lg-4 col-md-4 col-sm-4 text-center mh-100">
                    <div class="image-container" @mouseover="showText(1)" @mouseleave="hideText(1)">
                        <img class="card-img" src="../../assets/img/team-1.jpg" alt="Card image" style="width:100%">
                        <div class="card-body">
                            <h2 class="card-title">前台模式</h2>
                            <p>咨询导览、挂号收费</p>
                            <button @click="gotoqiantai" class="btn btn-success">前台工作</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 text-center mh-100">
                    <div class="image-container" @mouseover="showText(2)" @mouseleave="hideText(2)">
                        <img class="card-img" src="../../assets/img/team-3.jpg" alt="Card image" style="width:100%">
                        <div class="card-body">
                            <h2 class="card-title">医助模式</h2>
                            <p>术前准备、注射工作</p>
                            <button @click="gotoyizhu" class="btn btn-success">医助工作</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 text-center mh-100">
                    <div class="image-container" @mouseover="showText(3)" @mouseleave="hideText(3)">
                        <img class="card-img" src="../../assets/img/team-5.jpg" alt="Card image" style="width:100%">
                        <div class="card-body">
                            <h2 class="card-title">医师模式</h2>
                            <p>门诊坐诊、手术操刀</p>
                            <button @click="gotoyishi" class="btn btn-success">医师工作</button>
                        </div>
                    </div>
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
            document.querySelectorAll('.image-container')[index - 1].querySelector('.card-body').style.opacity = '1';
        },
        hideText(index) {
            document.querySelectorAll('.image-container')[index - 1].querySelector('.card-body').style.opacity = '0';
        }
    }
}
</script>

<style>
.image-container {
    position: relative;
    overflow: hidden;
    transition: opacity 0.5s ease;
}

.card-body {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    opacity: 0;
}
</style>
