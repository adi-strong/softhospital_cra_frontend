import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalCovenants = 0
const covenantsAdapter = createEntityAdapter()
const initialState = covenantsAdapter.getInitialState()
export let totalResearchCovenants = 0
export let researchCovenantsPages = 1
export let covenantsPages = 1

export const covenantApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getCovenants: build.query({
      query: () => pathToApi+'/covenants',
      transformResponse: res => {
        totalCovenants = res['hydra:totalItems']
        const data = res['hydra:member']
        covenantsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const loadCovenants = data.map(covenant => {
          if (covenant?.createdAt) covenant.createdAt = moment(covenant.createdAt).calendar()
          return covenant
        })
        return covenantsAdapter.setAll(initialState, loadCovenants)
      },
      providesTags: result => [
        {type: 'Covenant', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Covenant', id }))
      ]
    }), // list of covenants

    addNewCovenant: build.mutation({
      query: covenant => ({
        url: pathToApi+'/covenants',
        method: 'POST',
        body: covenant,
      }),
      invalidatesTags: ['Covenant']
    }), // add new covenant

    updateCovenant: build.mutation({
      query: covenant => ({
        headers: patchHeaders,
        url: pathToApi+`/covenants/${covenant.id}`,
        method: 'PATCH',
        body: JSON.stringify({
          denomination: covenant.denomination,
          unitName: covenant?.unitName ? covenant.unitName : null,
          focal: covenant?.focal ? covenant.focal : null,
          tel: covenant?.tel ? covenant.tel : null,
          email: covenant?.email ? covenant.email : null,
          address: covenant?.address ? covenant.address : null,
          logo: covenant?.logo
            ? covenant.logo['@id']
              ? covenant.logo['@id']
              : covenant.logo.id
            : null,
        }),
      }),
      invalidatesTags: ['Covenant']
    }), // update covenant

    deleteCovenant: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/covenants/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Covenant']
    }), // delete covenant

    getSingleCovenant: build.query({
      query: id => pathToApi+`/covenants/${id}`,
      transformResponse: (res, meta, arg) => {
        return {...res, createdAt: res?.createdAt ? moment(res.createdAt).calendar() : null,}
      },
      providesTags: (result, error, arg) => [{type: 'SingleCovenant', id: arg}]
    }), // get single covenant

    loadCovenants: build.query({
      query: keyword => pathToApi+`/covenants?denomination=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        return data.map(covenant => {
          return {
            id: covenant.id,
            label: covenant.denomination,
            value: covenant['@id']
          }
        })
      }
    }), // load covenants

    getCovenantsByPagination: build.query({
      query: page => pathToApi+`/covenants?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalCovenants = res['hydra:totalItems']
        covenantsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchCovenants: build.query({
      query: keyword => pathToApi+`/covenants?denomination=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchCovenants = res['hydra:totalItems']
        researchCovenantsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchCovenantsByPagination: build.query({
      query: search => pathToApi+`/covenants?denomination=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchCovenants = res['hydra:totalItems']
        researchCovenantsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    onPostNewCovenantContract: build.mutation({
      query: ({ id, file }) => ({
        url: pathToApi+`/covenants/${id}/new_contract`,
        method: 'POST',
        body: file,
      }),
      invalidatesTags: [{type: 'Covenant', id: 'LIST'}]
    }),
  })
})

export const {
  useOnPostNewCovenantContractMutation,
  useGetCovenantsQuery,
  useAddNewCovenantMutation,
  useUpdateCovenantMutation,
  useDeleteCovenantMutation,
  useGetSingleCovenantQuery,
  useLazyLoadCovenantsQuery,
  useLazyGetCovenantsByPaginationQuery,
  useLazyGetResearchCovenantsQuery,
  useLazyGetResearchCovenantsByPaginationQuery,
} = covenantApiSlice
