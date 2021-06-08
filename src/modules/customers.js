import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default {
  namespaced: true,
  state: {
    // Generals loading datatables
    loading: false,
    customers: [
      {
        id: 1,
        image: "https://cdn.vuetifyjs.com/images/john.jpg",
        dni: "1216727816",
        name: "Camilo muñoz",
        phone: "3004991084",
        email: "judama3012@gmail.com",
        state: true,
      },
      {
        id: 2,
        image: "",
        dni: "1216727816",
        name: "Juan David Marulanda",
        phone: "3004991084",
        email: "judama3012@gmail.com",
        state: false,
      },
    ],
    personal_infomation: {
      id: 0,
      dni: "",
      first_name: "",
      last_name: "",
      gender: null,
      address: "",
    },
    contact_information: {
      email: "",
      phone: "",
      emergency_conctact_name: "",
      emergency_conctact_phone: "",
      backup_conctact_name: "",
      backup_conctact_phone: "",
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
  mutations: {},
  actions: {},
  getters: {},
};
