import {api, pathToApi} from "../../app/store";
import moment from "moment";

export let totalAgentsApp = 0
export let totalResearchAgentsApp = 0
export let researchAgentsAppPages = 1
export let agentsAppPages = 1

export const agentAppointmentsApiSlice = api.injectEndpoints({
  endpoints: build => ({

    getAgentAppointments: build.query({
      query: id => pathToApi+`/agents/${id}/appointments`,
      transformResponse: res => {
        totalAgentsApp = res['hydra:totalItems']
        agentsAppPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(appointment => {
          if (appointment?.createdAt) appointment.createdAt = moment(appointment.createdAt).calendar()
          if (appointment?.appointmentDate) appointment.appointmentDate = moment(appointment.appointmentDate).calendar()
          return appointment
        })
      },
    }),

    getAgentsAppByPagination: build.query({
      query: ({ id, page }) => pathToApi+`/agents/${id}/appointments?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalAgentsApp = res['hydra:totalItems']
        agentsAppPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          if (act?.appointmentDate) act.appointmentDate = moment(act.appointmentDate).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchAgentsApp: build.query({
      query: ({ id, keyword }) => pathToApi+`/agents/${id}/appointments?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchAgentsApp = res['hydra:totalItems']
        researchAgentsAppPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          if (act?.appointmentDate) act.appointmentDate = moment(act.appointmentDate).calendar()
          return act
        })
      },
    }),

    getResearchAgentsAppByPagination: build.query({
      query: ({ id, search }) => pathToApi+`/agents/${id}/appointments?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchAgentsApp = res['hydra:totalItems']
        researchAgentsAppPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          if (act?.appointmentDate) act.appointmentDate = moment(act.appointmentDate).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetAgentsAppByPaginationQuery,
  useLazyGetResearchAgentsAppQuery,
  useLazyGetResearchAgentsAppByPaginationQuery,
  useLazyGetAgentAppointmentsQuery,
} = agentAppointmentsApiSlice
