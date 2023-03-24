import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalActCategories = 0
export let totalResearchActCategories = 0
export let researchActCategoriesPages = 1
export let actCategoriesPages = 1

export const actCategoriesApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getActCategories: build.query({
      query: () => pathToApi+'/act_categories',
      transformResponse: res => {
        totalActCategories = res['hydra:totalItems']
        actCategoriesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'ActCategories', id })), 'ActCategories']
          : ['ActCategories']
    }), // list of acts

    addNewActCategory: build.mutation({
      query: category => ({
        url: pathToApi+'/act_categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['ActCategories']
    }), // add new act

    updateActCategory: build.mutation({
      query: category => ({
        headers: patchHeaders,
        url: pathToApi+`/act_categories/${category.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: category.name}),
      }),
      invalidatesTags: ['ActCategories', 'Act']
    }), // update act

    deleteActCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/act_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['ActCategories', 'Act']
    }), // delete act

    getActCategoriesByPagination: build.query({
      query: page => pathToApi+`/act_categories?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalActCategories = res['hydra:totalItems']
        actCategoriesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchActCategories: build.query({
      query: keyword => pathToApi+`/act_categories?name=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchActCategories = res['hydra:totalItems']
        researchActCategoriesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchActCategoriesByPagination: build.query({
      query: search => pathToApi+`/act_categories?name=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchActCategories = res['hydra:totalItems']
        researchActCategoriesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetActCategoriesByPaginationQuery,
  useLazyGetResearchActCategoriesQuery,
  useLazyGetResearchActCategoriesByPaginationQuery,
  useGetActCategoriesQuery,
  useAddNewActCategoryMutation,
  useUpdateActCategoryMutation,
  useDeleteActCategoryMutation,
} = actCategoriesApiSlice
