import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalUsers = 0
const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

export let totalResearchUsers = 0
export let researchUsersPages = 1
export let usersPages = 1

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

    addNewUser: build.mutation({
      query: user => ({
        url: pathToApi+'/users',
        method: 'POST',
        body: {...user},
      }),
      invalidatesTags: ['Users', 'Agents'],
    }), // Add new user

    updateUser: build.mutation({
      query: user => ({
        headers: patchHeaders,
        url: pathToApi+`/users/${user.id}`,
        method: 'PATCH',
        body: JSON.stringify({...user}),
      }),
      invalidatesTags: ['Users', 'Agents'],
    }), // update user

    deleteUser: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/users/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Users']
    }), // delete user

    getUsers: build.query({
      query: () => pathToApi+'/users',
      transformResponse: res => {
        totalUsers = parseInt(res['hydra:totalItems'])
        usersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        const loadUsers = data.map(user => {
          if (user?.createdAt) user['createdAt'] = moment(user.createdAt).calendar()
          return user
        })
        return usersAdapter.setAll(initialState, loadUsers)
      },
      providesTags: result => [
        {type: 'Users', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Users', id }))
      ]
    }), // Get list users

    getUsersByPagination: build.query({
      query: page => pathToApi+`/users?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalUsers = res['hydra:totalItems']
        usersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchUsers: build.query({
      query: keyword => pathToApi+`/users?username=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchUsers = res['hydra:totalItems']
        researchUsersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchUsersByPagination: build.query({
      query: search => pathToApi+`/users?username=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchUsers = res['hydra:totalItems']
        researchUsersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),
  }),
})

export const {
  useLazyGetUsersByPaginationQuery,
  useLazyGetResearchUsersQuery,
  useLazyGetResearchUsersByPaginationQuery,
  useEditUserMutation,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useGetUsersQuery,
} = userApiSlice
