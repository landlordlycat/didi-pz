<template>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column label="id" prop="id" />
    <el-table-column label="昵称" prop="name" />
    <el-table-column label="所属组别" prop="permission_id">
      <template #default="{ row }">
        {{ permissionName(row.permission_id) }}
      </template>
    </el-table-column>
    <el-table-column label="手机号" prop="mobile" />
    <el-table-column label="状态" prop="active">
      <template #default="{ row }">
        <el-tag :type="row.active ? 'success' : 'danger'">{{ row.active ? '正常' : '冻结' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="时间" prop="create_time">
      <template #default="{ row }">
        <el-icon>
          <Clock />
        </el-icon>
        {{ formatTime(row.create_time) }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="mt-3">
    <el-pagination background size="small" v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :total="tableData.total" layout="->,total,prev,pager,next" @change="handlePageChange" />
  </div>
  <el-dialog v-model="dialogVisible" title="string" ::before-close="beforeClose" width="500">
    <el-form ref="formRef" :model="formModel" label-width="90px">
      <el-form-item prop="mobile" label="手机号">
        <el-input v-model="formModel.mobile" disabled />
      </el-form-item>
      <el-form-item prop="name" label="昵称" required>
        <template #error>
          <div class="text-red-500">请填写昵称</div>
        </template>
        <el-input v-model="formModel.name"> </el-input>
      </el-form-item>
      <el-form-item prop="permissions_id" label="菜单权限" required>
        <template #error>
          <div class="text-red-500">请填写昵称</div>
        </template>
        <el-select v-model="formModel.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
          <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave(formRef)">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="T">
import type { AuthAdminListDataType, AuthAdminType } from '@/server/types/userCoreTypes'
import { authAdmin, selectList, updateUser } from '@/server/userCore'
import { formatTime } from '@/utils/formatTime'
import type { List } from '@/server/types/userCoreTypes'
import type { FormInstance } from 'element-plus'
const dialogVisible = ref(false)
const formRef = ref<FormInstance | null>(null)
const paginationData = ref({
  pageNum: 1,
  pageSize: 10
})

const tableData = ref<AuthAdminType>({
  list: [],
  total: 0
})

const formModel = ref({
  name: '',
  permissions_id: 0,
  mobile: ''
})

const options = ref<Array<Pick<List, 'id' | 'name'>>>([])

// ---------------------

const fetchData = async () => {
  const res = await authAdmin(paginationData.value)
  tableData.value = res.data
}

onMounted(async () => {
  await fetchData()
  const res = await selectList()
  options.value = res.data
})

const permissionName = (id: number) => {
  const data = options.value.find((el) => el.id === id)
  return data ? data.name : '超级管理员'
}

const handlePageChange = (pageNum: number, pageSize: number) => {
  paginationData.value.pageNum = pageNum
  paginationData.value.pageSize = pageSize
  fetchData()
}

const handleEdit = (row: AuthAdminListDataType) => {
  dialogVisible.value = true
  formModel.value.name = row.name
  formModel.value.permissions_id = row.permissions_id as number
  formModel.value.mobile = row.mobile
}
const beforeClose = () => {
  dialogVisible.value = false
}

const handleSave = async (formEl: FormInstance | null) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await updateUser({
          name: formModel.value.name,
          permissions_id: formModel.value.permissions_id
        })
        fetchData()
        ElMessage({
          type: 'success',
          message: '更新成功'
        })
      } catch (error) {
      } finally {
        dialogVisible.value = false
      }
    } else {
      ElMessage({
        type: 'error',
        message: 'Error'
      })
    }
  })
}
</script>
