<template>
  <div>
    <el-button type="primary" icon="Plus" @click="dialogVisible = true" size="small">新增</el-button>
    <el-popconfirm v-if="selectedTableList.length > 0" confirm-button-text="是" cancel-button-text="否" title="是否确认删除？" icon="Delete" @confirm="handleDelete">
      <template #reference>
        <el-button type="danger" icon="Delete" size="small">删除</el-button>
      </template>
    </el-popconfirm>
    <el-table :data="tableData.list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="id" prop="id" />
      <el-table-column label="昵称" prop="name" />
      <el-table-column label="头像" prop="avatar">
        <template #default="{ row }">
          <div>
            <el-image :src="row.avatar" alt="avatar" class="size-12" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex">
        <template #default="{ row }">
          <div>
            <span>{{ row.sex === 1 ? '男' : '女' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" />
      <el-table-column label="状态" prop="active">
        <template #default="{ row }">
          <div>
            <el-tag :type="row.active === 1 ? 'success' : 'danger'">{{ row.active === 1 ? '正常' : '冻结' }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time">
        <template #default="{ row }">
          <div class="flex items-center space-x-1">
            <gg-time />
            <span class="whitespace-nowrap">{{ formatTime(row.create_time) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="mt-3" :total="tableData.total" background :page-size="paginationData.pageSize" v-model:current-page="paginationData.pageNum" layout="->,total, prev, pager, next" @change="handlePgChange" />
    <el-dialog width="450px" v-model="dialogVisible" @close="handleClose">
      <template #header>
        <span>{{ formModel.id ? '陪护师编辑' : '陪护师新增' }}</span>
      </template>
      <el-form label-suffix=":" label-width="auto" ref="formRef" :rules="formRules" :model="formModel" status-icon>
        <el-form-item label="ID" v-show="formModel.id" prop="id">
          <el-input v-model="formModel.id" disabled />
        </el-form-item>
        <el-form-item prop="name" label="昵称">
          <el-input v-model="formModel.name" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <el-button v-if="!formModel.avatar" type="primary" @click="avatarDialogVisible = true">上传头像</el-button>

          <el-image v-else :src="formModel.avatar" alt="avatar" class="size-25 cursor-pointer" @click="avatarDialogVisible = true" title="点击更换头像" />
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select v-model="formModel.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-input-number v-model="formModel.age" :min="18" :max="50" />
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="formModel.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="active" label="是否生效">
          <el-switch v-model="formModel.active" class="mt-[0.4]" inline-prompt :active-icon="Check" :inactive-icon="Close" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm(formRef!)">确认</el-button>
      </template>
    </el-dialog>
    <!-- avatar dialog -->
    <el-dialog v-model="avatarDialogVisible" title="选择图片" width="580">
      <div class="flex flex-wrap gap-1">
        <div v-for="(item, index) in avatarList" :key="item.name" @click="selectedAvatarIndex = index" class="relative basis-1/5">
          <div v-show="selectedAvatarIndex === index" class="absolute size-1/4 flex items-center justify-center bg-green-500 rounded-md z-10">
            <gg-check style="width: 50px; height: 50px; fill: #33c5ff" />
          </div>
          <el-image :src="item.url" alt="avatar" lazy class="rounded-md cursor-pointer">
            <template #error></template>
          </el-image>
        </div>
      </div>
      <template #footer>
        <div>
          <el-button @click="avatarDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAvatarConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" generic="T">
import { Check, Close } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getAvatarList, createCompanion, getCompanionList, deleteCompanion } from '@/server/escort'
import type { AvatarData, CompanionListData, CompanionParams } from '@/server/types/escortTypes'
import { formatTime } from '@/utils/formatTime'

const dialogVisible = ref(false)
const avatarDialogVisible = ref(false)
const formRef = ref<FormInstance | null>(null)
const avatarList = ref<AvatarData[]>([])
const selectedAvatarIndex = ref(0)
const selectedTableList = ref<CompanionParams[]>([])
const paginationData = reactive({
  pageNum: 1,
  pageSize: 2
})
const tableData = ref<CompanionListData>({
  list: [],
  total: 0
})

const getListData = async () => {
  const res = await getCompanionList(paginationData)
  tableData.value = res.data
}

const handlePgChange = (pageNum: number, pageSize: number) => {
  paginationData.pageNum = pageNum
  paginationData.pageSize = pageSize
  getListData()
}

const formModel = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 0,
  avatar: '',
  name: '',
  sex: ''
})

const handleDelete = async () => {
  if (!selectedTableList.value.length) return
  const ids = selectedTableList.value.map((item) => ({
    id: item.id
  }))
  const res = await deleteCompanion(ids)
  if (res.code === 10000) {
    ElMessage.success(res.data)
    await getListData()
  } else {
    ElMessage.error(res.message)
  }
}

const handleEdit = async (row: CompanionParams) => {
  dialogVisible.value = true
  await nextTick()
  Object.assign(formModel, row)
}

onMounted(async () => {
  const res = await getAvatarList()
  avatarList.value = res.data
  await getListData()
})
const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}
const handleAvatarConfirm = () => {
  formModel.avatar = avatarList.value[selectedAvatarIndex.value].url
  avatarDialogVisible.value = false
}
const formRules = reactive<FormRules<typeof formModel>>({
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '昵称不能为空'
    }
  ],
  avatar: [
    {
      required: true,
      message: '请选择头像'
    }
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ],
  mobile: [
    {
      required: true,
      trigger: 'blur',
      validator(_rule, value, callback) {
        if (!value) return callback(new Error('手机号不能为空'))
        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(value)) {
          return callback(new Error('手机号格式不正确'))
        }
        callback()
      }
    }
  ]
})

const handleConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await createCompanion(formModel)
      if (res.code === 10000) {
        ElMessage.success(`${formModel.id ? '编辑' : '添加'}成功`)
        await getListData()
        if (!formModel.id) {
          paginationData.pageNum = Math.ceil(tableData.value.total / paginationData.pageSize)
        }
        handleClose()
      } else {
        ElMessage.error(`${formModel.id ? '编辑' : '添加'}失败`)
      }
    } else {
      console.log('error submit!!', fields)
      // ElMessage.error('表单验证失败')
    }
  })
}

const handleSelectionChange = (value: CompanionParams[]) => {
  selectedTableList.value = value
  console.log(selectedTableList.value)
}
</script>
