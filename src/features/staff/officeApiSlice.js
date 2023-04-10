import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

const officesAdapter = createEntityAdapter()
const initialState = officesAdapter.getInitialState()

export let totalOffices = 0
export let totalResearchOffices = 0
export let researchOfficesPages = 1
export let officesPages = 1

export const officeApiSlice = api.injectEndpoints({
  endpoints: build => ({

    addNewOffice: build.mutation({
      query: office => ({
        url: pathToApi+'/offices',
        method: 'POST',
        body: office,
      }),
      invalidatesTags: ['Offices', 'Agents']
    }), // add new

    updateOffice: build.mutation({
      query: office => ({
        headers: patchHeaders,
        url: pathToApi+`/offices/${office.id}`,
        method: 'PATCH',
        body: JSON.stringify({title: office.title})
      }),
      invalidatesTags: ['Offices', 'Agents']
    }), // update office

    deleteOffice: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/offices/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true})
      }),
      invalidatesTags: ['Offices', 'Agents']
    }), // delete office

    getOfficesOptions: build.query({
      query: arg => pathToApi+`/offices?title=${arg}`,
    }), // lazy search

    getOffices: build.query({
      query: () => pathToApi+'/offices',
      transformResponse: res => {
        const data = res['hydra:member'] ? res['hydra:member'] : []
        officesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const loadOffices = data?.map(office => {
          if (office?.createdAt) office.createdAt = moment(office.createdAt).calendar()
          return office
        })
        return officesAdapter.setAll(initialState, loadOffices)
      },
      providesTags: result => [
        {type: 'Offices', id: 'LIST'},
        ...result.ids.map(id => ({type: 'Offices', id}))
      ]
    }), // get list of Offices

    getOfficesByPagination: build.query({
      query: page => pathToApi+`/offices?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalOffices = res['hydra:totalItems']
        officesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchOffices: build.query({
      query: keyword => pathToApi+`/offices?title=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchOffices = res['hydra:totalItems']
        researchOfficesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchOfficesByPagination: build.query({
      query: search => pathToApi+`/offices?title=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchOffices = res['hydra:totalItems']
        researchOfficesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetOfficesByPaginationQuery,
  useLazyGetResearchOfficesQuery,
  useLazyGetResearchOfficesByPaginationQuery,
  useGetOfficesQuery,
  useLazyGetOfficesOptionsQuery,
  useAddNewOfficeMutation,
  useUpdateOfficeMutation,
  useDeleteOfficeMutation,
} = officeApiSlice
