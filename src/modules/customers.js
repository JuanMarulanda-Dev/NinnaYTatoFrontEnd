import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    pets: [],
    customers: [],
    how_contact: [],
    personal_infomation: {
      id: 0,
      dni: "",
      first_name: "",
      last_name: "",
      gender: null,
      address: "",
      branch_office_id: "",
    },
    contact_information: {
      email: "",
      phone: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      backup_contact_name: "",
      backup_contact_phone: "",
    },
    additional_information: {
      customer_avatar: "",
      social_network: "",
      how_contact_id: 0,
    },
    // Default format
    default_personal_infomation: {
      id: 0,
      dni: "",
      first_name: "",
      last_name: "",
      gender: null,
      address: "",
      branch_office_id: "",
    },
    default_contact_information: {
      email: "",
      phone: "",
      emergency_conctact_name: "",
      emergency_conctact_phone: "",
      backup_conctact_name: "",
      backup_conctact_phone: "",
    },
    default_additional_information: {
      customer_avatar: "",
      social_network: "",
      how_contact_id: 0,
    },
  },
  mutations: {
    SET_CUSTOMERS(state, customers) {
      state.customers = customers;
    },
    SET_CUSTOMER_PETS(state, pets) {
      state.pets = pets;
    },
    SET_CUSTOMER_DETAILS(state, customer) {
      state.personal_infomation = customer.personal_infomation;
      state.contact_information = customer.contact_information;
      state.additional_information = customer.additional_information;
    },
    SET_LOADING_DATATABLE(state, status) {
      state.loading = status;
    },
    SET_HOW_CONTACT(state, how_contact) {
      state.how_contact = how_contact;
    },
  },
  actions: {
    async getAllCustomers({ commit }) {
      try {
        // Activar el loading del datatable
        commit("SET_LOADING_DATATABLE", true);
        let result = await axios.get("/api/customers");
        commit("SET_CUSTOMERS", result.data.customers);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      } finally {
        commit("SET_LOADING_DATATABLE", false);
      }
    },
    async getDetailsCustomer({ commit }, customerId) {
      try {
        // Activar el loading del datatable
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.get(`/api/customers/${customerId}`);
        console.log(result.data);
        commit("SET_CUSTOMER_DETAILS", result.data.customer);
        commit("SET_CUSTOMER_PETS", result.data.pets);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      } finally {
        commit("SET_OVERLAY_LOADING", false, { root: true });
      }
    },
    async getAllHowContact({ commit }) {
      try {
        // Activar el loading del datatable
        let result = await axios.get("/api/how-contact");
        commit("SET_HOW_CONTACT", result.data.how_contact);
      } catch (error) {
        this._vm.$toast.error("Ocurrior un error...");
      }
    },
    async storeCustomer({ state, commit }, pet) {
      try {
        commit("SET_OVERLAY_LOADING", true, { root: true });
        let result = await axios.post("/api/customers", {
          ...state.personal_infomation,
          ...state.contact_information,
          ...state.additional_information,
          ...pet,
        });
        if (result.status == 201) {
          // show message
          this._vm.$toast.success("Cliente registrado exitosamente");
          // // Reload branch officess
          return true;
          // dispatch("getAllBranchOffices");
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
