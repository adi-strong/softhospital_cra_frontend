import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

const officesAdapter = createEntityAdapter()
const initialState = officesAdapter.getInitialState()

export const officeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getOffices: build.query({
      query: () => pathToApi+'/offices',
      transformResponse: res => {
        const data = res['hydra:member'] ? res['hydra:member'] : []
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
  })
})

export const {
  useGetOfficesQuery,
  useLazyGetOfficesOptionsQuery,
  useAddNewOfficeMutation,
  useUpdateOfficeMutation,
  useDeleteOfficeMutation,
} = officeApiSlice
