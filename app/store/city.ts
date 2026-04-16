import type { City, CityGroups } from '~/api/modules/city'
// app/store/city.ts
import { defineStore } from 'pinia'
import { getCityAll } from '~/api/modules/city'

// app/store/city.ts
export const useCityStore = defineStore('city', () => {
  const currentCity = ref<City>({
    cityId: 45,
    cityName: '广州',
  })

  const allCities = ref<CityGroups | null>(null)

  async function fetchAllCitiesData() {
    if (allCities.value)
      return
    const res = await getCityAll()
    // 赋值
    allCities.value = res.data
  }

  return { currentCity, allCities, fetchAllCitiesData }
})
