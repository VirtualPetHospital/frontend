<template>
    <div class="card p-4" >
      <div class=" row">
        <i class="ni ni-bold-left text-info text-sm opacity-10" @click="backto()"></i>
        <div class="col-12">
          <h3>所需药品列表</h3>
          <el-table  :data="pageMedicinesInfo" stripe style="margin-top: 20px">
            <el-table-column prop="id" label="药品ID"></el-table-column>
            <el-table-column prop="name" label="药品名字"></el-table-column>
            <el-table-column prop="num" label="数量"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
          </el-table>
          <el-pagination
              :total="total"
              :page-num="pageNum"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
  </template>
  <script>
  import {useStore} from "vuex";
  import {onBeforeRouteLeave} from "vue-router";
  import {ElPagination, ElTable, ElTableColumn} from "element-plus";
  import axios from "axios";
  import { toRaw } from 'vue'
  
  
  /**
   * mock**/
  const mockMedicinesData = [
    { id: 1, name: '药品A', price: 10 },
    { id: 2, name: '药品B', price: 20 },
    { id: 3, name: '药品C', price: 30 },
    { id: 4, name: '药品D', price: 15 },
    { id: 5, name: '药品E', price: 25 },
    { id: 6, name: '药品F', price: 35 },
    { id: 7, name: '药品G', price: 12 },
    { id: 8, name: '药品H', price: 18 },
    { id: 9, name: '药品I', price: 28 },
    { id: 10, name: '药品J', price: 22 },
    { id: 11, name: '药品K', price: 40 },
    { id: 12, name: '药品L', price: 19 },
    { id: 13, name: '药品M', price: 27 },
    { id: 14, name: '药品N', price: 33 },
    { id: 15, name: '药品O', price: 16 },
    { id: 16, name: '药品P', price: 24 },
    { id: 17, name: '药品Q', price: 31 },
    { id: 18, name: '药品R', price: 14 },
    { id: 19, name: '药品S', price: 21 },
    { id: 20, name: '药品T', price: 38 },
  ];
  // 模拟后端接口，根据药品ID获取药品信息
  function fetchMedicineInfoById(medicineId) {
    return new Promise((resolve, reject) => {
      // 模拟延迟
      setTimeout(() => {
        const medicine = mockMedicinesData.find(med => med.id === medicineId);
        if (medicine) {
          resolve({ name: medicine.name, price: medicine.price });
        } else {
          reject(new Error('Medicine not found'+medicineId));
        }
      }, 0.01); // 模拟0.5秒延迟
    });
  }
  
  
  export default{
    name:"Medcines",
    data(){
      return{
        pageNum:1,
        pageSize:10,
        medicinesInfo:[],
        pageMedicinesInfo:[],
        total:null,
      }
    },
    created() {
      const medicinesQuery = this.$route.query.medicines;
      const total = parseInt(this.$route.query.total);
      console.log('medsetup'+medicinesQuery[0]);
      this.total = total;
      // 调用方法获取药品信息
      this.fetchMedicinesInfo(medicinesQuery);
  
    },
    methods:{
      backto(){
        this.$router.go(-1);
      },
      getPageMedicinesInfo(){
        this.pageMedicinesInfo=[];
        for(let i=(this.pageNum-1)*this.pageSize;i<this.total;i++) {
          //把遍历的数据添加到pageTicket里面
          this.pageMedicinesInfo.push(this.medicinesInfo[i]);
          //判断是否达到一页的要求
          if (this.pageMedicinesInfo.length === this.pageSize) break;
        }
      },
      async fetchMedicinesInfo(tmedicines){
        const medicines=JSON.parse(tmedicines);
        console.log("medi"+medicines);
        for(let i=0;i<medicines.length;i++){
          try{
  
            console.log(medicines[i].medicine_id);
            const response = await axios.get(`/api/medicines/${medicines[i].medicine_id}`,
                {
                  withCredentials : true,
                  params:{
                    page_size:9999,
                    page_num:0
                  },
                  headers:{
                    'Session':sessionStorage.getItem('sessionId'),
                    'Content-Type': 'application/json',},
  
                });
            if(response.data.code===2002){
              alert("你没资格啊你没资格啊");
            }else{
              console.log(response.data.data);
              const name=response.data.data.name;
              const price=response.data.data.price;
              this.medicinesInfo.push({
                id:medicines[i].medicine_id,
                name:name,
                num:medicines[i].num,
                price:price
              });
            }
          }catch(error){
            console.error('Error fetching medicine info:', error);
          }
        }
        console.log(this.medicinesInfo);
        this.getPageMedicinesInfo();
      },
      async fetchMedicinesInfoMock(medicines){
        console.log(this.total);
        for(const medicine of medicines){
          try {
            const medicineInfo = await fetchMedicineInfoById(medicine.id);
            // 将药品信息添加到列表中
            this.medicinesInfo.push({
              id: medicine.id,
              name: medicineInfo.name,
              num: medicine.num,
              price: medicineInfo.price
            });
          } catch (error) {
            console.error('Error fetching medicine info:', error);
          }
        }
        this.getPageMedicinesInfo();
      },
      handleSizeChange(val) {
        this.pageSize=val;
        this.getPageMedicinesInfo();
      },
      // 分页 current 变化
      handleCurrentChange(pageNum) { // 处理页码改变事件
        this.pageNum = pageNum; // 更新当前页码
        this.getPageMedicinesInfo(); // 重新获取数据
      }
    },
    components:{
      ElTable,
      ElTableColumn,
      ElPagination
    },
    setup() {
      const store = useStore();
  
      // 在组件被挂载后，设置 showSidenavStudent 为 true
      store.commit('setShowSidenavAdmin', true);
      onBeforeRouteLeave((to, from, next) => {
        // 在离开此页前关闭sidenavadmin
        store.commit('setShowSidenavAdmin', false);
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
    padding-bottom: 20px;
  }
  .card.p-4{
    margin-left: 5px;
  }
  </style>
  