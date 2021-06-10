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
      pet_name: "",
      pet_sterilized: false,
      pet_birth_date: "",
      pet_gender: null,
      pet_chip_number: "",
      pet_general_instructions: "",
      pet_breed_id: 0,
      pet_size_id: 0,
      pet_fur_id: 0,
      pet_food_id: 0,
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
      socialization: 0,
      energy: 0,
      bark: 0,
      anxiety: 0,
      aggressiveness: 0,
      general_temperament: 0,
      ride: false,
    },
    // Default format
    default_pet: {
      petId: 0,
      pet_avatar: "",
      pet_name: "",
      pet_sterilized: false,
      pet_birth_date: "",
      pet_gender: null,
      pet_chip_number: "",
      pet_general_instructions: "",
      pet_breed_id: 0,
      pet_size_id: 0,
      pet_fur_id: 0,
      pet_food_id: 0,
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
      socialization: 0,
      energy: 0,
      bark: 0,
      anxiety: 0,
      aggressiveness: 0,
      general_temperament: 0,
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
      state.pet = state.default_pet;
      state.vet_information = state.default_vet_information;
      state.pet_behavior = state.default_pet_behavior;
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
        let result = await axios.post(`/api/customers/${customerId}/pets`, {
          ...state.pet,
          ...state.vet_information,
          ...state.pet_behavior,
        });
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Mascota registrado exitosamente");
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
  },
  getters: {},
};
