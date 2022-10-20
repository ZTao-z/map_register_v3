export interface UserAuthOptions {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  expiresTime?: number
  userId?: string
  userRoles?: string[]
}

export const useAuthInfo = () => useLocalStorage<Partial<UserAuthOptions>>('__ys_dadian_auth', {})

/** 将用户凭证存储到本地 */
export const saveUser = (auth: UserAuthOptions = {}) => {
  const authInfo = useAuthInfo()
  authInfo.value = {
    ...auth,
    expiresTime: new Date().getTime() + 1000 * (auth.expires_in ?? 0),
  }
}

export const validateUserToken = () => {
  const authInfo = useAuthInfo()
  const { expiresTime = 0, access_token = '' } = authInfo.value
  if (!access_token)
    return false
  return expiresTime > new Date().getTime()
}
