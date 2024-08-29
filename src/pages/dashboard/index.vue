<template>
  <div class="flex gap-5">
    <el-card style="flex: 2">
      <div class="flex items-center space-x-1">
        <el-image :src="reprotData?.user?.user_img" alt="string" style="width: 100px"></el-image>
        <span>{{ reprotData?.user?.user_name }}</span>
      </div>
      <template #footer>
        <p>当前权限: {{ reprotData?.user?.permission }}</p>
        <p>
          ip: <span class="text-gray-400">{{ reprotData?.user?.ip }}</span>
        </p>
      </template>
    </el-card>
    <el-card style="flex: 2">
      <div class="grid grid-cols-2 gap-5 place-items-center">
        <div class="flex items-center space-x-1">
          <el-image :src="dzf" alt="string" class="bg-red-500 w-12"></el-image>
          <div>
            <span class="font-bold text-3xl">{{ reprotData?.types?.[0]?.num }}</span>
            <p>待支付</p>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <el-image :src="ywc" alt="string" class="bg-blue-500 w-12"></el-image>
          <div>
            <span class="font-bold text-3xl">{{ reprotData?.types?.[2]?.num }}</span>
            <p>已完成</p>
          </div>
        </div>

        <div class="flex items-center space-x-1">
          <el-image :src="dfw" alt="string" class="bg-purple-500 w-12"> </el-image>
          <div>
            <span class="font-bold text-3xl">{{ reprotData?.types?.[1]?.num }}</span>
            <p>待服务</p>
          </div>
        </div>
        <div class="flex items-center space-x-1">
          <el-image :src="yqx" alt="string" class="bg-green-500 w-12"></el-image>
          <div>
            <span class="font-bold text-3xl">{{ reprotData?.types?.[3]?.num }}</span>
            <p>已取消</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <section class="mt-5">
    <el-card>
      <div id="main" style="width: 100%; height: 400px"></div>
    </el-card>
  </section>
</template>

<script setup lang="ts" generic="T">
import { report } from '@/server/userCore'
import * as echarts from 'echarts'
import dzf from '../../../public/dzf.png'
import ywc from '../../../public/ywc.png'
import dfw from '../../../public/dfw.png'
import yqx from '../../../public/yqx.png'

const reprotData = ref()
onMounted(async () => {
  const res = await report()
  reprotData.value = res.data
  const myChart = echarts.init(document.getElementById('main'))
  const data = reprotData.value.typeList.map((item: any) => item.date)
  const order_sum = reprotData.value.typeList.map((item: any) => item.order_sum)
  const option = {
    legend: {
      data: ['订单数']
    },
    grid: {
      show: true
    },
    xAxis: {
      data
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '订单数',
        color: 'green',
        data: order_sum,
        type: 'line',
        smooth: true
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
})
</script>
