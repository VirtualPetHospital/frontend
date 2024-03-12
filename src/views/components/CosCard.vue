
<!-- 
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
}

.card-body {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    opacity: 0;
    transition: opacity 0.5s ease;
}
</style> -->

<template>
    <div class="transparent-bg" style="margin-top: 100px;">
        <!-- <div class="card-img-fluid mh-100">
            <div class="row" >
                <div class="col-lg-4 col-md-4 col-sm-4  text-center mh-100 transparent-bg">
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
        </div> -->


        <div class="wolai d-flex text-center mh-100 transparent-bg">
            <div class="image-container" @mouseover="showText(1)" @mouseleave="hideText(1)">
                <img class="card-img" src="../../assets/img/team-1.jpg" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h2 class="card-title">前台模式</h2>
                    <p>咨询导览、挂号收费</p>
                    <button @click="gotoqiantai" class="btn btn-success">前台工作</button>
                </div>
            </div>
            <div class="image-container" @mouseover="showText(2)" @mouseleave="hideText(2)">
                <img class="card-img" src="../../assets/img/team-3.jpg" alt="Card image" style="width:100%">
                <div class="card-body">
                    <h2 class="card-title">医助模式</h2>
                    <p>术前准备、注射工作</p>
                    <button @click="gotoyizhu" class="btn btn-success">医助工作</button>
                </div>
            </div>
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
            const cardBody = container.querySelector('.card-body');
            cardBody.style.opacity = '1';
            cardBody.style.height = container.clientHeight + 'px';
        },
        hideText(index) {
            const cardBody = document.querySelectorAll('.image-container')[index - 1].querySelector('.card-body');
            cardBody.style.opacity = '0';
            cardBody.style.height = '0';
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



.card-body {
    /* position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    opacity: 0;
    transition: opacity 0.5s ease, height 0.5s ease;
    overflow: hidden;
    height: 0;
     */

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
</style>
