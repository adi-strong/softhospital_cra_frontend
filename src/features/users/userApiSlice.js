import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export const userApiSlice = api.injectEndpoints({
  endpoints: build => ({
    editUser: build.mutation({
      query: user => ({
        headers: patchHeaders,
        url: pathToApi+`/users/${user.id}`,
        method: 'PATCH',
        body: JSON.stringify({...user, profile: user?.profile ? user.profile.id : null}),
      }),
      invalidatesTags: ['Users'],
    }), // Edit User

    getSingleUser: build.query({
      query: ({ id }) => pathToApi+`/users/${id}`,
      transformResponse: res => {
        const createdAt = res.createdAt ? moment(res.createdAt).fromNow() : null
        return res ? {...res, createdAt} : null
      },
      providesTags: (result, error, arg) => [{ type: 'Users', id: arg.id }]
    }), // Get single User
  }),
})

export const {
  useEditUserMutation,
  useGetSingleUserQuery,
} = userApiSlice
