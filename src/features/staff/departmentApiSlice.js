import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalDepartments = 0
const departmentsAdapter = createEntityAdapter()
const initialState = departmentsAdapter.getInitialState()

export const departmentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getDepartments: build.query({
      query: () => pathToApi+'/departments',
      transformResponse: res => {
        totalDepartments = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        const loadDepartments = data?.map(department => {
          if (department?.createdAt) department.createdAt = moment(department.createdAt).calendar()
          return department
        })
        return departmentsAdapter.setAll(initialState, loadDepartments)
      },
      providesTags: result => [
        { type: 'Departments', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Departments', id }))
      ]
    }), // List of Departments

    addNewDepartment: build.mutation({
      query: department => ({
        url: pathToApi+'/departments',
        method: 'POST',
        body: department,
      }),
      invalidatesTags: ['Departments']
    }), // Add new Department

    updateDepartment: build.mutation({
      query: department => ({
        headers: patchHeaders,
        url: pathToApi+`/departments/${department.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: department.name}),
      }),
      invalidatesTags: ['Departments', 'Services']
    }), // Update Department

    deleteDepartment: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/departments/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Departments', 'Services'],
    }), // Delete Department

    loadDepartmentsOptions: build.query({
      query: arg => pathToApi+`/departments?name=${arg}`,
    }), // Load departments options
  })
})

export const {
  useGetDepartmentsQuery,
  useLazyLoadDepartmentsOptionsQuery,
  useAddNewDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApiSlice
