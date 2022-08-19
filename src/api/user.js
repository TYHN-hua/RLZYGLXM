import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// getUserDetailById 可以获取额外的用户信息
// 用户的头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

export function logout() {
}
