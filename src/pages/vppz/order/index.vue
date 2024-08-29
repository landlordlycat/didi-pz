<template>
  <div>
    <div class="flex justify-end mb-2">
      <el-input style="width: 200px" v-model.trim="inputVModel" placeholder="请输入订单号" />
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="filterList.list">
      <el-table-column label="订单号" prop="out_trade_no" width="150" fixed="left"></el-table-column>
      <el-table-column label="就诊医院" prop="hospital_name"></el-table-column>
      <el-table-column label="陪诊服务" prop="service_name"></el-table-column>
      <el-table-column label="陪护师" prop="companion.name">
        <template #default="{ row }">
          <el-image :src="row.companion.avatar" alt="string" style="width: 40px; height: 40px; border-radius: 50%"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="陪护师手机号" prop="companion.mobile" width="120"></el-table-column>
      <el-table-column label="总价" prop="price"></el-table-column>
      <el-table-column label="已付" prop="paidPrice"></el-table-column>
      <el-table-column label="下单时间" prop="starttime" width="120">
        <template #default="{ row }">
          <div>
            {{ formatTime(row.order_start_time) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="trade_state">
        <template #default="{ row }">
          <div>
            <el-tag :type="statusMap(row.trade_state)">{{ row.trade_state || '已完成' }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="接单状态" prop="service_state"></el-table-column>
      <el-table-column label="联系人手机号" prop="client.mobile" width="120"></el-table-column>
      <el-table-column label="操作" prop="string" width="120" fixed="right">
        <template #default="{ row }">
          <div>
            <el-popconfirm v-if="row.trade_state === '已取消'" confirm-button-text="是" cancel-button-text="否" icon="InfoFilled" icon-color="#626AEF" title="是否确认完成?" @confirm="onConfirm(row.out_trade_no)">
              <template #reference>
                <el-button type="primary" link>服务完成</el-button>
              </template>
            </el-popconfirm>
            <el-button v-else type="primary" link disabled>暂无服务</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNum" :page-size="pageSize" style="margin-top: 10px" background :total="orderList.total" layout="->, total,prev,pager,next" @change="onChange"></el-pagination>
  </div>
</template>

<script setup lang="ts" generic="T">
import { reqOrderList, updateOrder } from '@/server/escort'
import type { OrderListData } from '@/server/types/escortTypes'
import { formatTime } from '@/utils/formatTime'
const pageNum = ref(1)
const pageSize = ref(10)
const inputVModel = ref('')
const orderList = ref<{ list: OrderListData[]; total: number }>({
  list: [],
  total: 0
})

let filterList = computed<any>(() => {
  const newArr = orderList.value.list.filter((item) => item.out_trade_no.includes(inputVModel.value))

  return newArr.length === 0 ? orderList.value : { list: newArr, total: newArr.length }
})

const statusMap = (status: string) => {
  switch (status) {
    case '已取消':
      return 'info'
    case '待支付':
      return 'warning'
    case '已完成':
      return 'success'
  }
}
const getOrderList = async () => {
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }
  const res = await reqOrderList(params)
  orderList.value = res.data
}

onMounted(() => {
  getOrderList()
})
const onChange = (currentPage: number, pageSizeNum: number) => {
  pageNum.value = currentPage
  pageSize.value = pageSizeNum
  getOrderList()
}

const onConfirm = async (id: string) => {
  const res = await updateOrder({
    id
  })
  if (res.code === 10000) {
    ElMessage({
      type: 'success',
      message: '服务完成成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '服务完成失败'
    })
  }
}

const handleSearch = () => {
  if (!inputVModel.value) {
    return
  }

  const newArr = orderList.value.list.filter((item) => item.out_trade_no === inputVModel.value)
  if (newArr.length === 0) {
    return
  } else {
    filterList.value.list = newArr
    filterList.value.total = newArr.length
  }
}
</script>
