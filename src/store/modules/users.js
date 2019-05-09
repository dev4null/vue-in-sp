/*
  Users store
*/
import { User } from "@/models/User";

// state
const state = {
  current: new User(),
  all: []
};

// getters
const getters = {
  currentUser: state => {
    return state.current;
  }
};

// actions
const actions = {
  loadCurrentUser(context, { spc }) {
    ErrorLogger.log("loadCurrentUser");
    return new Promise((resolve, reject) => {
      if (spc)
        spc
          .retrieveCurrentUserProfile()
          .then(profileData => {
            context.commit("castCurrentUser", profileData);
            let u = context.getters.current,
              accountName = u ? u.getAccountName() : null;
            if (accountName)
              spc
                .ensureSiteUserId({
                  accountName
                })
                .then(id => {
                  commit("setCurrentUserSiteID", id);
                  resolve();
                })
                .catch(error => {
                  // user does not exist in this site
                  // but that's not considered an error
                  resolve();
                });
            else resolve();
          })
          .catch(error => {
            reject(error);
          });
      else reject("No SharePointConnector provided");
    });
  }
};

// mutations
const mutations = {
  castCurrentUser(state, profileData) {
    state.current.mapProfileData(profileData);
  },
  setCurrentUserSiteID(state, id) {
    state.current.siteID = id;
  },
  setCurrentUserAsReadOnly(state) {
    state.current.setAsReadOnly();
  },
  setCurrentUserTestEmail() {
    state.current.email = "test-from@test.com";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

// error logger
const ErrorLogger = {
  log(message) {
    if (typeof window == "object" && typeof window.logger == "object")
      window.logger.log(message);
    else console.log(message);
  }
};
