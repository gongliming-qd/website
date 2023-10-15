<template>
  <div class="title">
    江江江专属excel数据分析工具集合
  </div>
  <div class="tools">上传excel</div>
  <div class="uploadBox">
    <el-upload class="upload-demo" drag action="" :before-upload="beforeUpload">
      <el-icon class="el-icon--upload"><upload-filled :style="{color: hasUpload? '#5a9cf8':''}"/></el-icon>
      <div class="el-upload__text" v-if="!hasUpload">
        拖拽文件到这里 或者 <em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">
        <em>上传成功，可重新上传</em>
      </div>
    </el-upload>
  </div>
  <div>
    <div class="tools">功能1: 求取每月数据平均值</div>
    <div class="subTitle"> 
      <div v-if="!hasUpload" class="noFile">
        <span class="userName">江江江</span> 同学, 使用该功能前,请先上传excel噢！
      </div>
      <div v-else>
        请选择需要求取的属性：
      </div>
      <div>
        <el-checkbox-group v-model="itemSelect">
          <el-checkbox v-for="city in itemArr" :key="city" :label="city">{{
            city
          }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="exportBtn">
        <el-button v-if="itemSelect.length > 0" type="primary" plain
          @click="doCenter"
          >处理数据</el-button>
          <el-button v-if="hasDoCenter" type="primary" plain
          @click="toggleShowOnlne"
          >在线查看</el-button>
        <el-button v-if="hasDoCenter" type="primary" plain
          @click="exportCenterNumber"
          >导出excel数据</el-button>
          <el-button v-if="hasDoCenter" type="primary" plain
          @click="doEchart"
          >生成图表</el-button>
          
      </div>
      <div class="tableOnline" v-if="showTableCenterOnline">
        <el-table :data="exportDoArr" border style="width: 100%">
          <el-table-column v-for="item in tableDataKeys" :prop="item" :label="item"  />
        </el-table>
      </div>
    </div>

  </div>
  <div class="echarts">
    <div class="tools">图表功能</div>
    <div ref="echartsRef" class="echartBox">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {getExcel, exportByExcel} from "./utils/common"
import { ElMessage } from 'element-plus'

import * as echarts from 'echarts';


const echartsRef = ref(null as any)

onMounted(()=>{
  type EChartsOption = echarts.EChartsOption;
  var chartDom = echartsRef.value;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = {
  xAxis: {
    name: '温度',
  },
  yAxis: {
    name: '温度',
  },
  series: [
    {
      symbolSize: 20,
      data: [
        [10.0, 8.04],
        [8.07, 6.95],
        [13.0, 7.58],
        [9.05, 8.81],
        [11.0, 8.33],
        [14.0, 7.66],
        [13.4, 6.81],
        [10.0, 6.33],
        [14.0, 8.96],
        [12.5, 6.82],
        [9.15, 7.2],
        [11.5, 7.2],
        [3.03, 4.23],
        [12.2, 7.83],
        [2.02, 4.47],
        [1.05, 3.33],
        [4.05, 4.96],
        [6.03, 7.24],
        [12.0, 6.26],
        [12.0, 8.84],
        [7.08, 5.82],
        [5.02, 5.68]
      ],
      type: 'scatter'
    }
  ]
}

  option && myChart.setOption(option);
})

// 是否上传excel文件
const hasUpload = ref(false)

// 上传的excel数据
const allData = ref([] as any)

const doInit = ()=>{
  hasUpload.value = false
  showTableCenterOnline.value = false
  itemSelect.value = []
  itemArr.value = []
}

const beforeUpload = (data: any) => {
  // 初始化数据
  doInit()
  getExcel(data).then((res: any) => {
    console.log(res);
    ElMessage({
    message: '上传成功啦～',
    type: 'success',
  })
    hasUpload.value = true
    allData.value = res
    getKeys(res)
  }).catch(res=>{
    console.log(res);
  })

}
// 当前所有key
const itemArr = ref([] as any)
// 选中的key
const itemSelect = ref([])

// 获取所有的key
const getKeys = (arr: any) => {
  for (let i in arr[0]) {
    itemArr.value.push(i)
  }
}

// 求月份平均值功能
const list = ref({} as any)
const getCurrentKey = (date: any) => {
  const currentDate = new Date(date);
  // 获取当前年份
  const currentYear = currentDate.getFullYear();
  // 获取当前月份（注意月份是从0开始的，所以要加1）
  const currentMonth = currentDate.getMonth() + 1;

  return currentYear + '-' + currentMonth
}
const hasDoCenter = ref(false)
// 导出中值
const doCenter = ()=>{
  list.value = {}
  // 1. 按照月份进行分类
  allData.value.forEach((ele: any) => {
      let key = getCurrentKey(ele.Date)
      console.log(key);
      if (list.value[key]) {
        list.value[key].children.push(ele)
      } else {
        list.value[key] = {
          children:[],
          date: key
        }
        list.value[key].children.push(ele)
      }
    })
    console.log(list.value);
    
  // 求取当前类型的平均值
  for(let key in list.value){
    const item = list.value[key]
    const len = item.children.length
    itemSelect.value.forEach((ele:any)=>{
      item[ele] = 0
      item.children.forEach((single: any)=>{
        item[ele] = item[ele] + single[ele]
      })
      item[ele] = item[ele] / len
    })
  }
  console.log(list.value);

 // 处理导出的数据
  let exportArr = []
 for(let key in list.value){
  const item = list.value[key]
  let obj:any = {
    date: key,
    length:item.children.length
  }
  itemSelect.value.forEach(ele=>{
     obj[ele] = item[ele]
  })
  
  exportArr.push(obj)
 }
console.log(exportArr);
ElMessage({
    message: '处理成功啦～',
    type: 'success',
  })
hasDoCenter.value = true
exportDoArr.value = exportArr
tableDataKeys.value = ['date',...itemSelect.value, 'length']
}
const exportCenterNumber = ()=>{
 exportByExcel(exportDoArr.value ,tableDataKeys.value)
}
// 查看table表格
const exportDoArr = ref([] as any)

const tableDataKeys = ref([] as any)

const showTableCenterOnline =  ref(false)

const toggleShowOnlne = ()=>{
  showTableCenterOnline.value = !showTableCenterOnline.value
}

const doEchart = ()=>{
  ElMessage({
    message: '该功能暂未开通喔',
    type: 'warning',
  })
}


</script>
<style scoped lang='less'>
.title {
  margin-bottom: 50px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Poppins;
  font-weight: 700;
  color: white;
  background: linear-gradient(45deg,  thistle 20%, rgb(237, 230, 230) 50%, rgb(155, 119, 119) 90%);
  line-height: 70px;
}

.uploadBox {
  padding: 15px 20px;

}

.tools {
  padding: 5px 20px;
  font-size: 20px;
  background: linear-gradient(45deg,  thistle 20%, rgb(237, 230, 230) 50%, white 90%);
  color: white;
}

.subTitle {
  padding: 15px 20px;
}
.exportBtn{
  margin-top: 20px;
}
.tableOnline{
  margin-top: 20px;
}
.noFile{
  font-size: 20px;
  color: chocolate;
  .userName{
    text-decoration: underline;
  }
}
.echarts{
  padding: 15px 20px;
  .echartBox{
    width: 1000px;
    height: 500px;
    margin: 0 auto;
  }
}
</style>