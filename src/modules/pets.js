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
    async getAllBreeds({ commit }) {
      try {
        // Activar el loading del datatable
        let result = await axios.get("/api/breeds");
        commit("SET_BREEDS", result.data.breeds);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      }
    },
    async getAllSizes({ commit }) {
      try {
        // Activar el loading del datatable
        let result = await axios.get("/api/sizes");
        commit("SET_SIZES", result.data.sizes);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      }
    },
    async getAllFurs({ commit }) {
      try {
        // Activar el loading del datatable
        let result = await axios.get("/api/furs");
        commit("SET_FURS", result.data.furs);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      }
    },
    async getAllFood({ commit }) {
      try {
        // Activar el loading del datatable
        let result = await axios.get("/api/food");
        commit("SET_FOODS", result.data.food);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      }
    },
    async storePet({ state, commit }, customerId) {
      try {
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

        let result = await axios.post(
          `/api/customers/${customerId}/pets`,
          formData
        );
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Mascota registrado exitosamente");
          return true;
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
        return false;
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },
    async updatePet({ state, commit }) {
      try {
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
        let result = await axios.post(`/api/pets/${state.pet.id}`, formData);
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Mascota actualizado exitosamente");
          // Reset object with default information
          commit("SET_PET_DEFAULT");
          return true;
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
        return false;
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },
    async getDetailsPet({ commit }, petId) {
      try {
        // Activar el loading del datatable
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.get(`/api/pets/${petId}`);
        commit("SET_PET_DETAILS", result.data.pet);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },
    async changeStatusPet({ state, commit }) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.delete(`/api/pets/${state.pet.id}`);
        if (result.status == 204) {
          // show message
          this._vm.$toast.success("Estado cambiado exitosamente");
          return true;
        } else {
          return false;
        }
      } catch (error) {
        this._vm.$toast.error("Ocurrio un error");
        return false;
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },
  },
  getters: {},
};
