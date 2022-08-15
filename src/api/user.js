import request from '@/utils/request'

// 登录接口
export function login(data) {
    return request ({
        url:'/sys/login',
        method: 'POST',
        data
    })
}

export function logout() {}
