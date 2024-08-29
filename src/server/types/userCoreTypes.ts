export interface GetCodeType {
  code: number
  data: string
  msg: string
}

export type RegisterUserType = Pick<GetCodeType, 'code' | 'data'> & {
  message: Omit<GetCodeType, 'code'>
}

export interface AvatarType {
  avatar: string
  name: string
}

export interface UserInfoType {
  token: string
  userInfo: AvatarType
}

export type LoginUserType<T> = {
  code: number
  data: T
  message: string
}

export interface AuthAdminParamsType {
  pageNum: number
  pageSize: number
}

export interface List {
  id: number
  name: string
  permission: number[]
  permissionName: string
}

export interface MenuListDataType {
  list: Array<List>
  total: number
}
export interface AuthAdminListDataType {
  active: number
  create_time: number
  id: number
  mobile: string
  name: string
  permissions_id: number | string
}
export interface AuthAdminType {
  list: Array<AuthAdminListDataType>
  total: number
}
