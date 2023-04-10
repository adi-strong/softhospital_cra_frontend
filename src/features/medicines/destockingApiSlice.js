import {api, pathToApi} from "../../app/store";

export const destockingApiSlice = api.injectEndpoints({
  endpoints: build => ({

    getDestocking: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/medicines/${id}/destocking_publication`,
        method: 'POST',
        body: { },
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList'],
    })

  })
})

export const { useGetDestockingMutation } = destockingApiSlice
