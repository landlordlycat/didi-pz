import request from '@/utils/request'
import type { AuthAdminParamsType, AuthAdminType, GetCodeType, List, LoginUserType, MenuListDataType, RegisterUserType, UserInfoType } from './types/userCoreTypes'

enum V3PZ {
  GET_CODE = '/get/code',
  REGISTER_USER = '/user/authentication',
  LOGIN = '/login',
  AUTH_ADMIN = '/auth/admin',
  GET_MENU = '/user/getmenu',
  SET_MENU = '/user/setmenu',
  MENU_LIST = '/menu/list',
  SELECT_LIST = '/menu/selectlist',
  UPDATE_USER = '/update/user',
  PERMISSION = '/menu/permissions',
  REPORT = '/report'
}

//获取验证码

export const getCode = (tel: string): Promise<GetCodeType> =>
  request.post(V3PZ.GET_CODE, {
    tel
  })

//注册用户

export const registerUser = (userInfo: { userName: string; passWord: string; validCode: string }): Promise<RegisterUserType> => request.post(V3PZ.REGISTER_USER, userInfo)

//登录

export const login = (userName: string, passWord: string): Promise<LoginUserType<UserInfoType>> => request.post(V3PZ.LOGIN, { userName, passWord })

//账户管理列表
export const authAdmin = (params: AuthAdminParamsType): Promise<LoginUserType<AuthAdminType>> => request.get(V3PZ.AUTH_ADMIN, { params })

//菜单权限数据
export const getMenu = () => request.get(V3PZ.GET_MENU)

//菜单权限修改
export const setMenu = (data: { name: string; permissions: string; id: string }) => request.post(V3PZ.SET_MENU, data)

//菜单权限列表
export const menuList = (params: AuthAdminParamsType): Promise<LoginUserType<MenuListDataType>> => request.get(V3PZ.MENU_LIST, { params })

//菜单权限下拉
export const selectList = (): Promise<LoginUserType<Array<Pick<List, 'id' | 'name'>>>> => request.get(V3PZ.SELECT_LIST)

//用户信息修改
export const updateUser = (data: { name: string; permissions_id: number }) => request.post(V3PZ.UPDATE_USER, data)

//用户菜单权限
export const permission = () => request.get(V3PZ.PERMISSION)

//首页报表信息
export const report = () => request.get(V3PZ.REPORT)
