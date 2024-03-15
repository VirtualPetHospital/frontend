<template>
    <div class="card">
        <div class="card img-fluid">
            <img v-if="showMap" class="card-img-top" src="../../assets/img/HospitalGuide3.png" alt="Card image" style="width:100%">
            <img v-else class="card-img-top" src="../../assets/img/HospitalGuide2.png" alt="Card image" style="width:100%">
            <div class="card-img-overlay" @mouseleave="hideLocationName">
                <h2 class="card-title">医院导览图</h2>
                <button v-if="showMap" @click="showPanorama" type="button" class="btn btn-primary" style="position:absolute; bottom:20px; right:20px;">返回</button>
                <button v-else @click="hidePanorama" type="button" class="btn btn-primary" style="position:absolute; bottom:20px; right:20px;">进入医院</button>
                <!-- 科室部分 -->
                <!-- 免疫室 -->
                <div class="location-container" @mouseover="showLocationName('免疫室')" v-if="showMap">
                    <router-link to="/photoSphere?index=1" data-name="免疫室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:26%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '免疫室'" style="position:absolute;top:4%; left:24%;">免疫室</span>
                </div>
                <!-- 化验室 -->
                <div class="location-container lab-container" @mouseover="showLocationName('化验室')" v-if="showMap">
                    <router-link to="/photoSphere?index=2" data-name="化验室">
                        <img class="location-img lab" src="../../assets/img/room/huayan.png" style="position:absolute;top:3%; left:33.5%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '化验室'" style="position:absolute;top:4%; left:35%; z-index: 999;">化验室</span>
                </div>
                <!-- 档案室 -->
                <div class="location-container" @mouseover="showLocationName('档案室')" v-if="showMap">
                    <router-link to="/photoSphere?index=3" data-name="档案室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:44%;">
                    </router-link>
                    <span class="btn btn-lg btn-primary location-name" v-if="isLocationNameVisible && locationName === '档案室'" style="position:absolute;top:4%; left:45%; z-index: 999;">档案室</span>
                </div>
                <!-- 诊室 -->
                <div class="location-container" @mouseover="showLocationName('诊室')" v-if="showMap">
                    <router-link to="/photoSphere?index=4" data-name="诊室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:54%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '诊室'" style="position:absolute;top:4%; left:55%; z-index: 999;">诊室</span>
                </div>
                <!-- 处置室 -->
                <div class="location-container" @mouseover="showLocationName('处置室')" v-if="showMap">
                    <router-link to="/photoSphere?index=5" data-name="处置室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:63%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '处置室'" style="position:absolute;top:4%; left:64%; z-index: 999;">处置室</span>
                </div>
                <!-- 手术室 -->
                <div class="location-container" @mouseover="showLocationName('手术室')" v-if="showMap">
                    <router-link to="/photoSphere?index=6" data-name="手术室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:71%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '手术室'" style="position:absolute;top:4%; left:72%; z-index: 999;">手术室</span>
                </div>
                <!-- 病例剖检室 -->
                <div class="location-container" @mouseover="showLocationName('病例剖检室')" v-if="showMap">
                    <router-link to="/photoSphere?index=7" data-name="病例剖检室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:24%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '病例剖检室'" style="position:absolute;top:66%; left:25%; z-index: 999;">病例剖检室</span>
                </div>
                <!-- 药房 -->
                <div class="location-container" @mouseover="showLocationName('药房')" v-if="showMap">
                    <router-link to="/photoSphere?index=8" data-name="药房">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:36%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '药房'" style="position:absolute;top:66%; left:37%; z-index: 999;">药房</span>
                </div>
                <!-- 手术准备室 -->
                <div class="location-container" @mouseover="showLocationName('手术准备室')" v-if="showMap">
                    <router-link to="/photoSphere?index=9" data-name="手术准备室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:46%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '手术准备室'" style="position:absolute;top:66%; left:47%; z-index: 999;">手术准备室</span>
                </div>
                <!-- 专科检查室 -->
                <div class="location-container" @mouseover="showLocationName('专科检查室')" v-if="showMap">
                    <router-link to="/photoSphere?index=10" data-name="专科检查室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:57%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '专科检查室'" style="position:absolute;top:66%; left:58%; z-index: 999;">专科检查室</span>
                </div>
                <!-- 影像室 -->
                <div class="location-container" @mouseover="showLocationName('影像室')" v-if="showMap">
                    <router-link to="/photoSphere?index=11" data-name="影像室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:71%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '影像室'" style="position:absolute;top:66%; left:72%; z-index: 999;">影像室</span>
                </div>
                <!-- 注射室 -->
                <div class="location-container" @mouseover="showLocationName('注射室')" v-if="showMap">
                    <router-link to="/photoSphere?index=12" data-name="注射室">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:81%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '注射室'" style="position:absolute;top:66%; left:82%; z-index: 999;">注射室</span>
                </div>
                <!-- 前台 -->
                <div class="location-container" @mouseover="showLocationName('前台')" v-if="showMap">
                    <router-link to="/photoSphere?index=13" data-name="前台">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:38%; left:24%;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '前台'" style="position:absolute;top:34%; left:25%; z-index: 999;">前台</span>
                </div>
                <!-- 住院部 -->
                <div class="location-container" @mouseover="showLocationName('住院部')" v-if="showMap">
                    <router-link to="/photoSphere?index=14" data-name="住院部">
                        <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:39%; left:75%;;">
                    </router-link>
                    <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '住院部'" style="position:absolute;top:35%; left:76%; z-index: 999;">住院部</span>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "hospital-guide-card",
    data() {
        return {
            showMap: false,
            isLocationNameVisible: false,
            locationName: ''
        };
    },
    methods: {
        showPanorama() {
            this.showMap = false;
        },
        hidePanorama() {
            this.showMap = true;
        },
        showLocationName(name) {
            this.isLocationNameVisible = true;
            this.locationName = name;
        },
        hideLocationName() {
            this.isLocationNameVisible = false;
            this.locationName = '';
        }
    }
};
</script>

<style scoped>
.location-img {
    transition: transform 0.3s ease; /* 添加一个渐变效果，持续0.3秒，缓和函数为ease */
    width:6%;
    height:9%;
}

.location-img:hover {
    transform: scale(1.1); /* 当鼠标悬停时，图片将放大到110% */
    border-color: red;
}

.location-container:hover .location-name {
    display: block; /* 当图片悬停时显示 */
}

.location-name {
    position: absolute;
    top: 50%; /* 居中显示 */
    left: 50%; /* 居中显示 */
    transform: translate(-50%, -50%);
    background-color: rgba(237, 82, 82, 0.8); /* 设置背景颜色和透明度 */
    padding: 5px 10px; /* 设置内边距 */
    border-radius: 5px; /* 设置圆角 */
    display: none; /* 初始状态下隐藏 */
    font-size: 20px;
}
.lab-container {
    width: 100px; /* 设置化验室容器的宽度 */
    height: 200px; /* 设置化验室容器的高度 */
}
.lab {
    width: 117px; /* 设置化验室图标的宽度 */
    height: auto; /* 设置化验室图标的高度 */
}

</style>