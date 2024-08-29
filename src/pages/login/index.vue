<template>
  <el-row class="login-container h-full" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="bg-[#899fe1]">
          <img src="/login-head.png" alt="" class="w-[430px]" />
        </div>
      </template>
      <div class="register_link text-right mb-3">
        <el-link type="primary" @click="handleRegister">{{ isLogin ? '注册账户' : '返回登录' }}</el-link>
      </div>
      <el-form ref="formRef" :model="formModel" :rules="formRules" status-icon>
        <el-form-item prop="userName">
          <el-input v-model="formModel.userName" placeholder="手机号" prefix-icon="userFilled" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input type="password" v-model="formModel.passWord" placeholder="密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item v-if="!isLogin" prop="validCode">
          <el-input v-model="formModel.validCode" placeholder="验证码" prefix-icon="Lock">
            <template #append>
              <button type="button" :disabled="countdown != 0" @click="handleGetValidCode" class="cursor-pointer disabled:cursor-not-allowed">{{ countdown ? `剩余${countdown}秒` : '获取验证码' }}</button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSubmit(formRef!)" type="primary" class="w-full">{{ isLogin ? '登录' : '注册' }}</el-button>
        </el-form-item>
      </el-form ref="formRef">
    </el-card>
  </el-row>
</template>

<script setup lang="ts" generic="T">
import { useCountdown } from '@/composables/coutdown'
import type { FormInstance, FormRules } from 'element-plus'
import { getCode,registerUser,login,permission } from '@/server/userCore'
import {State} from '@/content/state'
import {setItem} from '@/utils/localStorage'
import {useMenuStore} from '@/stores/menu'
import { storeToRefs } from 'pinia'
interface RuleForm {
  userName: string
  passWord: string
  validCode: string
}
const menuStore = useMenuStore()
const {routesList} = storeToRefs(menuStore)
const {onDynamicMenu} = menuStore
const router = useRouter()
const isLogin = ref(true)
const formRef = ref<FormInstance|null>(null)
const { countdown, start } = useCountdown()


const handleRegister = () => {
  isLogin.value = !isLogin.value
}
const formModel = reactive<RuleForm>({
  userName: '',
  passWord: '',
  validCode: ''
})
const handleGetValidCode = async () => {
  const phoneReg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
  if (formModel.userName && phoneReg.test(formModel.userName)) {
    start(10)
    const result = await getCode(formModel.userName)
    if (result.code === 10000) {
      ElMessage({
        message: result.msg,
        type: 'success'
      })
    }
    return
  }
  ElMessage({
    message: '请输入正确的手机号',
    type: 'error'
  })
}
const routes = computed(()=>routesList.value)
//validator username
const validateUsername = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else {
    const phoneReg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
    const isPhone = phoneReg.test(value)
    isPhone ? callback() : callback(new Error('请输入正确的手机号'))
  }
}

//validator password
const validatePassword = (_rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else {
    const passwordReg = /^[a-zA-Z0-9]{4,16}$/
    const isPassword = passwordReg.test(value)
    isPassword ? callback() : callback(new Error('密码必须包含字母和数字，长度4-16位'))
  }
}
const formRules = reactive<FormRules<RuleForm>>({
  userName: [
    {
      validator: validateUsername,
      trigger: 'blur'
    }
  ],
  passWord: [{ validator: validatePassword, trigger: 'blur' }]
})

const handleSubmit = async (formEl: FormInstance | undefined) => {
  
  if(!formEl) return
  await formEl.validate(async (valid, fields) => {
    
    if (valid) {
      if(isLogin.value){
        //login
        const result= await login(formModel.userName, formModel.passWord)

        if (result.code === 10000) {
          ElMessage({
            message: '登录成功',
            type:'success'
          })
          
          //save userInfo
          setItem(State.UserInfo,result.data)
          const permissionResult = await permission()
          onDynamicMenu(permissionResult.data)
          toRaw(routes.value).forEach((route)=>{
            router.addRoute('Main',route)
          })
          router.replace({
            path:'/'
          })
        }
      }else{
        const result = await registerUser(formModel)
        if (result.code === 10000) {
          ElMessage({
            message: '注册成功',
            type:'success'
        })
      }
    } }else {
      ElMessage({
        message: '请检查输入项',
        type: 'error'
      })
    }
  })
}
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 0;
}
</style>
