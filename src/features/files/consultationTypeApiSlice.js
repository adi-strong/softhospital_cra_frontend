import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalConsultationTypes = 0
export let totalResearchConsultationTypes = 0
export let researchConsultationTypesPages = 1
export let consultationTypesPages = 1

export const consultationTypeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getConsultationTypes: build.query({
      query: () => pathToApi+'/consultations_types',
      transformResponse: res => {
        totalConsultationTypes = res['hydra:totalItems']
        consultationTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'ConsultationType', id })), 'ConsultationType']
          : ['ConsultationType']
    }), // list of consultation's types

    addNewConsultationType: build.mutation({
      query: type => ({
        url: pathToApi+'/consultations_types',
        method: 'POST',
        body: {...type, price: type.price ? type.price.toString() : '0'},
      }),
      invalidatesTags: ['ConsultationType']
    }), // add new consultation's types

    updateConsultationType: build.mutation({
      query: type => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations_types/${type.id}`,
        method: 'PATCH',
        body: JSON.stringify(type),
      }),
      invalidatesTags: ['ConsultationType']
    }), // update consultation's types

    deleteConsultationType: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations_types/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['ConsultationType']
    }), // delete consultation's types

    handleLoadConsultTypes: build.query({
      query: keyword => pathToApi+`/consultations_types?wording=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(file => {
          return {
            label: file?.wording,
            value: file['@id'],
          }
        })
      }
    }),

    getConsultationTypesByPagination: build.query({
      query: page => pathToApi+`/consultations_types?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalConsultationTypes = res['hydra:totalItems']
        consultationTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
      },
    }), // pagination list,

    getResearchConsultationTypes: build.query({
      query: keyword => pathToApi+`/consultations_types?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchConsultationTypes = res['hydra:totalItems']
        researchConsultationTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
      },
    }),

    getResearchConsultationTypesByPagination: build.query({
      query: search => pathToApi+`/consultations_types?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchConsultationTypes = res['hydra:totalItems']
        researchConsultationTypesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
      },
    }),
  })
})

export const {
  useLazyGetResearchConsultationTypesByPaginationQuery,
  useLazyGetResearchConsultationTypesQuery,
  useLazyGetConsultationTypesByPaginationQuery,
  useGetConsultationTypesQuery,
  useDeleteConsultationTypeMutation,
  useAddNewConsultationTypeMutation,
  useUpdateConsultationTypeMutation,
  useLazyHandleLoadConsultTypesQuery,
} = consultationTypeApiSlice
