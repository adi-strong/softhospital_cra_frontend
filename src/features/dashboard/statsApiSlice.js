import {api, pathToApi} from "../../app/store";

export const statsApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getFileStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_file_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getThisMonthFileStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_file_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getLastMonthFileStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_file_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getFileStatsByYear: build.query({
      query: ({ year }) => pathToApi+`/get_file_stats_by_year/${year}`,
      transformResponse: res => res,
    }),

    // ---------------------------------------------------------------

    getRevenueStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_revenue_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getThisMonthRevenueStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_revenue_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getLastMonthRevenueStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_revenue_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getRevenueStatsByYear: build.query({
      query: ({ year }) => pathToApi+`/get_revenue_by_year_stats/${year}`,
      transformResponse: res => res,
    }),

    // ---------------------------------------------------------------

    getPatientsStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_patients_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getThisMonthPatientsStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_patients_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getLastMonthPatientsStats: build.query({
      query: ({ year, month }) => pathToApi+`/get_patients_stats/${year}/${month}`,
      transformResponse: res => res,
    }),

    getPatientsStatsByYear: build.query({
      query: ({ year }) => pathToApi+`/get_patients_by_year_stats/${year}`,
      transformResponse: res => res,
    }),
  })
})

export const {
  useLazyGetPatientsStatsByYearQuery,
  useLazyGetLastMonthPatientsStatsQuery,
  useLazyGetThisMonthPatientsStatsQuery,
  useGetPatientsStatsQuery,
  useLazyGetRevenueStatsByYearQuery,
  useLazyGetLastMonthRevenueStatsQuery,
  useLazyGetThisMonthRevenueStatsQuery,
  useGetRevenueStatsQuery,
  useLazyGetFileStatsByYearQuery,
  useLazyGetThisMonthFileStatsQuery,
  useLazyGetLastMonthFileStatsQuery,
  useGetFileStatsQuery,
} = statsApiSlice
