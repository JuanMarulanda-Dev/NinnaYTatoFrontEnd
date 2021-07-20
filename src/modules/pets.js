import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    breeds: [],
    sizes: [],
    furs: [],
    foods: [],
    pet: {
      petId: 0,
      pet_avatar: "",
      pet_image: null,
      pet_name: "",
      pet_sterilized: "0",
      pet_birth_date: "",
      pet_gender: null,
      pet_chip_number: "",
      pet_general_instructions: "",
      pet_breed_id: "",
      pet_size_id: "",
      pet_fur_id: "",
      pet_food_id: "",
    },
    vet_information: {
      veterinarian_name: null,
      veterinarian_phone: null,
      veterinarian_ubication: null,
      rabies_vaccine: null,
      pentavalent_vaccine: null,
      cough_vaccine: null,
      vaccination_card: null,
      normal_locomotion: null,
      head: null,
      neck: null,
      front_legs: null,
      hind_legs: null,
      back: null,
      belly: null,
    },
    pet_behavior: {
      socialization: null,
      energy: null,
      bark: null,
      anxiety: null,
      aggressiveness: null,
      general_temperament: null,
      ride: false,
    },
    // Default format
    default_pet: {
      petId: 0,
      pet_avatar: "",
      pet_image: null,
      pet_name: "",
      pet_sterilized: "0",
      pet_birth_date: "",
      pet_gender: null,
      pet_chip_number: "",
      pet_general_instructions: "",
      pet_breed_id: "",
      pet_size_id: "",
      pet_fur_id: "",
      pet_food_id: "",
    },
    default_vet_information: {
      veterinarian_name: null,
      veterinarian_phone: null,
      veterinarian_ubication: null,
      rabies_vaccine: null,
      pentavalent_vaccine: null,
      cough_vaccine: null,
      vaccination_card: null,
      normal_locomotion: null,
      head: null,
      neck: null,
      front_legs: null,
      hind_legs: null,
      back: null,
      belly: null,
    },
    default_pet_behavior: {
      socialization: null,
      energy: null,
      bark: null,
      anxiety: null,
      aggressiveness: null,
      general_temperament: null,
      ride: false,
    },
  },
  mutations: {
    SET_BREEDS(state, breeds) {
      state.breeds = breeds;
    },
    SET_SIZES(state, sizes) {
      state.sizes = sizes;
    },
    SET_FURS(state, furs) {
      state.furs = furs;
    },
    SET_FOODS(state, foods) {
      state.foods = foods;
    },
    SET_PET_DEFAULT(state) {
      state.pet = Object.assign({}, state.default_pet);
      state.vet_information = Object.assign({}, state.default_vet_information);
      state.pet_behavior = Object.assign({}, state.default_pet_behavior);
    },
    SET_PET_DETAILS(state, details) {
      state.pet = details.pet;
      state.vet_information = details.vet_information;
      state.pet_behavior = details.pet_behavior;
    },
  },
  actions: {
    getAllBreeds({ commit }) {
      axios
        .get("/api/breeds")
        .then((result) => {
          commit("SET_BREEDS", result.data.breeds);
        })
        .catch(() => {});
    },
    getAllSizes({ commit }) {
      axios
        .get("/api/sizes")
        .then((result) => {
          commit("SET_SIZES", result.data.sizes);
        })
        .catch(() => {});
    },
    getAllFurs({ commit }) {
      axios
        .get("/api/furs")
        .then((result) => {
          commit("SET_FURS", result.data.furs);
        })
        .catch(() => {});
    },
    getAllFood({ commit }) {
      axios
        .get("/api/food")
        .then((result) => {
          commit("SET_FOODS", result.data.food);
        })
        .catch(() => {});
    },
    storePet({ state, commit }, customerId) {
      commit("SET_OVERLAY_LOADING", true, { root: true });

      let data = {
        ...state.pet,
        ...state.vet_information,
        ...state.pet_behavior,
      };

      let formData = new FormData();
      for (var key in data) {
        if (data[key] == null) {
          formData.append(key, "");
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "1" : "0");
        } else {
          formData.append(key, data[key]);
        }
      }

      return axios
        .post(`/api/customers/${customerId}/pets`, formData)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Mascota registrado exitosamente"
            );
            // Result
            return true;
          }
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
          return false;
        })
        .finally(() => {
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },
    updatePet({ state, commit }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });

      let data = {
        ...state.pet,
        ...state.vet_information,
        ...state.pet_behavior,
      };

      let formData = new FormData();
      for (var key in data) {
        if (data[key] == null) {
          formData.append(key, "");
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key] ? "1" : "0");
        } else {
          formData.append(key, data[key]);
        }
      }
      formData.append("_method", "put");

      return axios
        .post(`/api/pets/${state.pet.id}`, formData)
        .then((result) => {
          if (result.status == 201) {
            // show message
            this._vm.showToastMessage(
              result.status,
              "Mascota actualizado exitosamente"
            );
            // Result
            return true;
          }
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
          return false;
        })
        .finally(() => {
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },

    getDetailsPet({ commit }, petId) {
      commit("SET_LOADING_DATATABLE", true);
      axios
        .get(`/api/pets/${petId}`)
        .then((result) => {
          // save all
          commit("SET_PET_DETAILS", result.data.pet);
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
          return false;
        })
        .finally(() => {
          commit("SET_LOADING_DATATABLE", false);
        });
    },
    async changeStatusPet({ state, commit }) {
      commit("SET_OVERLAY_LOADING", true, { root: true });
      return axios
        .delete(`/api/pets/${state.pet.id}`)
        .then((result) => {
          if (result.status == 204) {
            // show message
            this._vm.showToastMessage(result.status);
            return true;
          } else {
            return false;
          }
        })
        .catch((errors) => {
          // show error message
          this._vm.showToastMessage(
            errors.response.status,
            this._vm.createMessageError(errors.response.data.errors)
          );
          return false;
        })
        .finally(() => {
          commit("SET_OVERLAY_LOADING", false, { root: true });
        });
    },
  },
  getters: {},
};
