import 'vue-router'
import type { RoleTypeEnum } from '@/shared'

declare module 'vue-router' {
  /** 拓展元信息类型 */
  interface RouteMeta {
    /** 路由标题 */
    title?: string
    /** 路由图标 - 可用于面包屑、侧边栏 */
    icon?: string
    /** 路由权限标识 */
    roles?: string[]
  }
}
