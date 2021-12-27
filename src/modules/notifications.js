import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    notifications: [],
  },
  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
    },
  },
  actions: {
    getNotificationsByUser({ commit }, id) {
      return axios
        .get(`/api/notifications?user_id=${id}`)
        .then((result) => {
          if (result.status === 200) {
            // save all
            commit("SET_NOTIFICATIONS", result.data.notifications);
          }
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
        });
    },
    updateViewedNotifications({ state }, id) {
      return axios.put(`/api/notifications?user_id=${id}`).then((result) => {
        if (result.status == 201) {
          console.log(state);
        }
      });
    },
  },
};
