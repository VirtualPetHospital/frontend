<template>
    <div class="card">
        <div class="card img-fluid" >
            <img class="card-img-top" src="../../assets/img/HospitalGuide.jpg" alt="Card image" style="width:100%">
            <div class="card-img-overlay">
                <h2 class="card-title">医院导览图</h2>
                <!-- <button type="button" class="btn btn-dark" style="position:absolute;top:50%; left:50%">黑色</button> -->
                <!-- 免疫室 -->
                <router-link to="/photoSphere?index=1">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:25%; left:26%; width: 5%; height: 8%;">
                </router-link>
                
                <!-- 化验室 -->
                <router-link to="/photoSphere?index=2">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:22%; left:36%; width: 5%; height: 8%;">
                </router-link>

                <!-- 档案室 -->
                <router-link to="/photoSphere?index=3">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:18%; left:46%; width: 5%; height: 8%;">
                </router-link>

                <!-- 诊室 -->
                <router-link to="/photoSphere?index=4">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:15%; left:54%; width: 5%; height: 8%;">
                </router-link>

                <!-- 处置室 -->
                <router-link to="/photoSphere?index=5">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:35%; left:29%; width: 5%; height: 8%;">
                </router-link>

                <!-- 手术室 -->
                <router-link to="/photoSphere?index=6">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:31%; left:40%; width: 5%; height: 8%;">
                </router-link>

                <!-- 病例剖检室 -->
                <router-link to="/photoSphere?index=7">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:32%; left:46%; width: 4%; height: 6%;">
                </router-link>

                <!-- 药房 -->
                <router-link to="/photoSphere?index=8">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:23%; left:59%; width: 5%; height: 8%;">
                </router-link>

                <!-- 手术准备室 -->
                <router-link to="/photoSphere?index=9">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:54%; left:27%; width: 5%; height: 8%;">
                </router-link>

                <!-- 专科检查室 -->
                <router-link to="/photoSphere?index=10">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:48%; left:39%; width: 5%; height: 8%;">
                </router-link>

                <!-- 影像室 -->
                <router-link to="/photoSphere?index=11">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:38%; left:54%; width: 5%; height: 8%;">
                </router-link>

                <!-- 注射室 -->
                <router-link to="/photoSphere?index=12">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:32%; left:65%; width: 5%; height: 8%;">
                </router-link>

                <!-- 前台 -->
                <router-link to="/photoSphere?index=13">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:62%; left:35%; width: 5%; height: 8%;">
                </router-link>

                <!-- 住院部 -->
                <router-link to="/photoSphere?index=14">
                    <img class="location-img" src="../../assets/img/location.png" style="position:absolute;top:45%; left:65%; width: 5%; height: 8%;">
                </router-link>
            </div>
            
        </div>
    </div>
</template>

<script>

export default {
  name: "hospital-guide-card",
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