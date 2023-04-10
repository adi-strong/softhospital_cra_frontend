import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalDepartments = 0
const departmentsAdapter = createEntityAdapter()
const initialState = departmentsAdapter.getInitialState()

export let totalResearchDepartments = 0
export let researchDepartmentsPages = 1
export let departmentsPages = 1

export const departmentApiSlice = api.injectEndpoints({
  endpoints: build => ({

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

    getDepartments: build.query({
      query: () => pathToApi+'/departments',
      transformResponse: res => {
        totalDepartments = parseInt(res['hydra:totalItems'])
        departmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getDepartmentsByPagination: build.query({
      query: page => pathToApi+`/departments?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalDepartments = res['hydra:totalItems']
        departmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchDepartments: build.query({
      query: keyword => pathToApi+`/departments?name=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchDepartments = res['hydra:totalItems']
        researchDepartmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchDepartmentsByPagination: build.query({
      query: search => pathToApi+`/departments?name=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchDepartments = res['hydra:totalItems']
        researchDepartmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetDepartmentsByPaginationQuery,
  useLazyGetResearchDepartmentsQuery,
  useLazyGetResearchDepartmentsByPaginationQuery,
  useGetDepartmentsQuery,
  useLazyLoadDepartmentsOptionsQuery,
  useAddNewDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApiSlice
