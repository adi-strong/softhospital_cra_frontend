import {api, pathToApi} from "../../app/store";

export const stats2ApiSlice = api.injectEndpoints({
  endpoints: build => ({

    getStats2ByMonth: build.query({
      query: ({ year, month }) => pathToApi+`/get_stats2_by_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getStats2ByMonth2: build.query({
      query: ({ year, month }) => pathToApi+`/get_stats2_by_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getStats2ByYear: build.query({
      query: ({ year }) => pathToApi+`/get_stats2_by_year/${year}`,
      transformResponse: res => res,
    }),

    getMostSalesDrugs: build.query({
      query: ({ year, month }) => pathToApi+`/get_most_sales_drugs/${year}/${month}`,
      transformResponse: res => res,
    }),

    getMostSalesDrugsByMonth: build.query({
      query: ({ year, month }) => pathToApi+`/get_most_sales_drugs/${year}/${month}`,
      transformResponse: res => res,
    }),

    // ***********************************************************

    getLastsActivities: build.query({
      query: ({ year, month }) => pathToApi+`/get_lasts_activities_by_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getLastsActivitiesByMonth: build.query({
      query: ({ year, month }) => pathToApi+`/get_lasts_activities_by_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getLastsActivitiesByLastMonth: build.query({
      query: ({ year, month }) => pathToApi+`/get_lasts_activities_by_last_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getLastsActivitiesByYear: build.query({
      query: ({ year }) => pathToApi+`/get_lasts_activities_by_year/${year}`,
      transformResponse: res => res,
    }),

    // ***********************************************************

    getBoxStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_box_by_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getBoxByMonth: build.query({
      query: ({ year, month }) => pathToApi+`/get_box_by_month/${year}/${month}`,
      transformResponse: res => res,
    }),

    getBoxByYear: build.query({
      query: ({ year }) => pathToApi+`/get_box_by_year/${year}`,
      transformResponse: res => res,
    }),

  })
})

export const {
  useLazyGetBoxByMonthQuery,
  useLazyGetBoxByYearQuery,
  useGetBoxStatsQuery,
  useLazyGetLastsActivitiesByMonthQuery,
  useLazyGetLastsActivitiesByLastMonthQuery,
  useLazyGetLastsActivitiesByYearQuery,
  useGetLastsActivitiesQuery,
  useLazyGetMostSalesDrugsByMonthQuery,
  useGetMostSalesDrugsQuery,
  useLazyGetStats2ByYearQuery,
  useLazyGetStats2ByMonth2Query,
  useGetStats2ByMonthQuery,
} = stats2ApiSlice
