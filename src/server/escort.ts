import request from '@/utils/request'
import type { AvatarData, Base, CompanionParams, CompanionListParams, CompanionListData, OrderListParams, OrderListData } from './types/escortTypes'

enum Escort {
  COMPANION = '/companion',
  AVATAR_LIST = '/photo/list',
  COMPANION_LIST = '/companion/list',
  COMPANION_DELETE = '/delete/companion',
  ORDER_LIST = '/admin/order',
  UPDATE_ORDER = '/update/order'
}
//陪护师创建
export const createCompanion = (data: CompanionParams): Promise<Base<string>> => request.post(Escort.COMPANION, data)

//陪护师头像
export const getAvatarList = (): Promise<Base<AvatarData[]>> => request.get(Escort.AVATAR_LIST)

//陪护师列表
export const getCompanionList = (params: CompanionListParams): Promise<Base<CompanionListData<CompanionParams>>> => request.get(Escort.COMPANION_LIST, { params })

//陪护师删除
export const deleteCompanion = (id: Array<{ id: string }>): Promise<Base<string>> => request.post(Escort.COMPANION_DELETE, { id })

//订单详情
export const reqOrderList = (params: OrderListParams): Promise<Base<CompanionListData<OrderListData>>> => request.get(Escort.ORDER_LIST, { params })

//服务状态完成
export const updateOrder = (data: { id: string }): Promise<Base<string>> => request.post(Escort.UPDATE_ORDER, data)
