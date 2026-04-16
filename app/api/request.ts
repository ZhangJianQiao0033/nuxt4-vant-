import type { FetchOptions } from 'ofetch'
import { $fetch } from 'ofetch'

class Request {
  private instance: any

  constructor(baseURL: string) {
    this.instance = $fetch.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // 可以在这里添加全局拦截器
      async onResponseError({ response }) {
        console.error('API Error:', response.status, response._data)
      },
    })
  }

  get<T = any>(url: string, query?: any, options?: FetchOptions): Promise<T> {
    return this.instance(url, { method: 'GET', query, ...options })
  }

  post<T = any>(url: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.instance(url, { method: 'POST', body: data, ...options })
  }

  put<T = any>(url: string, data?: any, options?: FetchOptions): Promise<T> {
    return this.instance(url, { method: 'PUT', body: data, ...options })
  }

  delete<T = any>(url: string, options?: FetchOptions): Promise<T> {
    return this.instance(url, { method: 'DELETE', ...options })
  }
}

// 导出这个 Composable。在 Nuxt 中，use 开头的函数会自动被识别
export function useRequest() {
  const config = useRuntimeConfig()
  // 关键：从运行时配置中动态获取地址
  return new Request(config.public.apiBase)
}
