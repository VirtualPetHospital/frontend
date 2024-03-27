<template>
  <div class="card p-4" >
    <div class=" row">
      <div class="col-12">
        <h3>我的试卷</h3>
        <el-table :data="pagePapers" stripe style="margin-top: 20px" >
          <el-table-column prop="paper.paper_id" label="试卷ID"></el-table-column>
          <el-table-column prop="paper.name" label="试卷名称"></el-table-column>
          <el-table-column prop="paper.question_num" label="题目数量"></el-table-column>
          <el-table-column prop="paper.correct_num" label="正确率">
            <template #header>
              <span class="column-header">正确率</span>
            </template>
            <template #default="scope">
              <el-progress
                  :percentage="(scope.row.paper.correct_num / scope.row.paper.question_num) * 100"
                  color="success"
                  :stroke-width="18"
                  :show-text="false"
              />
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              align="center"
              label="操作">
            <template v-slot="scope">
                <el-button class="custom-button" @click="watchPaper(scope.row.examId)" type="text" size="small" style="margin-left: 10px">
                  查看
              </el-button>
            </template>
          </el-table-column>
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
import {ElButton, ElPagination, ElProgress, ElTable, ElTableColumn} from "element-plus";
import axios from "axios";
import {toRaw} from "vue";
export default{
  name:"MyPapersStudent",
  data(){
    return{
      total:null,
      pageNum:1,
      pageSize:10,
      responseData:null,
      papers:[],
      pagePapers:[],
    }
  },
  components:{
    ElTable,
    ElTableColumn,
    ElPagination,
    ElButton,
    ElProgress
  },
  methods:{
    fetchPapers(){
      axios.get('/exams',{
        params:{
          page_size:this.pageSize,
          page_num:this.pageNum,
        },
        headers:{
          Session:this.session
        }
      }).then(response=>{
        this.responseData=response.data;
        if (this.responseData && this.responseData.data && this.responseData.data.records.length > 0) {

          // 使用 map 方法遍历所有记录并提取 paper 字段
            for(let i=0;i<this.responseData.data.records.length;i++){
              let paperInfo = {
                examId: this.responseData.data.records[i].exam_id,
                paper: this.responseData.data.records[i].paper
              };
              this.papers.push(paperInfo);
            }
            this.total=this.responseData.data.total;

        } else {
          console.error('No data found or records array is empty.');
        }
        this.fetchPagePapers();
      }).catch(error=>{
        console.error('获取卷子失败',error);
      })
    },
    fetchPagePapers(){
      let tmppapers=toRaw(this.papers);
      console.log(tmppapers);
      this.pagePapers = [];
      for (let i = (this.pageNum - 1) * this.pageSize; i < this.total; i++) {
        //把遍历的数据添加到pageTicket里面
        this.pagePapers.push(tmppapers[i]);
        //判断是否达到一页的要求
        if (this.pagePapers.length === this.pageSize) break;
      }
      console.log(this.pagePapers);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchPagePapers();
    },
    // 分页 current 变化
    handleCurrentChange(pageNum) { // 处理页码改变事件
      this.pageNum = pageNum; // 更新当前页码
      this.fetchPagePapers(); // 重新获取数据
    },
    watchPaper(examId){
      this.$router.push({name:'WatchPaper',params:{id: examId}});
    },
    fetchPapersMock(){
      this.responseData ={
        "code": 0,
        "msg": "操作成功",
        "data": {
          "total": 20,
          "records": [
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 1,
              "name": "考试1",
              "start_time": "2024-03-25 08:00:00",
              "end_time": "2024-03-25 10:00:00",
              "duration": 120,
              "level": 3,
              "paper": {
                "correct_num":1,
                "paper_id": 101,
                "name": "试卷1",
                "question_num": 30,
                "questions": [
                  {
                    "question_id": 1,
                    "description": "问题1的描述",
                    "answer": "答案1",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 2,
                    "description": "问题2的描述",
                    "answer": "答案2",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 2
                  }
                ]
              },
              "participated": 50
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "paper_id": 102,
                "name": "试卷2",
                "correct_num":2,
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },
            {
              "exam_id": 2,
              "name": "考试2",
              "start_time": "2024-03-26 09:00:00",
              "end_time": "2024-03-26 11:00:00",
              "duration": 120,
              "level": 2,
              "paper": {
                "correct_num":3,
                "paper_id": 102,
                "name": "试卷2",
                "question_num": 25,
                "questions": [
                  {
                    "question_id": 3,
                    "description": "问题3的描述",
                    "answer": "答案3",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 1
                  },
                  {
                    "question_id": 4,
                    "description": "问题4的描述",
                    "answer": "答案4",
                    "A": "选项A",
                    "B": "选项B",
                    "C": "选项C",
                    "D": "选项D",
                    "category_id": 3
                  }
                ]
              },
              "participated": 40
            },

            // 可能还有其他数据...
          ]
        }
      };
      if (this.responseData && this.responseData.data && this.responseData.data.records.length > 0) {
        // 使用 map 方法遍历所有记录并提取 paper 字段
        for(let i=0;i<this.responseData.data.records.length;i++){
          let paperInfo = {
            examId: this.responseData.data.records[i].exam_id,
            paper: this.responseData.data.records[i].paper
          };
          this.papers.push(paperInfo);
        }
        this.total=this.responseData.data.total;
        // 输出获取到的所有 paper 数组
        console.log('All Papers:', this.papers);
      } else {
        console.error('No data found or records array is empty.');
      }
      this.fetchPagePapers();
    }
  },
  mounted() {
    this.fetchPapersMock();
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
  },

  fetchPapersMock() {

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
  padding-left: 5px;
  padding-right: 5px;
  /* 设置按钮悬停时的背景颜色 */
  &:hover {
    background-color: #FFFFFF;
    border-color: #66B1FF;
  }
}
.column-header {
  display: inline-block;
  width: 100%;
  text-align: center;
}
</style>
