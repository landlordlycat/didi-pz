<template>
  <el-button type="primary" icon="Plus" @click="dialogTableVisible = true">新增</el-button>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column label="id" prop="id" />
    <el-table-column label="昵称" prop="name" />
    <el-table-column label="菜单权限" prop="permissionName" width="500" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="mt-3 bg-white border p-2 border-gray-50 rounded-md">
    <el-pagination background size="small" v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :total="tableData.total" layout="->,total,prev,pager,next" @change="handlePageChange"></el-pagination>
  </div>
  <el-dialog v-model="dialogTableVisible" :before-close="beforeClose" :title="formModel.id ? '编辑权限' : '添加权限'" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :rules="formRules" :model="formModel">
      <el-form-item prop="id" v-show="false">
        <el-input v-model="formModel.id" />
      </el-form-item>
      <el-form-item prop="name" label="名称" required>
        <el-input v-model="formModel.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item prop="permissions" label="权限">
        <el-tree ref="treeRef" style="max-width: 600px" :data="permissionData" node-key="id" show-checkbox :default-checked-keys="[4, 5]" :default-expanded-keys="[2]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleConfirm(formRef!)">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="T">
import type { List, MenuListDataType } from '@/server/types/userCoreTypes'
import { getMenu, setMenu, menuList } from '@/server/userCore'
import type { FormInstance, FormRules, TreeInstance } from 'element-plus'
interface FormModel {
  id: string
  name: string
  permissions: string
}
const dialogTableVisible = ref(false)
const treeRef = ref<TreeInstance | null>(null)
const formRef = ref<FormInstance | null>(null)

const formModel = reactive<FormModel>({
  id: '',
  name: '',
  permissions: ''
})

const paginationData = reactive({
  pageNum: 1,
  pageSize: 2
})
const permissionData = ref([])
const tableData = ref<MenuListDataType>({
  total: 0,
  list: []
})
const formRules = reactive<FormRules<FormModel>>({
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入权限名称'
    }
  ]
})
const getListData = async () => {
  const result = await menuList(paginationData)
  tableData.value = result.data
}

onMounted(async () => {
  const result = await getMenu()
  permissionData.value = result.data
  getListData()
})

const beforeClose = () => {
  dialogTableVisible.value = false
  formRef.value?.resetFields()
  treeRef.value?.setCheckedKeys([4, 5])
}

const handlePageChange = (currentPage: number, pageSize: number) => {
  paginationData.pageNum = currentPage
  paginationData.pageSize = pageSize
  getListData()
}

const handleEdit = async (rowData: List) => {
  console.log(rowData)
  dialogTableVisible.value = true
  await nextTick()
  Object.assign(formModel, { id: rowData.id, name: rowData.name })
  treeRef.value?.setCheckedKeys(rowData.permission)
}

const handleConfirm = async (formEl: FormInstance) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await setMenu({ ...formModel, permissions: JSON.stringify(treeRef.value?.getCheckedKeys()) })
      getListData()
      ElMessage({
        message: formModel.id ? '编辑成功' : '添加成功',
        type: 'success'
      })
      beforeClose()
    } else {
      console.log('error', fields)
    }
  })
}
</script>
