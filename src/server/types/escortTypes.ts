export interface CompanionParams {
  active: number
  age: number
  avatar: string
  id: string
  mobile: string
  name: string
  sex: string
  create_time?: string
}

export interface Base<T> {
  code: number
  message: string
  data: T
}

export interface AvatarData {
  name: string
  url: string
}

export interface CompanionListParams {
  pageNum: number
  pageSize: number
}

export interface CompanionListData<T> {
  list: T[]
  total: number
}

export interface OrderListParams {
  pageNum: number
  pageSize: number
  out_trade_no?: string
}
// -----
interface Companion {
  id: number
  name: string
  avatar: string
  sex: string
  age: number
  mobile: string
}

interface Client {
  id: number
  name: string
  mobile: string
}
export interface OrderListData {
  starttime: string
  client: Client
  order_start_time: number
  trade_state: string
  time_end: string
  service_state: string
  serviceImg: string
  out_trade_no: string
  receiveAddress: string
  hospital_id: number
  hospital_name: string
  companion_id: number
  price: string
  demand: string
  transaction_id: string
  user_id: string
  code_url: string
  service_name: string
  tel: string
  paidPrice: string
  companion: Companion
}
