/*
  Users store
*/
import { User } from '@/models/User'

// state
const state = {
  current: new User(),
  all: []
}

// getters
const getters = {
  currentUser: state => {
    return state.current
  }
}

// actions
const actions = {
  loadCurrentUser(context) {

  }
}

// mutations
const mutations = {
  castCurrentUser(state, profileData) {
    state.current.mapProfileData(profileData)
  },
  setCurrentUserSiteID(state, id) {
    state.current.siteID = id
  },
  setCurrentUserAsReadOnly(state) {
    state.current.setAsReadOnly()
  },
  setCurrentUserTestEmail() {
    state.current.email = 'test-from@test.com'
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

// error logger
