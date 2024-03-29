<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>病例学习</h3>
        <div class="tab-content">
<!--          <el-tabs type="border-card">-->
<!--            <el-tab-pane label="病种名1">1</el-tab-pane>-->
<!--            <el-tab-pane label="病种名2">2</el-tab-pane>-->
<!--            <el-tab-pane label="病种名3">3</el-tab-pane>-->
<!--            <el-tab-pane label="病种名4">4</el-tab-pane>-->
<!--          </el-tabs>-->
          <el-tabs type="border-card" class="rounded-tabs" >
            <el-tab-pane v-for="category in categories" :key="category.category_id" :label="category.name">
              <el-row>
                <el-col v-for="(disease, index) in diseases[category.category_id]" :key="index" :span="8" >
                  <el-button class="custom-button" style="margin-bottom: 10px;margin-left: 20px" @click="fetchMedCases(disease.name,disease.disease_id)">{{ disease.name }}</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {useStore} from "vuex";
import {onBeforeRouteLeave} from "vue-router";
import {ElRow, ElTabPane, ElTabs,ElCol,ElButton} from "element-plus";
import axios from "axios";
export default{
  name:"Category",
  components:{
    ElTabs,
    ElTabPane,
    ElCol,
    ElRow,
    ElButton
  },
  data(){
    return{
      pageSize:10,
      pageNum:1,
      categories:[],
      diseases:{},
      infoKeyword:"",
      meKeyword:'',
      categoriesObj:[],
    }
  },
  props:{
    disease:{
      type:Object,
      required:true
    }
  },
  mounted() {
    this.fetchCategories();
  },
  methods:{
    fetchMedCases(diseaseName,diseaseId){
      this.$router.push({ name: 'Disease', params: { diseaseName: diseaseName,diseaseId:diseaseId }});
    },
    fetchCategories(){
      console.log('session '+sessionStorage);
      axios.get(
          '/api/categories',
          {
            params:{
              name_keyword:''
            },
            withCredentials : true,
            headers:{
              'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
            }
          }
      ).then(response=>{
        this.categories=
            JSON.stringify(response.data.data);
        console.log("category "+this.categories);
        this.fetchDiseasesForCategories();
      }).catch(error=>{
        console.error('获取病种失败',error);
      })
    },
    fetchDiseasesForCategories(){
      for(var category in this.categories){
        axios.get(`/api/diseases/categories/${category['category_id']}`,
            {headers:{
                'Session':sessionStorage.getItem('sessionId'),
              'Content-Type': 'application/json',
        },
              withCredentials : true}
        ).then
        (response=>{
          this.categories[category.category_id].diseasesf =response.data.data;
        }).catch(error=>{
          console.error('获取疾病失败',error);
        });
        }
    },
    fetchCategoriesMock() {
      return new Promise((resolve, reject) => {
        // 模拟后端返回的病种数据
        const categoriesData = [
          { category_id: 1, category_name: '病种1' },
          { category_id: 2, category_name: '病种2' },
          { category_id: 3, category_name: '病种3' }
        ];

        // 模拟异步请求延迟
        setTimeout(() => {
          this.categories = categoriesData;
          this.fetchDiseasesForCategoriesMock();
          resolve(categoriesData); // 成功时返回病种数据
        }, 1000); // 延迟1秒模拟异步请求
      });
    },
    fetchDiseasesForCategoriesMock(categoryId) {
  return new Promise((resolve, reject) => {
    // 模拟后端返回的疾病数据
    const diseasesData = {
      1: [
        { disease_id: 1, name: '疾病1' },
        { disease_id: 2, name: '疾病2' },
        { disease_id: 3, name: '疾病3' },
        { disease_id: 9, name: '疾病9' },
        { disease_id: 10, name: '疾病10' }
      ],
      2: [
        { disease_id: 4, name: '疾病4' },
        { disease_id: 5, name: '疾病5' }
      ],
      3: [
        { disease_id: 6, name: '疾病6' },
        { disease_id: 7, name: '疾病7' },
        { disease_id: 8, name: '疾病8' }
      ]
    };

    // 模拟异步请求延迟
    setTimeout(() => {
      this.diseases=diseasesData;
      resolve(diseasesData[categoryId]); // 成功时返回对应病种的疾病数据
    }, 1000); // 延迟1秒模拟异步请求
  });
}

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
  }

};
</script>

<style scoped>
.container.sectionHeight {
  background-color: white; /* 设置背景色为白色 */
  border-radius: 20px;
  margin-left: 10px;
  padding:20px;
  margin-right: auto;
  padding-bottom: 20px;
}
.tab-content{
  margin-left: 20px;
}
.custom-button {
  /* 设置背景颜色 */
  background-color: #b6e6ff;
  /* 设置边框颜色和样式 */
  border: 3px solid #01A7F0;
  /* 设置字体颜色 */
  color: #00449C;
  /* 设置字体大小 */
  font-size: 18px;
  /* 设置圆角 */
  border-radius: 6px;
  /* 设置按钮悬停时的背景颜色 */
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
}
::v-deep .el-tabs__item {
  font-size: 18px !important; /* 设置标签的字体大小为 18px */
}
.card.p-4{
  margin-left: 5px;
}
</style>
