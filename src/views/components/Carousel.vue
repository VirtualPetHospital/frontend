<template>
  <div class="card card-carousel overflow-hidden h-100 p-0">
    <div
      id="carouselExampleCaptions"
      class="carousel slide h-100"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner border-radius-lg h-100">
        <div
          class="carousel-item h-100 active"
          :style="{
            backgroundImage:
              'url(' + require('@/assets/img/carousel-1.jpg') + ')',
            backgroundSize: 'cover',
          }"
        >
          <div
            class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-5"
          >
            <div
              class="icon icon-shape icon-sm bg-white text-center border-radius-md mb-3"
            >
              <i class="ni ni-camera-compact text-dark opacity-10"></i>
            </div>
            <h5 class="text-white mb-1">欢迎使用虚拟宠物医院平台</h5>
            <p>
              尊敬的管理员，请用心负责地管理数据！！
            </p>
          </div>
        </div>
        
        
      </div>
     
    </div>
  </div>
</template>
