// 以下接口为手动编写
import { request } from '@/utils'
import type { AxiosRequestConfig } from 'axios'

/** 云盘 - 登录 */
export async function token(options: AxiosRequestConfig = {}) {
  return request<API.RDriveToken>(`${import.meta.env.VITE_ALIYUN_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      otp_code: '',
      username: 'upload',
      password: 'kyjg666',
    },
    ...options,
  })
}

/** 云盘 - 上传图片到指定目录 */
export async function upload(
  body: API.AliyunDriveUploadVO,
  options: AxiosRequestConfig = {},
) {
  const { file, path, password = '', authorization } = body
  const formData = new FormData()
  formData.append('file', file)
  return request<API.RBase>(`${import.meta.env.VITE_ALIYUN_BASE}/api/fs/form`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
      'file-path': encodeURIComponent(path),
      password,
      authorization,
    },
    data: formData,
    ...options,
  })
}
