import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalAgents = 0
const agentsAdapter = createEntityAdapter()
const initialState = agentsAdapter.getInitialState()

export let totalResearchAgents = 0
export let researchAgentsPages = 1
export let agentsPages = 1

export const agentApiSlice = api.injectEndpoints({
  endpoints: build => ({

    addNewAgent: build.mutation({
      query: agent => ({
        url: pathToApi+'/agents',
        method: 'POST',
        body: agent,
      }),
      invalidatesTags: ['Agents']
    }), // add new agent

    updateAgent: build.mutation({
      query: agent => ({
        headers: patchHeaders,
        url: pathToApi+`/agents/${agent.id}`,
        method: 'PATCH',
        body: JSON.stringify(agent),
      }),
      invalidatesTags: ['Agents', 'Users']
    }), // update agent

    deleteAgent: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/agents/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Agents']
    }), // delete agent

    getSingleAgent: build.query({
      query: id => pathToApi+`/agents/${id}`,
      transformResponse: res => {
        const createdAt = res?.createdAt ? moment(res.createdAt).calendar() : null
        return { ...res, createdAt }
      },
      providesTags: (result, error, arg) => [{type: 'Agents', id: arg}],
    }), // Get single agent

    handleLoadAgents: build.query({
      query: keyword => pathToApi+`/agents?fullName=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(agent => {
          const name = agent?.name
          const lastName = agent?.lastName ? agent.lastName : ''
          const firstName = agent?.firstName ? agent.firstName : ''

          const office = agent?.office ? `(${agent.office?.title})` : ''

          const label = `${name} ${lastName} ${firstName} ${office}`

          return {
            label,
            value: agent['@id'],
            id: agent?.id,
          }

        })
      },
    }),

    getAgents: build.query({
      query: () => pathToApi+'/agents',
      transformResponse: res => {
        totalAgents = res['hydra:totalItems']
        agentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        const loadAgents = data.map(agent => {
          if (agent?.createdAt) agent.createdAt = moment(agent.createdAt).calendar()
          return agent
        })
        return agentsAdapter.setAll(initialState, loadAgents)
      },
      providesTags: result => [
        {type: 'Agents', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Agents', id }))
      ]
    }), // list of agents

    getAgentsByPagination: build.query({
      query: page => pathToApi+`/agents?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalAgents = res['hydra:totalItems']
        agentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchAgents: build.query({
      query: keyword => pathToApi+`/agents?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchAgents = res['hydra:totalItems']
        researchAgentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchAgentsByPagination: build.query({
      query: search => pathToApi+`/agents?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchAgents = res['hydra:totalItems']
        researchAgentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetResearchAgentsByPaginationQuery,
  useLazyGetResearchAgentsQuery,
  useLazyGetAgentsByPaginationQuery,
  useGetAgentsQuery,
  useGetSingleAgentQuery,
  useAddNewAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useLazyHandleLoadAgentsQuery,
} = agentApiSlice
