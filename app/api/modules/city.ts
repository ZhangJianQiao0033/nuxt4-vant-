// app/api/modules/city.ts
import { useRequest } from '../request'

// 1. 定义基础城市信息 (只保留业务需要的字段)
export interface City {
  cityId: number
  cityName: string
  // 如果首页需要经纬度，可以保留；如果不需要，可以删掉
  longitude?: string
  latitude?: string
}

// 2. 字母分组结构
export interface GroupCity {
  group: string // 右侧索引栏依赖这个字段
  cities: City[]
}

// 3. 对应数据内部结构
export interface CityGroupData {
  title: string
  hotCities: City[]
  cities: GroupCity[]
}

// 4. 业务数据汇总
export interface CityGroups {
  cityGroup: CityGroupData
  cityGroupOverSea: CityGroupData
}

// 5. 通用接口响应包装
export interface IBaseResponse<T> {
  ret: boolean
  errmsg: string | null
  data: T
}

/**
 * 获取城市列表（已进行数据瘦身）
 */
export async function getCityAll() {
  const res = await useRequest().get<IBaseResponse<CityGroups>>('/city/all')

  // 辅助函数：将原始庞大的数据转化为精简结构
  const simplify = (groupData: any): CityGroupData => ({
    title: groupData.title,
    // 热门城市瘦身
    hotCities: groupData.hotCities.map((c: any) => ({
      cityId: c.cityId,
      cityName: c.cityName,
    })),
    // 列表城市瘦身 (关键：必须保留 group 字段)
    cities: groupData.cities.map((g: any) => ({
      group: g.group, // <--- 必须有这个，否则索引栏会消失
      cities: g.cities.map((c: any) => ({
        cityId: c.cityId,
        cityName: c.cityName,
      })),
    })),
  })

  // 组装并返回
  return {
    ...res,
    data: {
      cityGroup: simplify(res.data.cityGroup),
      cityGroupOverSea: simplify(res.data.cityGroupOverSea),
    },
  }
}
