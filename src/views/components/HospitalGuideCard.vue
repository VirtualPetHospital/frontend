<template>
    <div class="card">
        <div class="card img-fluid">
            <img v-if="showMap" class="card-img-top" src="../../assets/img/HospitalGuide3.png" alt="Card image" style="width:100%">
            <img v-else class="card-img-top" src="../../assets/img/HospitalGuide2.png" alt="Card image" style="width:100%">
            <div class="card-img-overlay" @mouseleave="hideLocationName">
                <h2 class="card-title">医院导览图</h2>
                <button v-if="showMap" @click="showPanorama" type="button" class="btn btn-primary" style="position:absolute; bottom:20px; right:20px; z-index: 1001;">返回</button>
                <button v-else @click="hidePanorama" type="button" class="btn btn-primary" style="position:absolute; bottom:20px; right:20px;">进入医院</button>
                <!-- 科室部分 -->
                <!-- 免疫室//档案室 -->
                <div class="location-container immune-container" @mouseover="showLocationName('档案室')" v-if="showMap">
                    <router-link to="/photoSphere?index=3" data-name="档案室">
                        <img class="location-img immune" src="../../assets/img/room/1.png" style="position:absolute;top:2.8%; left:11%; width: 23%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '档案室'" style="position:absolute;top:4%; left:24%; z-index: 999;">档案室</span>
                    </router-link>
                </div>
                <!-- 化验室 -->
                <div class="location-container lab-container" @mouseover="showLocationName('化验室')" v-if="showMap">
                    <router-link to="/photoSphere?index=2" data-name="化验室">
                        <img class="location-img lab" src="@/assets/img/room/2.png" style="position:absolute;top:2.2%; left:32.8%; width: 11.5%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '化验室'" style="position:absolute;top:4%; left:38%; z-index: 999;">化验室</span>
                    </router-link>
                </div>
                <!-- 档案室//免疫室 -->
                <div class="location-container archive-container" @mouseover="showLocationName('免疫室')" v-if="showMap">
                    <router-link to="/photoSphere?index=1" data-name="免疫室">
                        <img class="location-img archive" src="@/assets/img/room/3.png" style="position:absolute;top:2%; left:42%; width: 11.8%;">
                        <span class="btn btn-lg btn-primary location-name" v-if="isLocationNameVisible && locationName === '免疫室'" style="position:absolute;top:4%; left:46%; z-index: 999;">免疫室</span>
                    </router-link>
                </div>
                <!-- 诊室 -->
                <div class="location-container consultation-container" @mouseover="showLocationName('诊室')" v-if="showMap">
                    <router-link to="/photoSphere?index=4" data-name="诊室">
                        <img class="location-img consultation" src="../../assets/img/room/4.png" style="position:absolute;top:1.5%; left:49.8%; width: 15%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '诊室'" style="position:absolute;top:4%; left:55%; z-index: 999;">诊室</span>
                    </router-link>
                </div>
                <!-- 处置室 -->
                <div class="location-container treatment-container" @mouseover="showLocationName('处置室')" v-if="showMap">
                    <router-link to="/photoSphere?index=5" data-name="处置室">
                        <img class="location-img treatment" src="../../assets/img/room/5.png" style="position:absolute;top:1.5%; left:59.5%; width: 15.5%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '处置室'" style="position:absolute;top:4%; left:65%; z-index: 999;">处置室</span>
                    </router-link>
                </div>
                <!-- 手术室 -->
                <div class="location-container operation-container" @mouseover="showLocationName('手术室')" v-if="showMap">
                    <router-link to="/photoSphere?index=6" data-name="手术室">
                        <img class="location-img operation" src="../../assets/img/room/6.png" style="position:absolute;top:1.5%; left:66.8%; width: 16.5%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '手术室'" style="position:absolute;top:4%; left:75%; z-index: 999;">手术室</span>
                    </router-link>
                </div>
                <!-- 病例剖检室//药房 -->
                <div class="location-container examination-container" @mouseover="showLocationName('药房')" v-if="showMap">
                    <router-link to="/photoSphere?index=8" data-name="药房">
                        <img class="location-img examination" src="../../assets/img/room/7.png" style="position:absolute;top:64.5%; left:4%; width: 28%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '药房'" style="position:absolute;top:66%; left:24%; z-index: 999;">药房</span>
                    </router-link>
                </div>
                <!-- 药房//病例解剖室 -->
                <div class="location-container pharmacy-container" @mouseover="showLocationName('病例解剖室')" v-if="showMap">
                    <router-link to="/photoSphere?index=7" data-name="病例解剖室">
                        <img class="location-img pharmacy" src="../../assets/img/room/8.png" style="position:absolute;top:58%; left:30.5%; width: 14.5%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '病例解剖室'" style="position:absolute;top:66%; left:37%; z-index: 999;">病例解剖室</span>
                    </router-link>
                </div>
                <!-- 手术准备室 -->
                <div class="location-container preparation-container" @mouseover="showLocationName('手术准备室')" v-if="showMap">
                    <router-link to="/photoSphere?index=9" data-name="手术准备室">
                        <img class="location-img preparation" src="../../assets/img/room/9.png" style="position:absolute;top:58%; left:43.2%; width: 14%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '手术准备室'" style="position:absolute;top:66%; left:49%; z-index: 999;">手术准备室</span>
                    </router-link>
                </div>
                <!-- 专科检查室 -->
                <div class="location-container examination-room-container" @mouseover="showLocationName('专科检查室')" v-if="showMap">
                    <router-link to="/photoSphere?index=10" data-name="专科检查室">
                        <img class="location-img examination-room" src="../../assets/img/room/10.png" style="position:absolute;top:58%; left:52.4%; width: 20%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '专科检查室'" style="position:absolute;top:66%; left:60%; z-index: 999;">专科检查室</span>
                    </router-link>
                </div>
                <!-- 影像室 -->
                <div class="location-container imaging-room-container" @mouseover="showLocationName('影像室')" v-if="showMap">
                    <router-link to="/photoSphere?index=11" data-name="影像室">
                        <img class="location-img imaging-room" src="../../assets/img/room/11.png" style="position:absolute;top:57.5%; left:63.8%; width: 20.8%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '影像室'" style="position:absolute;top:66%; left:73%; z-index: 999;">影像室</span>
                    </router-link>
                </div>
                <!-- 注射室 -->
                <div class="location-container injection-room-container" @mouseover="showLocationName('注射室')" v-if="showMap">
                    <router-link to="/photoSphere?index=12" data-name="注射室">
                        <img class="location-img injection-room" src="../../assets/img/room/12.png" style="position:absolute;top:57.5%; left:73.8%; width: 24%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '注射室'" style="position:absolute;top:66%; left:84%; z-index: 999;">注射室</span>
                    </router-link>
                </div>
                <!-- 前台 -->
                <div class="location-container reception-container" @mouseover="showLocationName('前台')" v-if="showMap">
                    <router-link to="/photoSphere?index=13" data-name="前台">
                        <img class="location-img reception" src="../../assets/img/room/13.png" style="position:absolute;top:17%; left:2%; width: 32.5%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '前台'" style="position:absolute;top:40%; left:22%; z-index: 999;">前台</span>
                    </router-link>
                </div>
                <!-- 住院部 -->
                <div class="location-container inpatient-container" @mouseover="showLocationName('住院部')" v-if="showMap">
                    <router-link to="/photoSphere?index=14" data-name="住院部">
                        <img class="location-img inpatient" src="../../assets/img/room/14.png" style="position:absolute;top:28.5%; left:66%; width: 23%;">
                        <span class="btn btn-lg btn-secondary location-name" v-if="isLocationNameVisible && locationName === '住院部'" style="position:absolute;top:35%; left:76%; z-index: 999;">住院部</span>
                    </router-link>
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
    border-color: #7399f8;
    z-index: 998;
}

.location-container:hover .location-name {
    display: block; /* 当图片悬停时显示 */
}

.location-name {
    position: absolute;
    top: 50%; /* 居中显示 */
    left: 50%; /* 居中显示 */
    transform: translate(-50%, -50%);
    background-color: rgb(75, 124, 255); /* 设置背景颜色和透明度 */
    padding: 5px 10px; /* 设置内边距 */
    border-radius: 5px; /* 设置圆角 */
    display: none; /* 初始状态下隐藏 */
    font-size: 20px;
}
/* 化验室容器样式 */
.lab-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 2.2%; /* 设置顶部距离为百分比 */
    left: 32.8%; /* 设置左侧距离为百分比 */
}

/* 化验室图标样式 */
.lab {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}
/* 免疫室容器样式 */
.immune-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 2.2%; /* 设置顶部距离为百分比 */
    left: 11%; /* 设置左侧距离为百分比 */
}

/* 免疫室图标样式 */
.immune {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}


/* 档案室容器样式 */
.archive-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 2%; /* 设置顶部距离为百分比 */
    left: 42%; /* 设置左侧距离为百分比 */
}

/* 档案室图标样式 */
.archive {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 诊室容器样式 */
.consultation-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 1.5%; /* 设置顶部距离为百分比 */
    left: 49.8%; /* 设置左侧距离为百分比 */
}

/* 诊室图标样式 */
.consultation {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 处置室容器样式 */
.treatment-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 1.5%; /* 设置顶部距离为百分比 */
    left: 59.5%; /* 设置左侧距离为百分比 */
}

/* 处置室图标样式 */
.treatment {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 手术室容器样式 */
.operation-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 1.5%; /* 设置顶部距离为百分比 */
    left: 66.8%; /* 设置左侧距离为百分比 */
}

/* 手术室图标样式 */
.operation {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 病例剖检室容器样式 */
.examination-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 64.5%; /* 设置顶部距离为百分比 */
    left: 4%; /* 设置左侧距离为百分比 */
}

/* 病例剖检室图标样式 */
.examination {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 药房容器样式 */
.pharmacy-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 58%; /* 设置顶部距离为百分比 */
    left: 30.5%; /* 设置左侧距离为百分比 */
}

/* 药房图标样式 */
.pharmacy {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 手术准备室容器样式 */
.preparation-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 58%; /* 设置顶部距离为百分比 */
    left: 43.2%; /* 设置左侧距离为百分比 */
}

/* 手术准备室图标样式 */
.preparation {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 专科检查室容器样式 */
.examination-room-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 58%; /* 设置顶部距离为百分比 */
    left: 52.4%; /* 设置左侧距离为百分比 */
}

/* 专科检查室图标样式 */
.examination-room {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 影像室容器样式 */
.imaging-room-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 57.5%; /* 设置顶部距离为百分比 */
    left: 63.8%; /* 设置左侧距离为百分比 */
}

/* 影像室图标样式 */
.imaging-room {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 注射室容器样式 */
.injection-room-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 57.5%; /* 设置顶部距离为百分比 */
    left: 73.8%; /* 设置左侧距离为百分比 */
}

/* 注射室图标样式 */
.injection-room {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 前台容器样式 */
.reception-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 17%; /* 设置顶部距离为百分比 */
    left: 2%; /* 设置左侧距离为百分比 */
}

/* 前台图标样式 */
.reception {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}

/* 住院部容器样式 */
.inpatient-container {
    width: 20%; /* 设置宽度为百分比 */
    height: 20%; /* 设置高度为百分比 */
    top: 28.5%; /* 设置顶部距离为百分比 */
    left: 66%; /* 设置左侧距离为百分比 */
}

/* 住院部图标样式 */
.inpatient {
    width: 100%; /* 图标宽度为容器宽度的100% */
    height: auto; /* 根据宽度等比例缩放高度 */
}


</style>
