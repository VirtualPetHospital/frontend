<template>
    <div class="card">
        <div class="card img-fluid">
            <img v-if="showMap" class="card-img-top" src="../../assets/img/HospitalGuide3.png" alt="Card image" style="width:100%">
            <img v-else class="card-img-top" src="../../assets/img/HospitalGuide2.png" alt="Card image" style="width:100%">
            <div class="card-img-overlay">
                <h2 class="card-title">医院导览图</h2>
                <button v-if="showMap" @click="showPanorama" type="button" class="btn btn-primary" style="position:absolute; bottom:20px; right:20px;">返回</button>
                <button v-else @click="hidePanorama" type="button" class="btn btn-primary" style="position:absolute; bottom:20px; right:20px;">进入医院</button>
                <!-- 科室部分 -->
                <!-- 免疫室 -->
                <router-link v-if="showMap" to="/photoSphere?index=1">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:26%; width: 5%; height: 8%;">
                </router-link>
                <!-- 化验室 -->
                <router-link v-if="showMap" to="/photoSphere?index=2">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:36%; width: 5%; height: 8%;">
                </router-link>
                <!-- 档案室 -->
                <router-link v-if="showMap" to="/photoSphere?index=3">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:46%; width: 5%; height: 8%;">
                </router-link>
                <!-- 诊室 -->
                <router-link v-if="showMap" to="/photoSphere?index=4">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:54%; width: 5%; height: 8%;">
                </router-link>
                <!-- 处置室 -->
                <router-link v-if="showMap" to="/photoSphere?index=5">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:63%; width: 5%; height: 8%;">
                </router-link>
                <!-- 手术室 -->
                <router-link v-if="showMap" to="/photoSphere?index=6">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:7%; left:71%; width: 5%; height: 8%;">
                </router-link>
                 <!-- 病例剖检室 -->
                <router-link v-if="showMap" to="/photoSphere?index=7">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:24%; width: 5%; height: 8%;">
                </router-link>
                <!-- 药房 -->
                <router-link v-if="showMap" to="/photoSphere?index=8">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:36%; width: 5%; height: 8%;">
                </router-link>
                <!-- 手术准备室 -->
                <router-link v-if="showMap" to="/photoSphere?index=9">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:46%; width: 5%; height: 8%;">
                </router-link>
                <!-- 专科检查室 -->
                <router-link v-if="showMap" to="/photoSphere?index=10">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:57%; width: 5%; height: 8%;">
                </router-link>
                <!-- 影像室 -->
                <router-link v-if="showMap" to="/photoSphere?index=11">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:71%; width: 5%; height: 8%;">
                </router-link>
                <!-- 注射室 -->
                <router-link v-if="showMap" to="/photoSphere?index=12">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:70%; left:81%; width: 5%; height: 8%;">
                </router-link>
                <!-- 前台 -->
                <router-link v-if="showMap" to="/photoSphere?index=13">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:38%; left:24%; width: 5%; height: 8%;">
                </router-link>
                <!-- 住院部 -->
                <router-link v-if="showMap" to="/photoSphere?index=14">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:39%; left:75%; width: 5%; height: 8%;">
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "hospital-guide-card",
    data() {
        return {
            showMap: false
        };
    },
    methods: {
        showPanorama() {
            this.showMap = false;
        },
        hidePanorama() {
            this.showMap = true;
        }
    }
};
</script>

<style scoped>
.location-img {
    transition: transform 0.3s ease; /* 添加一个渐变效果，持续0.3秒，缓和函数为ease */
}

.location-img:hover {
    transform: scale(1.1); /* 当鼠标悬停时，图片将放大到110% */
}
</style>
