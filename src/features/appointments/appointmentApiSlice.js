import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalAppointments = 0

export const appointmentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getAppointments: build.query({
      query: () => pathToApi+'/appointments',
      transformResponse: res => {
        totalAppointments = res['hydra:totalItems']
        const data = res['hydra:member']
        return data?.map(appointment => {
          if (appointment?.createdAt) appointment.createdAt = moment(appointment.createdAt).calendar()
          return appointment
        })
      },
      providesTags: result =>
        result
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
      query: ({ id, isComplete }) => ({
        headers: patchHeaders,
        url: pathToApi+`/appointments/${id}`,
        method: 'PATCH',
        body: JSON.stringify({ isComplete })
      }),
      async onQueryStarted({ id, isComplete }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          appointmentApiSlice.util.updateQueryData('getAppointments', 'Appointments', draft => {
            const appointment = draft?.find(item => item?.id === id)
            if (appointment) appointment.isComplete = isComplete
          })
        )

        try {
          await queryFulfilled
        }
        catch { patchResult.undo() }
      }
    }),
  })
})

export const {
  useGetAppointmentsQuery,
  useAddNewAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useToggleAppointmentMutation,
} = appointmentApiSlice
