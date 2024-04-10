import { MAP_ID, MAP_DATA_PATH, EFFECT_PATH } from "./const";

class MapApplication {
  constructor() {
    this.map = null;

    this.onlyPopConfig = null;
    this.manyPopConfigs = null;

    this.showStoreList = [
      "金悦罗兰",
      "deer",
      "王牌",
      "海尔",
      "金凯莎",
      "金伯利钻石",
      "步步高",
    ];

    this.manyStoreList = [];
  }

  /**
   * 初始化地图
   */
  initMap() {

    var container = document.getElementById("map-container");
    console.log(window);
    /* global esmap*/
    this.map = new window.esmap.ESMap({
      mode: window.esmap.MapMode.Building, // 加载室内地图
      container: container, //渲染dom
      mapDataSrc: MAP_DATA_PATH, //地图数据位置
      visibleFloors: "all", //更多初始化参数配置请参考https://www.esmap.cn/docs/sdk3.0-tutorial/map-init.html
      token: "escope",
    });
    //打开地图数据
    this.map.openMapById(MAP_ID);
    this.map.showCompass = true; //显示指南针

    // 定义楼层控件的配置属性
    var ctlOpt = new esmap.ESControlOptions({
      position: esmap.ESControlPositon.RIGHT_TOP,
      //注意：imgURL参数是static目录下图片的路径
      imgURL: "./image/wedgets/",
    });

    this.map.on("loadComplete", () => {
      // 创建楼层控件
      var floorControl = new esmap.ESScrollFloorsControl(this.map, ctlOpt);
      this.isShowLoading(false); // 关闭加载动画
      // 初始化气泡组件数据
      this.initPopData();
      console.log("mapApp", mapApp);
      this.clickShadeSign.value = false;
    });
    // 地图点击事件
    this.map.on("mapClickNode", (e) => {
      console.log(e);

      // 记录并打印点集
      // self.tempCoords.push({ x: e.hitCoord.x, y: e.hitCoord.y, offset: 0 })
      // console.log(JSON.stringify(self.tempCoords));

      // 获取当前相机视角
      // console.log(self.map.cameraFlyToHelper())

      // 触发关于气泡生成的事件
      this.managerMapClick(e);
    });
  }

  /**
   * 销毁地图
   */
  destroyMap() {
    this.map.dumpScene();
    this.map = null;
  }

  /**
   * 是否显示loading
   */
  isShowLoading(isShow) {
    document.querySelector(".loading_shade").style.display = isShow
      ? "block"
      : "none";
  }

  /**
   * 搜索地图中的资源信息
   */
  searchRes(keyword) {
    return new Promise((resolve, reject) => {
      var conditions = {
        nodeType: esmap.ESNodeType.MODEL, //nodeType指定为房间模型
        keyword: keyword || "",
      };
      esmap.ESMapUtil.search(this.map, "all", conditions, function (e) {
        console.log("search:", e);
        resolve(e);
      });
    });
  }

  /**
   *  初始化多个气泡的内容数据
   */
  async initPopData() {
    // 根据已知房间名称搜索获取在地图上的位置信息等，以便生成气泡
    const list = await this.searchRes(this.showStoreList.join(" "));
    // 存储地图上房间模型信息的数组
    this.manyStoreList = Array.from(new Set(list));
  }

  /**
   *   管理地图点击
   */
  managerMapClick(e) {
    // 判断元素类型是否是房间模型，并且是否附带RoomLogo属性(RoomLogo属性存放着图片地址)
    if (
      e.nodeType === esmap.ESNodeType.MODEL &&
      e.RoomLogo &&
      window.location.hash == "#/showOnlyPop"
    ) {
      // 将元素传值给生成单个气泡标注方法
      this.showOnlyPop(e);
    }
  }

  /**
   *  生成单独气泡组件
   */
  showOnlyPop(popConfig) {
    // 存储点击元素的配置到onlyPopConfig响应式对象，生成单个气泡子组件
    this.onlyPopConfig.value = popConfig;

    // 获取点击元素所处的楼层计算出高度
    const height = this.map.focusBuilding.getFloorHeight(popConfig.FloorNum);
    // 聚焦点击元素所在的位置
    this.map.cameraFlyTo({
      directionAngle: 20.16, // 视角朝向的方向角
      pitchAngle: 90.85, // 视角朝向的俯仰角
      radius: 100.4, // 视角中心目标点至相机位置本身的距离
      time: 1.5, // 视角移动飞行时间，单位（秒/s）
      x: popConfig.mapCoord.x, // 聚焦点x轴
      y: popConfig.mapCoord.y, // 聚焦点y轴
      z: height, // 聚焦点高度
      callback: () => {
        // 飞行动画结束后的回调函数
      },
    });
  }

  /**
   *  生成多个气泡组件
   */
  showManyPop() {
    // 执行固定飞行视角
    this.map.cameraFlyTo({
      directionAngle: 358.7, // 视角朝向的方向角
      pitchAngle: 52.6, // 视角朝向的俯仰角
      radius: 223.1, // 视角中心目标点至相机位置本身的距离
      x: 12683467.6, // 聚焦点x轴
      y: 2557900.5, // 聚焦点y轴
      z: 20, // 聚焦点高度
      time: 1, // 视角移动飞行时间，单位（秒/s）
      callback: () => {
        // 飞行动画结束后的回调函数
        // 传入搜索出来的房间元素信息，生成多个气泡vue组件
        this.manyPopConfigs.value = this.manyStoreList;
      },
    });
  }

  /**
   *  清空多个气泡组件
   */
  clearManyPop() {
    this.manyPopConfigs.value = [];
  }
}

export default new MapApplication();
