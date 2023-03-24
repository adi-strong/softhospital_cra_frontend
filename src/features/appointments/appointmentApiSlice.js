import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalAppointments = 0
export let totalResearchAppointments = 0
export let researchAppointmentsPages = 1
export let appointmentsPages = 1

export const appointmentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getAppointments: build.query({
      query: () => pathToApi+'/appointments',
      transformResponse: res => {
        totalAppointments = res['hydra:totalItems']
        appointmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        return data?.map(appointment => {
          if (appointment?.createdAt) appointment.createdAt = moment(appointment.createdAt).calendar()
          return appointment
        })
      },
      providesTags: result => result
          ? [...result?.map(({ id }) => ({ type: 'Appointments', id })), 'Appointments']
          : ['Appointments']
    }), // list of appointments

    addNewAppointment: build.mutation({
      query: appointment => ({
        url: pathToApi+'/appointments',
        method: 'POST',
        body: {...appointment,
          doctor: appointment?.doctor ? appointment.doctor?.value : null,
          patient: appointment?.patient ? appointment.patient?.value : null,
        },
      }),
      invalidatesTags: ['Appointments']
    }), // add new appointment

    updateAppointment: build.mutation({
      query: appointment => ({
        headers: patchHeaders,
        url: pathToApi+`/appointments/${appointment.id}`,
        method: 'PATCH',
        body: JSON.stringify({...appointment,
          doctor: appointment?.doctor ? appointment.doctor?.value : null,
          patient: appointment?.patient ? appointment.patient?.value : null,
        }),
      }),
      transformResponse: (res, meta, arg) => {
        return {
          ...res,
          createdAt: res?.createdAt
            ? moment(res.createdAt).calendar()
            : null
        }
      },
      invalidatesTags: (result, error, arg) => ['Appointments', 'Consultations'],
    }), // update appointment

    deleteAppointment: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/appointments/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Appointments']
    }), // delete appointment

    toggleAppointment: build.mutation({
      query: ({ id, isComplete, contents }) => ({
        headers: patchHeaders,
        url: pathToApi+`/appointments/${id}`,
        method: 'PATCH',
        body: JSON.stringify({ isComplete })
      }),
      async onQueryStarted({ id, isComplete, page, search }, { dispatch, queryFulfilled, requestId }) {
        const patchResult = dispatch(
          appointmentApiSlice.util.updateQueryData('getAppointments', 'Appointments', draft => {
            const appointment = draft?.find(item => item?.id === id)
            if (appointment) appointment.isComplete = isComplete
          })
        )

        const patchPaginatedResult = dispatch(
          appointmentApiSlice.util.updateQueryData('getAppointmentsByPagination', page, draft => {
            const appointment = draft?.find(item => item?.id === id)
            if (appointment) appointment.isComplete = isComplete
          })
        )

        const patchResearchResult = dispatch(
          appointmentApiSlice.util.updateQueryData('getResearchAppointments', search, draft => {
            const appointment = draft?.find(item => item?.id === id)
            if (appointment) appointment.isComplete = isComplete
          })
        )

        const keywords = {keyword: search, page}
        const patchResearchByPaginationResult = dispatch(
          appointmentApiSlice.util.updateQueryData('getResearchAppointmentsByPagination', keywords, draft => {
            const appointment = draft?.find(item => item?.id === id)
            if (appointment) appointment.isComplete = isComplete
          })
        )

        try {
          await queryFulfilled
        }
        catch {
          patchResult.undo()
          patchPaginatedResult.undo()
          patchResearchResult.undo()
          patchResearchByPaginationResult.undo()
        }
      }
    }),

    getAppointmentsByPagination: build.query({
      query: page => pathToApi+`/appointments?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalAppointments = res['hydra:totalItems']
        appointmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(appointment => {
          if (appointment?.createdAt) appointment.createdAt = moment(appointment.createdAt).calendar()
          return appointment
        })
      },
    }), // pagination list,

    getResearchAppointments: build.query({
      query: keyword => pathToApi+`/appointments?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchAppointments = res['hydra:totalItems']
        researchAppointmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(appointment => {
          if (appointment?.createdAt) appointment.createdAt = moment(appointment.createdAt).calendar()
          return appointment
        })
      },
    }),

    getResearchAppointmentsByPagination: build.query({
      query: search => pathToApi+`/appointments?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchAppointments = res['hydra:totalItems']
        researchAppointmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(appointment => {
          if (appointment?.createdAt) appointment.createdAt = moment(appointment.createdAt).calendar()
          return appointment
        })
      },
    }),

  })
})

export const {
  useLazyGetAppointmentsByPaginationQuery,
  useLazyGetResearchAppointmentsQuery,
  useLazyGetResearchAppointmentsByPaginationQuery,
  useGetAppointmentsQuery,
  useAddNewAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useToggleAppointmentMutation,
} = appointmentApiSlice
