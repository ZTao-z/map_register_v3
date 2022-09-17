import { request } from '@/utils'

export type UserSearchFilter = {
  current: number
  size: number
  nickname?: string
  sort?: string[]
  username?: string
}
export interface UserProfile {
  username?: string
  nickname?: string
  qq?: string
  phone?: string
}
export interface UserData extends UserProfile {
  id: number
  roleList?: {
    items: RoleData[]
  } | null
}
export type RoleData = {
  id: number
  name: string
  code: string
  sort: number
}
export function fetch_user_list(data: UserSearchFilter) {
  return request({
    url: 'system/user/info/userList',
    method: 'post',
    data: data,
  })
}
export function delete_user(userid: number) {
  return request({
    url: `system/user/${userid}`,
    method: 'delete',
  })
}
export function update_user(data: UserData) {
  return request({
    url: 'system/user/update',
    method: 'post',
    data: {
      userId: data.id,
      nickname: data.nickname,
      username: data.username,
      qq: data.qq,
      phone: data.phone,
    },
  })
}

export function create_user(data: { username: string; password: string }) {
  return request({
    url: 'system/user/register',
    method: 'post',
    data: data,
  })
}