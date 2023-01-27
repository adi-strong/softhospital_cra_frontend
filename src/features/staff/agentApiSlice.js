import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalAgents = 0
const agentsAdapter = createEntityAdapter()
const initialState = agentsAdapter.getInitialState()

export const agentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getAgents: build.query({
      query: () => pathToApi+'/agents',
      transformResponse: res => {
        totalAgents = res['hydra:totalItems']
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
  })
})

export const {
  useGetAgentsQuery,
  useGetSingleAgentQuery,
  useAddNewAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
} = agentApiSlice
